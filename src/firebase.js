import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc, query, where, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCseXT0j5-qAGmOZrmnAWEuF3uK6l4QpHg",
  authDomain: "job-board-web.firebaseapp.com",
  databaseURL: "https://job-board-web-default-rtdb.firebaseio.com",
  projectId: "job-board-web",
  storageBucket: "job-board-web.appspot.com",
  messagingSenderId: "347576977073",
  appId: "1:347576977073:web:43d1217e5329c7a352c490",
  measurementId: "G-NTGV46LLNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

/**
 * Request browser notification permission
 * @returns {Promise<string|null>} Permission status or null if error
 */
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Sign in with Google authentication
 * @returns {Promise<object|null>} User credential or null if error
 */
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    // Create or update user profile in Firestore
    await createUserProfile(result.user, {
      createdVia: 'google',
      userType: 'jobseeker', // Default user type
      isProfileComplete: false
    });

    return result;
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message);
    throw error; // Rethrow to allow handling in UI components
  }
};

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object|null>} User credential or null if error
 */
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Registration error:', error.code, error.message);
    throw error; // Rethrow to allow handling in UI components
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error.code, error.message);
    throw error;
  }
};

/**
 * Send notification to job owner about new application
 * @param {string} ownerId - ID of the job owner
 * @param {object} applicationData - Application data
 * @returns {Promise<{success: boolean, notificationId?: string, error?: string}>} Result object
 */
const sendNotificationToOwner = async (ownerId, applicationData) => {
  try {
    if (!ownerId) {
      return { success: false, error: 'Owner ID is required' };
    }

    const notificationRef = collection(db, 'notifications');
    const notificationData = {
      recipientId: ownerId,
      message: `New job application received for ${applicationData.jobTitle} from ${applicationData.fullName}`,
      createdAt: new Date().toISOString(),
      read: false,
      type: 'application',
      applicationId: applicationData.applicationId,
      jobId: applicationData.jobId,
      // Only include the resume link and basic info, removing detailed applicant information
      fullName: applicationData.fullName,
      resumeLink: applicationData.resumeLink || '',
      status: 'pending'
    };

    // Add notification to Firestore
    const docRef = await addDoc(notificationRef, notificationData);

    // Return success with notification ID instead of showing alert
    return {
      success: true,
      notificationId: docRef.id,
      message: 'Application submitted successfully! The employer will be notified in their dashboard.'
    };

    // Email functionality has been completely removed
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: error.message || 'Failed to send notification to employer'
    };
  }
};



/**
 * Fetch application details for a notification
 * @param {string} applicationId - ID of the application to fetch
 * @returns {Promise<object>} Application data or placeholder if not found
 */
const fetchApplicationDetails = async (applicationId) => {
  try {
    if (!applicationId) {
      console.warn('fetchApplicationDetails called without applicationId');
      return null;
    }

    const applicationRef = doc(db, 'applications', applicationId);
    const applicationDoc = await getDoc(applicationRef);

    if (!applicationDoc.exists()) {
      console.info(`Application with ID ${applicationId} not found`);
      // Return a simplified placeholder object to prevent errors in the UI
      return {
        id: applicationId,
        notFound: true,
        fullName: 'Application Deleted',
        resumeLink: '',
        status: 'deleted',
        appliedAt: new Date().toISOString()
      };
    }

    return { id: applicationId, ...applicationDoc.data() };
  } catch (error) {
    console.error(`Error fetching application ${applicationId}:`, error);
    // Return a simplified placeholder object to prevent errors in the UI
    return {
      id: applicationId,
      error: true,
      fullName: 'Error Loading Application',
      resumeLink: '',
      status: 'error',
      appliedAt: new Date().toISOString()
    };
  }
};

/**
 * Check if a user with the given email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
const checkIfUserExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

/**
 * Create a user profile in Firestore
 * @param {object} user - Firebase Auth user object
 * @param {object} additionalData - Additional user data to store
 * @returns {Promise<void>}
 */
const createUserProfile = async (user, additionalData = {}) => {
  if (!user) {
    console.warn('createUserProfile called without user object');
    return null;
  }

  try {
    // Reference to the user document in Firestore
    const userRef = doc(db, 'users', user.uid);

    // Check if the user document already exists
    const userSnapshot = await getDoc(userRef);

    // If the user document doesn't exist, create it
    if (!userSnapshot.exists()) {
      const createdAt = new Date().toISOString();

      // Data to store in Firestore
      const userData = {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified || false,
        displayName: user.displayName || additionalData.fullName || '',
        photoURL: user.photoURL || '',
        createdAt,
        lastLoginAt: createdAt,
        ...additionalData
      };

      // Create the user document in Firestore
      await setDoc(userRef, userData);
      console.log('User profile created in Firestore:', userData);
      return userRef;
    } else {
      // Update the last login time if the user already exists
      const updateData = {
        lastLoginAt: new Date().toISOString()
      };

      // If we have a displayName in additionalData but not in the user profile, update it
      if (additionalData.fullName && !userSnapshot.data().displayName) {
        updateData.displayName = additionalData.fullName;
      }

      await updateDoc(userRef, updateData);
      console.log('User profile already exists, updated last login time');
      return userRef;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    // Don't throw the error, just return null to prevent app crashes
    return null;
  }
};

// Export Firebase services for use in other components
export {
  auth,
  requestNotificationPermission,
  signInWithGoogle,
  registerUser,
  logoutUser,
  sendNotificationToOwner,
  fetchApplicationDetails,
  checkIfUserExists,
  createUserProfile,
  db,
  functions,
  createUserWithEmailAndPassword
};
