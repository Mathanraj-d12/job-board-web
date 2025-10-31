import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Badge,
  Chip,
  IconButton,
  Avatar,
  Grid,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { auth, db, fetchApplicationDetails } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc, deleteDoc } from 'firebase/firestore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ResumeDownloadNotification from '../components/ResumeDownloadNotification';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [applications, setApplications] = useState([]);
  const [postedJobApplications, setPostedJobApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [applicationDetails, setApplicationDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [userDocExists, setUserDocExists] = useState(null); // null = unknown, true = exists, false = doesn't exist
  const [resumeNotification, setResumeNotification] = useState({
    open: false,
    resumeLink: '',
    applicantName: ''
  });

  const handleCloseResumeNotification = () => {
    setResumeNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleViewResume = (resumeLink) => {
    setResumeNotification({
      open: true,
      resumeLink,
      applicantName: ''
    });
  };

  // Function to check if the user document exists in Firestore
  const checkUserDocExists = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      setUserDocExists(userDoc.exists());
      return userDoc.exists();
    } catch (error) {
      console.error("Error checking user document:", error);
      setUserDocExists(false);
      return false;
    }
  };

  // Function to fetch jobs posted by the user
  const fetchPostedJobs = async (userId) => {
    try {
      // First, try to find jobs by userId
      const q = query(collection(db, "jobs"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const jobs = [];

      // Process jobs and update any missing userEmail field
      for (const docSnapshot of querySnapshot.docs) {
        const jobData = docSnapshot.data();
        const jobId = docSnapshot.id;

        // Check if userEmail is missing and user is available
        if (!jobData.userEmail && auth.currentUser) {
          try {
            // Update the job with the current user's email
            await updateDoc(doc(db, "jobs", jobId), {
              userEmail: auth.currentUser.email
            });

            // Add the email to the job data for display
            jobData.userEmail = auth.currentUser.email;
            console.log(`Updated job ${jobId} with email ${auth.currentUser.email}`);
          } catch (updateError) {
            console.error("Error updating job with email:", updateError);
          }
        }

        jobs.push({ id: jobId, ...jobData });
      }

      // If the user's ID has changed (e.g., after account deletion and recreation),
      // also check for jobs with matching email
      if (auth.currentUser?.email) {
        const emailQuery = query(collection(db, "jobs"), where("userEmail", "==", auth.currentUser.email));
        const emailQuerySnapshot = await getDocs(emailQuery);

        for (const docSnapshot of emailQuerySnapshot.docs) {
          // Only add jobs that weren't already found by userId
          if (!jobs.some(job => job.id === docSnapshot.id)) {
            jobs.push({ id: docSnapshot.id, ...docSnapshot.data() });
          }
        }
      }

      setPostedJobs(jobs);
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
      setSubmitError("Failed to load your posted jobs");
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchApplications(currentUser.uid);
      fetchPostedJobApplications(currentUser.uid);
      fetchPostedJobs(currentUser.uid); // Fetch user's posted jobs
      checkUserDocExists(currentUser.uid);

      let unsubscribeNotifications = null;
      const setupNotifications = async () => {
        unsubscribeNotifications = await fetchNotifications(currentUser.uid);
      };
      setupNotifications();
      return () => {
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
        }
      };
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const fetchApplications = async (userId) => {
    try {
      const q = query(collection(db, "applications"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const apps = [];
      for (const docSnapshot of querySnapshot.docs) {
        const application = { id: docSnapshot.id, ...docSnapshot.data() };
        const jobDoc = await getDoc(doc(db, "jobs", application.jobId));
        if (jobDoc.exists()) {
          apps.push(application);
        }
      }
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setSubmitError("Failed to load your applications");
    }
  };

  const fetchPostedJobApplications = async (userId) => {
    try {
      const q = query(collection(db, "applications"), where("jobPosterEmail", "==", user ? user.email : ""));
      const querySnapshot = await getDocs(q);
      const apps = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      setPostedJobApplications(apps);
    } catch (error) {
      console.error("Error fetching posted job applications:", error);
      setSubmitError("Failed to load applications for your posted jobs");
    }
  };

  const handleApplicationStatus = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, "applications", applicationId);
      const applicationSnap = await getDoc(applicationRef);
      if (!applicationSnap.exists()) {
        setSubmitError("Application not found. It may have been deleted.");
        return;
      }
      const applicationData = applicationSnap.data();
      const timestamp = new Date().toISOString();
      await updateDoc(applicationRef, {
        status: newStatus,
        statusUpdatedAt: timestamp
      });
      setPostedJobApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus, statusUpdatedAt: timestamp } : app
        )
      );
      if (applicationDetails[applicationId]) {
        setApplicationDetails(prev => ({
          ...prev,
          [applicationId]: { ...prev[applicationId], status: newStatus, statusUpdatedAt: timestamp }
        }));
      }
      setSubmitError("");
      const actionText = newStatus === 'accepted' ? 'accepted' : 'rejected';
      const successMessage = `Application from ${applicationData.fullName} has been ${actionText}.`;
      const statusDiv = document.createElement('div');
      statusDiv.style.position = 'fixed';
      statusDiv.style.top = '20px';
      statusDiv.style.left = '50%';
      statusDiv.style.transform = 'translateX(-50%)';
      statusDiv.style.backgroundColor = newStatus === 'accepted' ? '#059669' : '#DC2626';
      statusDiv.style.color = 'white';
      statusDiv.style.padding = '12px 24px';
      statusDiv.style.borderRadius = '4px';
      statusDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      statusDiv.style.zIndex = '9999';
      statusDiv.style.fontWeight = 'bold';
      statusDiv.style.fontSize = '16px';
      statusDiv.textContent = successMessage;
      document.body.appendChild(statusDiv);
      setTimeout(() => {
        document.body.removeChild(statusDiv);
      }, 3000);
      fetchPostedJobApplications(user.uid);
    } catch (error) {
      console.error("Error updating application status:", error);
      setSubmitError("Failed to update application status");
    }
  };

  // Function to delete an application
  const handleDeleteApplication = async (applicationId, applicantName) => {
    try {
      // Ask for confirmation before deleting
      if (!window.confirm(`Are you sure you want to delete the application from ${applicantName}? This action cannot be undone.`)) {
        return;
      }

      const applicationRef = doc(db, "applications", applicationId);
      await deleteDoc(applicationRef);

      // Update the state to remove the deleted application
      setPostedJobApplications(prev => prev.filter(app => app.id !== applicationId));

      // Show success message
      const successMessage = `Application from ${applicantName} has been deleted.`;
      const statusDiv = document.createElement('div');
      statusDiv.style.position = 'fixed';
      statusDiv.style.top = '20px';
      statusDiv.style.left = '50%';
      statusDiv.style.transform = 'translateX(-50%)';
      statusDiv.style.backgroundColor = '#DC2626';
      statusDiv.style.color = 'white';
      statusDiv.style.padding = '12px 24px';
      statusDiv.style.borderRadius = '4px';
      statusDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      statusDiv.style.zIndex = '9999';
      statusDiv.style.fontWeight = 'bold';
      statusDiv.style.fontSize = '16px';
      statusDiv.textContent = successMessage;
      document.body.appendChild(statusDiv);
      setTimeout(() => {
        document.body.removeChild(statusDiv);
      }, 3000);

      setSubmitError("");
    } catch (error) {
      console.error("Error deleting application:", error);
      setSubmitError("Failed to delete application");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error during sign out:", error);
      setSubmitError("An error occurred during sign out. Please try again.");
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const q = query(collection(db, "notifications"), where("recipientId", "==", userId));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const newNotifications = [];
        let newUnreadCount = 0;
        const applicationIds = new Set();
        snapshot.forEach((doc) => {
          const notification = { id: doc.id, ...doc.data() };
          newNotifications.push(notification);
          if (!notification.read) {
            newUnreadCount++;
          }
          if (notification.applicationId) {
            applicationIds.add(notification.applicationId);
          }
        });
        setNotifications(newNotifications);
        setUnreadCount(newUnreadCount);
        const fetchPromises = Array.from(applicationIds).map(async (appId) => {
          if (!applicationDetails[appId]) {
            await getApplicationDetails(appId);
          }
        });
        await Promise.all(fetchPromises);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setSubmitError("Failed to load notifications");
    }
  };

  const ensureValidCloudinaryUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('cloudinary.com')) {
        // Create a new URL object to properly handle the URL transformation
        let transformedUrl = new URL(url);
        
        // Ensure the URL uses HTTPS
        transformedUrl.protocol = 'https:';
        
        // Get the pathname parts
        let pathParts = transformedUrl.pathname.split('/');
        
        // Find the upload index
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex !== -1) {
          // For PDFs, use raw resource type and add necessary parameters
          if (url.toLowerCase().endsWith('.pdf')) {
            // Set resource type to raw for PDFs
            pathParts = ['', 'raw', 'upload', ...pathParts.slice(uploadIndex + 1)];
            
            // Add necessary parameters for PDF access
            transformedUrl.searchParams.set('fl_attachment', 'true');
            transformedUrl.searchParams.set('dl', pathParts[pathParts.length - 1]);
          } else {
            // For non-PDF files, ensure proper resource type
            pathParts = ['', 'image', 'upload', ...pathParts.slice(uploadIndex + 1)];
            transformedUrl.searchParams.set('fl_preserve_transparency', 'true');
            transformedUrl.searchParams.set('q_auto', 'good');
          }
          
          // Reconstruct the pathname
          transformedUrl.pathname = pathParts.join('/');
        }
        
        // Add a timestamp parameter to prevent caching issues
        transformedUrl.searchParams.set('t', Date.now());
        
        // Add secure access parameters
        transformedUrl.searchParams.set('secure', 'true');
        
        return transformedUrl.toString();
      }
      return url;
    } catch (error) {
      console.error("Error processing Cloudinary URL:", error);
      return url;
    }
  };

  const getApplicationDetails = async (applicationId) => {
    if (!applicationId) {
      console.log("No application ID provided to getApplicationDetails");
      return null;
    }

    // Return cached details if available
    if (applicationDetails[applicationId]) {
      console.log("Using cached application details for:", applicationId);
      return applicationDetails[applicationId];
    }

    // Set loading state
    setLoadingDetails(prev => ({ ...prev, [applicationId]: true }));

    try {
      console.log("Fetching application details for:", applicationId);
      const details = await fetchApplicationDetails(applicationId);

      // Always process the details, even if it's a placeholder for deleted applications
      if (details) {
        // Process resume link if it exists
        if (details.resumeLink) {
          details.resumeLink = details.resumeLink;
        } else if (details.resumeUrl) {
          // For backward compatibility
          details.resumeLink = details.resumeUrl;
        }

        // Ensure status is set
        if (!details.status) {
          details.status = 'pending';
        }

        // Set status update timestamp if needed
        if (!details.statusUpdatedAt && (details.status === 'accepted' || details.status === 'rejected')) {
          details.statusUpdatedAt = details.updatedAt || details.createdAt || new Date().toISOString();
        }

        // Store in state
        setApplicationDetails(prev => ({ ...prev, [applicationId]: details }));

        // Show appropriate message for deleted applications
        if (details.notFound) {
          console.log("Application was deleted:", applicationId);
          // Don't show error for deleted applications to avoid confusion
        } else if (details.error) {
          console.log("Error occurred while fetching application:", applicationId);
          setSubmitError("There was an error loading some application details. Please refresh the page.");
        }

        return details;
      } else {
        console.log("No details returned for application:", applicationId);
        // This should rarely happen with our improved fetchApplicationDetails function
        setSubmitError("Application details not found. The application may have been deleted.");
      }
    } catch (error) {
      console.error("Error in getApplicationDetails:", error);
      setSubmitError("Failed to load application details. Please try again.");
    } finally {
      // Always clear loading state
      setLoadingDetails(prev => ({ ...prev, [applicationId]: false }));
    }

    return null;
  };

  const markNotificationAsRead = async (notification) => {
    try {
      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, { read: true });

//       // If this is an application notification, fetch the application details
//       if (notification.applicationId) {
//         await getApplicationDetails(notification.applicationId);
//       }

//       // If the notification is related to an application status update, navigate to the application
//       // Don't navigate for job_application notifications as they have their own buttons
//       if (notification.type === 'application_status' && notification.applicationId) {
//         navigate(`/apply/${notification.applicationId}`);
//       }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setSubmitError("Failed to process notification");
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Only update unread notifications
      const unreadNotifications = notifications.filter(notification => !notification.read);

      if (unreadNotifications.length === 0) {
        return; // No unread notifications to update
      }

      const promises = unreadNotifications.map(notification => {
        const notificationRef = doc(db, "notifications", notification.id);
        return updateDoc(notificationRef, { read: true });
      });

      await Promise.all(promises);
      setUnreadCount(0);
      setSubmitError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error clearing notifications:", error);
      setSubmitError("Failed to mark notifications as read");
    }
  };

  // Function to delete all notifications and their corresponding applications
  const deleteAllNotifications = async () => {
    try {
      if (notifications.length === 0) {
        return; // No notifications to delete
      }

      // Check if there are any application-related notifications
      const hasApplicationNotifications = notifications.some(notification => notification.applicationId);

      // Ask for confirmation before deleting
      const confirmMessage = hasApplicationNotifications
        ? "Are you sure you want to delete all notifications? This will also delete all corresponding job applications. This action cannot be undone."
        : "Are you sure you want to delete all notifications? This action cannot be undone.";

      if (!window.confirm(confirmMessage)) {
        return;
      }

      // Collect all application IDs from notifications
      const applicationIds = notifications
        .filter(notification => notification.applicationId)
        .map(notification => notification.applicationId);

      // Delete all notifications
      const notificationPromises = notifications.map(notification => {
        const notificationRef = doc(db, "notifications", notification.id);
        return deleteDoc(notificationRef);
      });

      // Delete all corresponding applications
      const applicationPromises = applicationIds.map(async (applicationId) => {
        const applicationRef = doc(db, "applications", applicationId);
        // Check if the application exists before trying to delete it
        const applicationSnap = await getDoc(applicationRef);
        if (applicationSnap.exists()) {
          return deleteDoc(applicationRef);
        }
        return Promise.resolve(); // Return a resolved promise if application doesn't exist
      });

      // Wait for all deletions to complete
      await Promise.all([...notificationPromises, ...applicationPromises]);

      // Update the state to remove all deleted applications
      if (applicationIds.length > 0) {
        setPostedJobApplications(prev => prev.filter(app => !applicationIds.includes(app.id)));

        // Show success message for application deletions
        if (applicationIds.length > 0) {
          const successMessage = `${applicationIds.length} application(s) have been deleted.`;
          const statusDiv = document.createElement('div');
          statusDiv.style.position = 'fixed';
          statusDiv.style.top = '20px';
          statusDiv.style.left = '50%';
          statusDiv.style.transform = 'translateX(-50%)';
          statusDiv.style.backgroundColor = '#DC2626';
          statusDiv.style.color = 'white';
          statusDiv.style.padding = '12px 24px';
          statusDiv.style.borderRadius = '4px';
          statusDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          statusDiv.style.zIndex = '9999';
          statusDiv.style.fontWeight = 'bold';
          statusDiv.style.fontSize = '16px';
          statusDiv.textContent = successMessage;
          document.body.appendChild(statusDiv);
          setTimeout(() => {
            document.body.removeChild(statusDiv);
          }, 3000);
        }
      }

      // The onSnapshot listener will automatically update the notifications state
      setSubmitError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error deleting notifications and applications:", error);
      setSubmitError("Failed to delete notifications and applications");
    }
  };

  // Function to delete a single notification and its corresponding application if it exists
  const deleteSingleNotification = async (notification, e) => {
    try {
      e.stopPropagation(); // Prevent triggering the card's onClick

      // Ask for confirmation before deleting
      const confirmMessage = notification.applicationId
        ? "Are you sure you want to delete this notification? This will also delete the corresponding job application."
        : "Are you sure you want to delete this notification?";

      if (!window.confirm(confirmMessage)) {
        return;
      }

      // Delete the notification
      const notificationRef = doc(db, "notifications", notification.id);
      await deleteDoc(notificationRef);

      // If this notification is related to an application, delete the application too
      if (notification.applicationId) {
        const applicationRef = doc(db, "applications", notification.applicationId);

        // Check if the application exists before trying to delete it
        const applicationSnap = await getDoc(applicationRef);
        if (applicationSnap.exists()) {
          await deleteDoc(applicationRef);

          // Update the state to remove the deleted application
          setPostedJobApplications(prev => prev.filter(app => app.id !== notification.applicationId));

          // Show success message for application deletion
          const successMessage = `Application has been deleted.`;
          const statusDiv = document.createElement('div');
          statusDiv.style.position = 'fixed';
          statusDiv.style.top = '20px';
          statusDiv.style.left = '50%';
          statusDiv.style.transform = 'translateX(-50%)';
          statusDiv.style.backgroundColor = '#DC2626';
          statusDiv.style.color = 'white';
          statusDiv.style.padding = '12px 24px';
          statusDiv.style.borderRadius = '4px';
          statusDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          statusDiv.style.zIndex = '9999';
          statusDiv.style.fontWeight = 'bold';
          statusDiv.style.fontSize = '16px';
          statusDiv.textContent = successMessage;
          document.body.appendChild(statusDiv);
          setTimeout(() => {
            document.body.removeChild(statusDiv);
          }, 3000);
        }
      }

      // The onSnapshot listener will automatically update the notifications state
      setSubmitError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error deleting notification and application:", error);
      setSubmitError("Failed to delete notification and application");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
            boxShadow: '0 10px 40px rgba(37, 99, 235, 0.2)',
            color: 'white',
            py: { xs: 4, md: 5 },
            px: { xs: 3, md: 4 }
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  mb: 1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </Typography>
              {user?.email && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {user.email}
                </Typography>
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }
                }}
              >
                Manage your job applications and notifications
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/job-post')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'white',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)'
                  }
                }}
              >
                Post a Job
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                onClick={handleSignOut}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Box>
        </Box>

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)'
            }}
          >
            {submitError}
          </Alert>
        )}

        {user && (
          <Stack spacing={4}>
            {/* User document check */}
            {userDocExists === false && (
              <Card
                sx={{
                  p: 3,
                  bgcolor: '#f0f9ff',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  border: '1px solid #2563eb',
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  User Profile Setup Required
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Your user profile needs to be set up to access all features.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Set userDocExists to true to hide this message
                    setUserDocExists(true);
                    // Clear any previous errors
                    setSubmitError("");
                  }}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Continue Anyway
                </Button>
              </Card>
            )}

            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {user.displayName || user.email}
                    </Typography>
                    {user.email && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 0.5
                        }}
                      >
                        {user.email}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#10b981',
                          display: 'inline-block'
                        }}
                      />
                      Active Account
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Member since {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#f0f9ff',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        {applications.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Job Applications
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        height: '100%'
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#10b981',
                          mb: 1
                        }}
                      >
                        {postedJobs.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Jobs Posted
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#fff7ed',
                        border: '1px solid #ffedd5',
                        height: '100%'
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#f97316',
                          mb: 1
                        }}
                      >
                        {postedJobApplications.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Applications to Your Jobs
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#fef2f2',
                        border: '1px solid #fee2e2',
                        height: '100%',
                        position: 'relative'
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#ef4444',
                          mb: 1
                        }}
                      >
                        {notifications.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Notifications
                      </Typography>

                      {unreadCount > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: '#ef4444',
                            color: 'white',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                          }}
                        >
                          {unreadCount}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/jobs')}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Browse Jobs
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/personality-quiz')}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Take Career Quiz
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {notifications.length > 0 && (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                    Notifications
                    <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }}>
                      <NotificationsIcon color="action" />
                    </Badge>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={clearAllNotifications}
                      size="small"
                    >
                      Mark All as Read
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={deleteAllNotifications}
                      size="small"
                    >
                      Clear All
                    </Button>
                  </Box>
                </Box>
                <Stack spacing={2}>
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      sx={{
                        p: 2,
                        bgcolor: notification.read ? '#f3f4f6' : '#e5e7eb',
                        borderRadius: 1,
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 1
                      }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => deleteSingleNotification(notification, e)}
                          aria-label="delete notification"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.1)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box onClick={() => markNotificationAsRead(notification)}>
                        {/* Display application status if available */}
                        {notification.applicationId && (
                          <Box sx={{ mb: 1 }}>
                            {loadingDetails[notification.applicationId] ? (
                              <Typography variant="caption">Loading status...</Typography>
                            ) : applicationDetails[notification.applicationId] ? (
                              <Chip
                                label={applicationDetails[notification.applicationId].status === 'accepted' ? 'Accepted' :
                                      applicationDetails[notification.applicationId].status === 'rejected' ? 'Rejected' :
                                      'Pending'}
                                color={applicationDetails[notification.applicationId].status === 'accepted' ? 'success' :
                                      applicationDetails[notification.applicationId].status === 'rejected' ? 'error' :
                                      'primary'}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getApplicationDetails(notification.applicationId);
                                }}
                              >
                                Load Status
                              </Button>
                            )}
                          </Box>
                        )}

                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{notification.message}</Typography>
                        {notification.jobTitle && (
                          <Typography variant="body2" sx={{ color: '#1e3a8a', fontWeight: 600, mt: 0.5 }}>
                            Job: {notification.jobTitle}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>

                        {/* Show applicant details if this is a job application notification */}
                        {notification.applicationId && (
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(37, 99, 235, 0.05)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1e3a8a', mb: 0.5 }}>
                              Applicant Details:
                            </Typography>

                            {/* Show email from notification */}
                            <Typography variant="body2">
                              <strong>Email:</strong> {notification.applicantEmail || notification.email}
                            </Typography>

                            {/* Show details from application if available */}
                            {applicationDetails[notification.applicationId] && (
                              <>
                                <Typography variant="body2">
                                  <strong>Name:</strong> {applicationDetails[notification.applicationId].fullName}
                                </Typography>

                                {applicationDetails[notification.applicationId].phone && (
                                  <Typography variant="body2">
                                    <strong>Phone:</strong> {applicationDetails[notification.applicationId].phone}
                                  </Typography>
                                )}

                                {applicationDetails[notification.applicationId].linkedin && (
                                  <Typography variant="body2">
                                    <strong>LinkedIn:</strong>
                                    <Box component="span"
                                      sx={{
                                        color: '#0077b5',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        ml: 0.5
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(applicationDetails[notification.applicationId].linkedin, '_blank');
                                      }}
                                    >
                                      View Profile
                                    </Box>
                                  </Typography>
                                )}

                                {applicationDetails[notification.applicationId].experience && (
                                  <Typography variant="body2">
                                    <strong>Experience:</strong> {
                                      applicationDetails[notification.applicationId].experience.length > 100 ?
                                      applicationDetails[notification.applicationId].experience.substring(0, 100) + '...' :
                                      applicationDetails[notification.applicationId].experience
                                    }
                                  </Typography>
                                )}
                              </>
                            )}

                            {/* Show View Application Details button */}
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              disabled={loadingDetails[notification.applicationId]}
                              onClick={async (e) => {
                                e.stopPropagation(); // Prevent marking as read
                                try {
                                  const details = await getApplicationDetails(notification.applicationId);
                                  console.log("Fetched application details:", details);
                                } catch (error) {
                                  console.error("Error fetching details:", error);
                                }
                              }}
                              sx={{ mt: 1, fontSize: '0.75rem' }}
                            >
                              {loadingDetails[notification.applicationId] ? 'Loading...' :
                               !applicationDetails[notification.applicationId] ? 'View Full Details' :
                               applicationDetails[notification.applicationId].notFound ? 'Application Deleted' :
                               applicationDetails[notification.applicationId].error ? 'Retry Loading' :
                               'Refresh Details'}
                            </Button>

                            {/* Resume and Cover Letter section */}
                            {applicationDetails[notification.applicationId] && (
                              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {/* Resume section */}
                                {(applicationDetails[notification.applicationId].resumeLink || applicationDetails[notification.applicationId].resumeUrl) && (
                                  <Box sx={{ border: '1px solid #e2e8f0', p: 2, borderRadius: 1, bgcolor: '#f8fafc' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      Resume:
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                      <Typography variant="body2" sx={{ color: '#4b5563' }}>
                                        Resume is available to view
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const resumeLink = applicationDetails[notification.applicationId].resumeLink ||
                                                           applicationDetails[notification.applicationId].resumeUrl;
                                          if (resumeLink) {
                                            handleViewResume(resumeLink);
                                          } else {
                                            setSubmitError("Resume link is not available");
                                          }
                                        }}
                                        sx={{ fontSize: '0.75rem' }}
                                      >
                                        View Resume
                                      </Button>
                                    </Box>
                                  </Box>
                                )}

                                {/* Cover Letter */}
                                {applicationDetails[notification.applicationId].coverLetter &&
                                 applicationDetails[notification.applicationId].coverLetter.length > 0 && (
                                  <Box sx={{ border: '1px solid #e2e8f0', p: 2, borderRadius: 1, bgcolor: '#f8fafc', mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      Cover Letter:
                                    </Typography>
                                    <Box
                                      sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        border: '1px solid #e2e8f0',
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6
                                      }}
                                    >
                                      {applicationDetails[notification.applicationId].coverLetter}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        )}


                      </Box>

                      {/* Show accept/reject buttons for job application notifications */}
                      {notification.applicationId && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            color={applicationDetails[notification.applicationId]?.status === 'accepted' ? 'success' : 'primary'}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card's onClick

                              if (applicationDetails[notification.applicationId]?.status === 'rejected') {
                                // Ask for confirmation before changing from rejected to accepted
                                if (window.confirm(`Are you sure you want to change the status from Rejected to Accepted for this application?`)) {
                                  handleApplicationStatus(notification.applicationId, 'accepted');
                                  markNotificationAsRead(notification);
                                }
                              } else if (applicationDetails[notification.applicationId]?.status !== 'accepted') {
                                // Normal accept flow
                                handleApplicationStatus(notification.applicationId, 'accepted');
                                markNotificationAsRead(notification);
                              }
                            }}
                            sx={{
                              opacity: applicationDetails[notification.applicationId]?.status === 'accepted' ? 1 : 0.9,
                              fontWeight: applicationDetails[notification.applicationId]?.status === 'accepted' ? 'bold' : 'normal'
                            }}
                          >
                            {applicationDetails[notification.applicationId]?.status === 'accepted' ? 'Accepted ✓' : 'Accept'}
                          </Button>
                          <Button
                            variant="contained"
                            color={applicationDetails[notification.applicationId]?.status === 'rejected' ? 'error' : 'primary'}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card's onClick

                              if (applicationDetails[notification.applicationId]?.status === 'accepted') {
                                // Ask for confirmation before changing from accepted to rejected
                                if (window.confirm(`Are you sure you want to change the status from Accepted to Rejected for this application?`)) {
                                  handleApplicationStatus(notification.applicationId, 'rejected');
                                  markNotificationAsRead(notification);
                                }
                              } else if (applicationDetails[notification.applicationId]?.status !== 'rejected') {
                                // Normal reject flow
                                handleApplicationStatus(notification.applicationId, 'rejected');
                                markNotificationAsRead(notification);
                              }
                            }}
                            sx={{
                              opacity: applicationDetails[notification.applicationId]?.status === 'rejected' ? 1 : 0.9,
                              fontWeight: applicationDetails[notification.applicationId]?.status === 'rejected' ? 'bold' : 'normal'
                            }}
                          >
                            {applicationDetails[notification.applicationId]?.status === 'rejected' ? 'Rejected ✓' : 'Reject'}
                          </Button>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Your Posted Jobs Section */}
            {postedJobs.length > 0 ? (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                    Your Posted Jobs
                  </Typography>
                  <Chip label={`${postedJobs.length} ${postedJobs.length === 1 ? 'Job' : 'Jobs'}`} color="primary" variant="outlined" />
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  {postedJobs.map((job) => (
                    <Card
                      key={job.id}
                      sx={{
                        p: 0,
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Box sx={{
                        p: 2,
                        borderLeft: '4px solid #2563eb',
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                            Job: {job.title || "Untitled Job"}
                          </Typography>
                          <Chip
                            label={job.category || "Uncategorized"}
                            color="primary"
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              fontWeight: 'medium'
                            }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {job.company} • {job.location || "Remote"}
                        </Typography>

                        {job.jobType && (
                          <Chip
                            label={job.jobType}
                            color="secondary"
                            size="small"
                            variant="outlined"
                            sx={{
                              textTransform: 'capitalize',
                              mb: 2
                            }}
                          />
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/edit-job/${job.id}`)}
                          >
                            Edit Job
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/jobs`)}
                          >
                            View Listing
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Card>
            ) : null}

            {postedJobApplications.length > 0 ? (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2563eb' }}>
                  Applications for Your Posted Jobs
                </Typography>
                <Stack spacing={2}>
                  {postedJobApplications.map((application) => (
                    <Card key={application.id} sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 1, position: 'relative' }}>
                      {/* Delete button in top-right corner */}
                      <Box sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 1
                      }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteApplication(application.id, application.fullName)}
                          aria-label="delete application"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.1)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 1, pr: 4 }}>
                        Job: {application.jobTitle && application.jobTitle !== 'your job posting' ? application.jobTitle : "Untitled Job"}
                      </Typography>
                      <Typography>Applicant: {application.fullName}</Typography>
                      <Typography>Email: {application.email}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                        <Typography sx={{ mr: 1 }}>Status:</Typography>
                        <Chip
                          label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          color={
                            application.status === 'accepted' ? 'success' :
                            application.status === 'rejected' ? 'error' :
                            'primary'
                          }
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            px: 1
                          }}
                        />

                        {(application.status === 'accepted' || application.status === 'rejected') && application.statusUpdatedAt && (
                          <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                            ({new Date(application.statusUpdatedAt).toLocaleString()})
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color={application.status === 'accepted' ? 'success' : 'primary'}
                          onClick={() => {
                            if (application.status === 'rejected') {
                              // Ask for confirmation before changing from rejected to accepted
                              if (window.confirm(`Are you sure you want to change the status from Rejected to Accepted for ${application.fullName}?`)) {
                                handleApplicationStatus(application.id, 'accepted');
                              }
                            } else if (application.status !== 'accepted') {
                              // Normal accept flow
                              handleApplicationStatus(application.id, 'accepted');
                            }
                          }}
                          sx={{
                            opacity: application.status === 'accepted' ? 1 : 0.9,
                            fontWeight: application.status === 'accepted' ? 'bold' : 'normal'
                          }}
                        >
                          {application.status === 'accepted' ? 'Accepted ✓' : 'Accept'}
                        </Button>
                        <Button
                          variant="contained"
                          color={application.status === 'rejected' ? 'error' : 'primary'}
                          onClick={() => {
                            if (application.status === 'accepted') {
                              // Ask for confirmation before changing from accepted to rejected
                              if (window.confirm(`Are you sure you want to change the status from Accepted to Rejected for ${application.fullName}?`)) {
                                handleApplicationStatus(application.id, 'rejected');
                              }
                            } else if (application.status !== 'rejected') {
                              // Normal reject flow
                              handleApplicationStatus(application.id, 'rejected');
                            }
                          }}
                          sx={{
                            opacity: application.status === 'rejected' ? 1 : 0.9,
                            fontWeight: application.status === 'rejected' ? 'bold' : 'normal'
                          }}
                        >
                          {application.status === 'rejected' ? 'Rejected ✓' : 'Reject'}
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Card>
            ) : (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2563eb' }}>
                  No Job Applications Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You haven't received any applications for your posted jobs. When candidates apply, their applications will appear here.
                </Typography>
              </Card>
            )}

            {applications.length > 0 ? (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                    Your Job Applications
                  </Typography>
                  <Chip label={`${applications.length} ${applications.length === 1 ? 'Application' : 'Applications'}`} color="primary" variant="outlined" />
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  {applications.map((application) => (
                    <Card
                      key={application.id}
                      sx={{
                        p: 0,
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Box sx={{
                        p: 2,
                        borderLeft: '4px solid',
                        borderColor: application.status === 'accepted' ? '#059669' : application.status === 'rejected' ? '#DC2626' : '#2563EB',
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                            Job: {application.jobTitle || "Untitled Job"}
                          </Typography>
                          <Box component="span" sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            color: 'white',
                            bgcolor: application.status === 'accepted' ? '#059669' : application.status === 'rejected' ? '#DC2626' : '#2563EB',
                            fontWeight: 'medium',
                            fontSize: '0.875rem'
                          }}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'medium' }}>
                              APPLIED ON
                            </Typography>
                            <Typography variant="body2">
                              {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>

                          {/* Status update timestamp if available */}
                          {application.statusUpdatedAt && (application.status === 'accepted' || application.status === 'rejected') && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'medium' }}>
                                STATUS UPDATED
                              </Typography>
                              <Typography variant="body2">
                                {new Date(application.statusUpdatedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {(application.resumeLink || application.resumeUrl) && (
                          <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Resume:
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: '#4b5563' }}>
                                Your resume is available to view
                              </Typography>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                  const resumeLink = application.resumeLink || application.resumeUrl;
                                  if (resumeLink) {
                                    window.open(resumeLink, '_blank');
                                  } else {
                                    setSubmitError("Resume link is not available");
                                  }
                                }}
                                sx={{ fontSize: '0.75rem' }}
                              >
                                View Resume
                              </Button>
                            </Box>
                          </Box>
                        )}
                        {application.coverLetter && application.coverLetter.length > 0 && (
                          <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Cover Letter:
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e2e8f0', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.6 }}>
                              {application.coverLetter}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Card>
            ) : (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2563eb' }}>
                  No Applications Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You haven't applied to any jobs yet. When you apply, your applications will appear here.
                </Typography>
              </Card>
            )}
            {/* RecreateUsers component moved to the top of the Stack */}
          </Stack>
        )}
      </Box>
      <ResumeDownloadNotification
        open={resumeNotification.open}
        resumeLink={resumeNotification.resumeLink}
        applicantName={resumeNotification.applicantName}
        onClose={handleCloseResumeNotification}
      />
    </Container>
  );
}

export default Profile;