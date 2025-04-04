const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

// Check if admin is already initialized
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

// Get Firestore reference
const db = admin.firestore();

// Function to get email credentials from Firestore
async function getEmailCredentials() {
  try {
    // Try to get credentials from Firestore
    const settingsDoc = await db.collection('settings').doc('email').get();

    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      console.log('Found email settings in Firestore');
      return {
        user: data.email,
        pass: data.password
      };
    } else {
      console.log('No email settings found in Firestore, using environment variables');
      return {
        user: process.env.EMAIL_USER || 'jobboardweb@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      };
    }
  } catch (error) {
    console.error('Error getting email credentials:', error);
    return {
      user: process.env.EMAIL_USER || 'jobboardweb@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    };
  }
}

// Create a function to get the transporter
async function getTransporter() {
  const credentials = await getEmailCredentials();

  console.log('Creating email transporter with user:', credentials.user);

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: credentials.user,
      pass: credentials.pass
    }
  });
}

// Callable function version (for use with Firebase SDK)
exports.sendApplicationEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    console.log('Received request to send application email');
    const { to, subject, html, resumeUrl, applicationData } = data;

    if (!to || !subject) {
      console.error('Missing required parameters:', { to, subject });
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function requires "to" and "subject" parameters.'
      );
    }

    console.log('Sending email to:', to);
    console.log('Email subject:', subject);

    // Determine which email content to use
    let emailContent;

    if (html) {
      // If HTML content is provided directly, use it
      emailContent = html;
      console.log('Using provided HTML content');

      // Add resume link if available
      if (resumeUrl) {
        console.log('Adding resume link to email:', resumeUrl);
        emailContent += `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-weight: bold;">Resume Attachment</p>
            <p style="margin: 10px 0 0 0;">
              <a href="${resumeUrl}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                Click here to download the applicant's resume
              </a>
            </p>
          </div>
        `;
      }
    }
    else if (applicationData) {
      // If application data is provided, create a formatted email with accept/reject buttons
      console.log('Creating email from application data:', applicationData.applicationId);

      const baseUrl = 'https://job-board-web.web.app';
      const acceptUrl = `${baseUrl}/update-status?applicationId=${applicationData.applicationId}&status=accepted`;
      const rejectUrl = `${baseUrl}/update-status?applicationId=${applicationData.applicationId}&status=rejected`;

      emailContent = `
        <h2>New Job Application Received</h2>
        <p>A new application has been submitted for ${applicationData.jobTitle}</p>
        <h3>Applicant Details:</h3>
        <ul>
          <li>Name: ${applicationData.fullName}</li>
          <li>Email: ${applicationData.email}</li>
          <li>Phone: ${applicationData.phone || 'Not provided'}</li>
          <li>Application ID: ${applicationData.applicationId}</li>
        </ul>
        ${applicationData.experience ? `
        <h3>Experience:</h3>
        <p>${applicationData.experience}</p>
        ` : ''}
        ${applicationData.coverLetter ? `
        <h3>Cover Letter:</h3>
        <p>${applicationData.coverLetter}</p>
        ` : ''}
        ${resumeUrl || applicationData.resumeUrl ? `
        <div style="margin-top: 20px; padding: 15px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold;">Resume Attachment</p>
          <p style="margin: 10px 0 0 0;">
            <a href="${resumeUrl || applicationData.resumeUrl}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">
              Click here to download the applicant's resume
            </a>
          </p>
        </div>
        ` : ''}
        <div style="margin-top: 20px;">
          <a href="${acceptUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;">Accept Application</a>
          <a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none;">Reject Application</a>
        </div>
      `;
    } else {
      console.error('Missing both html and applicationData parameters');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function requires either "html" or "applicationData" parameter.'
      );
    }

    // Get the email transporter
    const transporter = await getTransporter();

    // Get email credentials for the from field
    const credentials = await getEmailCredentials();

    console.log('Sending email with transporter');

    // Send email
    const result = await transporter.sendMail({
      from: credentials.user,
      to,
      subject,
      html: emailContent
    });

    console.log('Email sent successfully:', result);

    // Store a record of the sent email in Firestore
    try {
      await db.collection('sentEmails').add({
        to,
        subject,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: true,
        applicationId: applicationData?.applicationId || null,
        messageId: result.messageId || null
      });
      console.log('Email record stored in Firestore');
    } catch (dbError) {
      console.error('Error storing email record:', dbError);
      // Don't fail the function if just the record storage fails
    }

    return { success: true, message: 'Email sent successfully', messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);

    // Store a record of the failed email attempt
    try {
      await db.collection('sentEmails').add({
        to: data.to,
        subject: data.subject,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: false,
        error: error.message,
        applicationId: data.applicationData?.applicationId || null
      });
      console.log('Failed email record stored in Firestore');
    } catch (dbError) {
      console.error('Error storing failed email record:', dbError);
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to send email: ' + error.message,
      error
    );
  }
});

// HTTP version (for use with direct HTTP requests)
exports.sendApplicationEmailHttp = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    console.log('Received HTTP request to send application email');
    const { to, subject, applicationData } = req.body;

    if (!to || !subject || !applicationData) {
      console.error('Missing required parameters in HTTP request:', req.body);
      res.status(400).send({ error: 'Missing required parameters' });
      return;
    }

    console.log('Sending email via HTTP endpoint to:', to);

    // Create accept/reject URLs
    const baseUrl = 'https://job-board-web.web.app';
    const acceptUrl = `${baseUrl}/update-status?applicationId=${applicationData.applicationId}&status=accepted`;
    const rejectUrl = `${baseUrl}/update-status?applicationId=${applicationData.applicationId}&status=rejected`;

    // HTML email template with action buttons
    const htmlContent = `
      <h2>New Job Application Received</h2>
      <p>A new application has been submitted for ${applicationData.jobTitle}</p>
      <h3>Applicant Details:</h3>
      <ul>
        <li>Name: ${applicationData.fullName}</li>
        <li>Email: ${applicationData.email}</li>
        <li>Phone: ${applicationData.phone || 'Not provided'}</li>
        <li>Application ID: ${applicationData.applicationId}</li>
      </ul>
      ${applicationData.experience ? `
      <h3>Experience:</h3>
      <p>${applicationData.experience}</p>
      ` : ''}
      ${applicationData.coverLetter ? `
      <h3>Cover Letter:</h3>
      <p>${applicationData.coverLetter}</p>
      ` : ''}
      ${applicationData.resumeUrl ? `
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 5px;">
        <p style="margin: 0; font-weight: bold;">Resume Attachment</p>
        <p style="margin: 10px 0 0 0;">
          <a href="${applicationData.resumeUrl}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">
            Click here to download the applicant's resume
          </a>
        </p>
      </div>
      ` : ''}
      <div style="margin-top: 20px;">
        <a href="${acceptUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;">Accept Application</a>
        <a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none;">Reject Application</a>
      </div>
    `;

    // Get the email transporter
    const transporter = await getTransporter();

    // Get email credentials for the from field
    const credentials = await getEmailCredentials();

    console.log('Sending email with HTTP transporter');

    // Send email
    const result = await transporter.sendMail({
      from: credentials.user,
      to,
      subject,
      html: htmlContent
    });

    console.log('Email sent successfully via HTTP endpoint:', result);

    // Store a record of the sent email in Firestore
    try {
      await db.collection('sentEmails').add({
        to,
        subject,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: true,
        applicationId: applicationData.applicationId || null,
        messageId: result.messageId || null,
        method: 'http'
      });
      console.log('HTTP email record stored in Firestore');
    } catch (dbError) {
      console.error('Error storing HTTP email record:', dbError);
      // Don't fail the function if just the record storage fails
    }

    res.status(200).send({ message: 'Email sent successfully', messageId: result.messageId });
  } catch (error) {
    console.error('Error sending email via HTTP endpoint:', error);

    // Store a record of the failed email attempt
    try {
      await db.collection('sentEmails').add({
        to: req.body.to,
        subject: req.body.subject,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: false,
        error: error.message,
        applicationId: req.body.applicationData?.applicationId || null,
        method: 'http'
      });
      console.log('Failed HTTP email record stored in Firestore');
    } catch (dbError) {
      console.error('Error storing failed HTTP email record:', dbError);
    }

    res.status(500).send({ error: 'Failed to send email: ' + error.message });
  }
});