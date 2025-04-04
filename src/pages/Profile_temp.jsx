import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Alert, Card, CardContent, Divider, Stack, Badge } from "@mui/material";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import NotificationsIcon from '@mui/icons-material/Notifications';

function ProfileTemp() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [applications, setApplications] = useState([]);
  const [postedJobApplications, setPostedJobApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchApplications(currentUser.uid);
      fetchPostedJobApplications(currentUser.uid);
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
      await updateDoc(applicationRef, {
        status: newStatus
      });
      fetchPostedJobApplications(user.uid);
    } catch (error) {
      console.error("Error updating application status:", error);
      setSubmitError("Failed to update application status");
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
      console.log("Fetching notifications with query:", q); // Log the query
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Snapshot Data:", snapshot); // Log the snapshot data
        const newNotifications = [];
        snapshot.forEach((doc) => {
          const notification = { id: doc.id, ...doc.data() };
          newNotifications.push(notification);
        });
        setNotifications(newNotifications);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setSubmitError("Failed to load notifications");
    }
  };

  const markNotificationAsRead = async (notification) => {
    try {
      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, { read: true });
      if (notification.type === 'application_status' && notification.applicationId) {
        navigate(`/apply/${notification.applicationId}`);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setSubmitError("Failed to process notification");
    }
  };

  const clearAllNotifications = async () => {
    try {
      const promises = notifications.map(notification => {
        const notificationRef = doc(db, "notifications", notification.id);
        return updateDoc(notificationRef, { read: true });
      });
      await Promise.all(promises);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      setSubmitError("Failed to clear notifications");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>
          Profile
        </Typography>
        {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}
        {user && (
          <Stack spacing={4}>
            <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#374151', mb: 2 }}>
                  Welcome, {user.email}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280', mb: 3 }}>
                  Account created on: {new Date(user.metadata.creationTime).toLocaleDateString()}
                </Typography>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={handleSignOut}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      backgroundColor: '#b91c1c'
                    }
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {notifications.length > 0 && (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2563eb' }}>
                  Notifications
                </Typography>
                <Stack spacing={2}>
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      sx={{ 
                        p: 2, 
                        bgcolor: notification.read ? '#f3f4f6' : '#e5e7eb',
                        borderRadius: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => markNotificationAsRead(notification)}
                    >
                      <Typography variant="body1">{notification.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}

            {postedJobApplications.length > 0 ? (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2563eb' }}>
                  Applications for Your Posted Jobs
                </Typography>
                <Stack spacing={2}>
                  {postedJobApplications.map((application) => (
                    <Card key={application.id} sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                      <Typography variant="h6">{application.jobTitle}</Typography>
                      <Typography>Applicant: {application.fullName}</Typography>
                      <Typography>Email: {application.email}</Typography>
                      <Typography>Status: 
                        <Box component="span" sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          color: 'white',
                          bgcolor: 
                            application.status === 'accepted' ? '#059669' :
                            application.status === 'rejected' ? '#DC2626' :
                            '#2563EB',
                          fontWeight: 'medium'
                        }}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Box>
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={application.status === 'accepted'}
                          onClick={() => handleApplicationStatus(application.id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          disabled={application.status === 'rejected'}
                          onClick={() => handleApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon color="action" />
              </Badge>
              {notifications.length > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={clearAllNotifications}
                  sx={{ ml: 2 }}
                >
                  Clear All Notifications
                </Button>
              )}
            </Box>
            
            {applications.length > 0 ? (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2563eb' }}>
                  Your Job Applications
                </Typography>
                <Stack spacing={2}>
                  {applications.map((application) => (
                    <Card key={application.id} sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                      <Typography variant="h6">{application.jobTitle}</Typography>
                      <Typography>Applied on: {new Date(application.appliedAt).toLocaleDateString()}</Typography>
                      <Typography>Status: 
                        <Box component="span" sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          color: 'white',
                          bgcolor: 
                            application.status === 'accepted' ? '#059669' :
                            application.status === 'rejected' ? '#DC2626' :
                            '#2563EB',
                          fontWeight: 'medium'
                        }}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Box>
                      </Typography>
                    </Card>
                  ))}
                </Stack>
              </Card>
            ) : (
              <Card sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2563eb' }}>
                  No Applications Submitted
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You haven't submitted any job applications yet. When you apply for jobs, they will appear here for tracking.
                </Typography>
              </Card>
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
}

export default ProfileTemp;
