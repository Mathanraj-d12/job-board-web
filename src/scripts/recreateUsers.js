// Script to create user documents in Firestore
import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Creates a user document in Firestore for the current authenticated user
 * This is useful when the users collection doesn't exist or user documents are missing
 */
async function createUserDocument() {
  try {
    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('You must be logged in to create a user document');
      return {
        success: false,
        message: 'You must be logged in to create a user document'
      };
    }

    console.log('Starting user document creation process...');

    // Check if the user document already exists
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log(`User document for ${currentUser.email} already exists`);
      return {
        success: true,
        message: `User document for ${currentUser.email} already exists`,
        alreadyExists: true
      };
    } else {
      // Create a new user document with basic information
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || '',
        createdAt: currentUser.metadata.creationTime,
        lastLoginAt: currentUser.metadata.lastSignInTime,
        // Add any default fields that might be needed by your application
        userType: 'regular', // or determine based on email domain or other logic
        isProfileComplete: false,
        notificationSettings: {
          email: true,
          push: true,
          applicationUpdates: true,
          jobAlerts: true
        }
      };

      await setDoc(userDocRef, userData);
      console.log(`Created user document for ${currentUser.email}`);

      return {
        success: true,
        message: `Successfully created user document for ${currentUser.email}`,
        userData
      };
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    return {
      success: false,
      message: `Error creating user document: ${error.message}`,
      error
    };
  }
}

// Export the function
export default createUserDocument;