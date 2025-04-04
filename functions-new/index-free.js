/**
 * Firebase Functions for free Spark plan
 * This version removes features that require the Blaze plan
 */

const {onRequest, onCall} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

// Simple hello world function that works on free plan
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Store application data in Firestore (works on free plan)
exports.storeApplication = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new Error('User must be authenticated');
  }

  try {
    const { applicationData } = data;
    
    if (!applicationData) {
      throw new Error('Application data is required');
    }

    // Add application to Firestore
    const applicationRef = await admin.firestore().collection('applications').add({
      ...applicationData,
      applicantId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });

    // Create a notification in Firestore instead of sending email
    await admin.firestore().collection('notifications').add({
      recipientId: applicationData.jobOwnerId,
      message: `New job application received for ${applicationData.jobTitle} from ${applicationData.fullName}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'application',
      applicationId: applicationRef.id,
      jobId: applicationData.jobId
    });

    return { 
      success: true, 
      applicationId: applicationRef.id,
      message: 'Application submitted successfully! The employer will be notified in their dashboard.'
    };
  } catch (error) {
    logger.error('Error storing application:', error);
    throw new Error('Failed to store application: ' + error.message);
  }
});

// Trigger when a new application is created (works on free plan)
exports.onApplicationCreated = onDocumentCreated('applications/{applicationId}', async (event) => {
  const application = event.data.data();
  const applicationId = event.data.id;
  
  try {
    // Create a notification in Firestore
    await admin.firestore().collection('notifications').add({
      recipientId: application.jobOwnerId,
      message: `New job application received for ${application.jobTitle} from ${application.fullName}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'application',
      applicationId: applicationId,
      jobId: application.jobId
    });
    
    logger.info('Notification created for application:', applicationId);
    return { success: true };
  } catch (error) {
    logger.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
});

// Update application status (works on free plan)
exports.updateApplicationStatus = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new Error('User must be authenticated');
  }

  try {
    const { applicationId, status } = data;
    
    if (!applicationId || !status) {
      throw new Error('Application ID and status are required');
    }

    // Verify the user is the job owner
    const applicationDoc = await admin.firestore().collection('applications').doc(applicationId).get();
    
    if (!applicationDoc.exists) {
      throw new Error('Application not found');
    }
    
    const application = applicationDoc.data();
    
    if (application.jobOwnerId !== context.auth.uid) {
      throw new Error('Only the job owner can update the application status');
    }

    // Update the application status
    await admin.firestore().collection('applications').doc(applicationId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create a notification for the applicant
    await admin.firestore().collection('notifications').add({
      recipientId: application.applicantId,
      message: `Your application for ${application.jobTitle} has been ${status}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'status-update',
      applicationId: applicationId,
      jobId: application.jobId,
      status
    });

    return { 
      success: true, 
      message: `Application status updated to ${status}`
    };
  } catch (error) {
    logger.error('Error updating application status:', error);
    throw new Error('Failed to update application status: ' + error.message);
  }
});