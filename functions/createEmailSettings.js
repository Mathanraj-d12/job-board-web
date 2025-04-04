const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * This script creates or updates the email settings document in Firestore
 * Run this script with Firebase Functions shell to set up email credentials
 * 
 * Usage:
 * 1. cd functions
 * 2. firebase functions:shell
 * 3. .load createEmailSettings.js
 * 4. createEmailSettings('your-email@gmail.com', 'your-app-password')
 */
async function createEmailSettings(email, password) {
  if (!email || !password) {
    console.error('Email and password are required');
    return;
  }
  
  try {
    await db.collection('settings').doc('email').set({
      email: email,
      password: password,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Email settings created/updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating email settings:', error);
    return { success: false, error: error.message };
  }
}

// Export the function
module.exports = { createEmailSettings };