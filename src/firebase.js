// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  sendEmailVerification
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Detect mobile
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// 1. Google Sign-In (Mobile Redirect + Desktop Popup)
export const signInWithGoogle = async () => {
  try {
    if (isMobile()) {
      await signInWithRedirect(auth, provider);
    } else {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user, {
        createdVia: 'google',
        userType: 'jobseeker',
        isProfileComplete: false
      });
      return result;
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// 2. Handle Google Redirect Result (Mobile)
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await createUserProfile(result.user, {
        createdVia: 'google',
        userType: 'jobseeker',
        isProfileComplete: false
      });
      return result.user;
    }
  } catch (error) {
    console.error('Redirect result error:', error);
  }
  return null;
};

// 3. Create/Update User Profile
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!userSnapshot.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified || false,
        displayName: user.displayName || additionalData.fullName || '',
        photoURL: user.photoURL || '',
        createdAt: now,
        lastLoginAt: now,
        ...additionalData
      };
      await setDoc(userRef, userData);
    } else {
      const updateData = { lastLoginAt: now };
      if (additionalData.fullName && !userSnapshot.data().displayName) {
        updateData.displayName = additionalData.fullName;
      }
      await updateDoc(userRef, updateData);
    }
    return userRef;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
};

// 4. Send Verification Email
export const sendVerificationEmail = async (user) => {
  try {
    if (!user) return false;
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error('Email verification error:', error);
    return false;
  }
};

// 5. Check if user exists
export const checkIfUserExists = async (email) => {
  try {
    if (!email) return false;
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
};

// 6. Send Notification
export const sendNotificationToOwner = async (ownerId, applicationData) => {
  try {
    if (!ownerId) return { success: false, error: 'Owner ID required' };

    const notificationRef = collection(db, 'notifications');
    const notificationData = {
      recipientId: ownerId,
      message: `New application from ${applicationData.fullName}`,
      createdAt: new Date().toISOString(),
      read: false,
      type: 'application',
      applicationId: applicationData.applicationId,
      jobId: applicationData.jobId,
      jobTitle: applicationData.jobTitle || 'Untitled Job',
      fullName: applicationData.fullName,
      resumeLink: applicationData.resumeLink || '',
      status: 'pending'
    };

    const docRef = await addDoc(notificationRef, notificationData);
    return { success: true, notificationId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 7. Fetch Application Details
export const fetchApplicationDetails = async (applicationId) => {
  try {
    if (!applicationId) return null;
    const docRef = doc(db, 'applications', applicationId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { id: applicationId, notFound: true };
    }
    return { id: applicationId, ...docSnap.data() };
  } catch (error) {
    return { id: applicationId, error: true };
  }
};

// 8. Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    return null;
  }
};

// Export Firebase Auth methods
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };