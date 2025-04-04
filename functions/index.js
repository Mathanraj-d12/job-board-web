const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { sendApplicationEmail, sendApplicationEmailHttp } = require("./sendApplicationEmail");
const { createEmailSettings } = require("./createEmailSettings");

// Initialize Firebase Admin SDK if not already initialized
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

// Export the email functions
exports.sendApplicationEmail = sendApplicationEmail;
exports.sendApplicationEmailHttp = sendApplicationEmailHttp;

// Export utility functions
exports.createEmailSettings = functions.https.onCall(async (data, context) => {
  // Only allow admin users to set email settings
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admin users can set email settings'
    );
  }

  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email and password are required'
      );
    }

    await admin.firestore().collection('settings').doc('email').set({
      email,
      password,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Email settings updated successfully' };
  } catch (error) {
    console.error('Error updating email settings:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to update email settings',
      error.message
    );
  }
});

// Test email function
exports.testEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    const { to } = data;
    if (!to) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Recipient email (to) is required'
      );
    }

    // Call the sendApplicationEmail function with test data
    const testData = {
      to,
      subject: 'Test Email from Job Board',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Job Board application.</p>
        <p>If you received this email, the email functionality is working correctly.</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `
    };

    // Use the same logic as the sendApplicationEmail function
    const { getTransporter, getEmailCredentials } = require('./sendApplicationEmail');
    const transporter = await getTransporter();
    const credentials = await getEmailCredentials();

    const result = await transporter.sendMail({
      from: credentials.user,
      to,
      subject: testData.subject,
      html: testData.html
    });

    // Store a record of the test email
    await admin.firestore().collection('sentEmails').add({
      to,
      subject: testData.subject,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
      type: 'test',
      messageId: result.messageId || null
    });

    return { success: true, message: 'Test email sent successfully', messageId: result.messageId };
  } catch (error) {
    console.error('Error sending test email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send test email',
      error.message
    );
  }
});

// Trigger when a new job application is created
exports.onApplicationCreated = functions.firestore
  .document('applications/{applicationId}')
  .onCreate(async (snap, context) => {
    const application = snap.data();
    const jobOwnerId = application.jobOwnerId;

    try {
      // Get the job owner's FCM token from their user document
      const userDoc = await admin.firestore().collection('users').doc(jobOwnerId).get();
      const fcmToken = userDoc.data()?.fcmToken;

      if (fcmToken) {
        const message = {
          notification: {
            title: 'New Job Application',
            body: `Someone has applied for your job posting: ${application.jobTitle}`,
          },
          token: fcmToken
        };

        await admin.messaging().send(message);
        console.log('Notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });

// Callable function for sending notifications
exports.sendNotificationToOwner = functions.https.onRequest((req, res) => {
  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  return cors(req, res, async () => {
    try {
      // Verify authentication token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          error: 'unauthenticated',
          message: 'User must be authenticated'
        });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      await admin.auth().verifyIdToken(idToken);

      const { message } = req.body;
      if (!message || !message.token) {
        res.status(400).json({
          error: 'invalid-argument',
          message: 'Message data is required'
        });
        return;
      }

      await admin.messaging().send(message);
      res.json({ success: true, message: "Notification sent" });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ 
        error: 'internal', 
        message: error.message || 'Error sending notification'
      });
    }
  });
});
