import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { db, auth, sendNotificationToOwner } from "../firebase";

import { Container, Typography, Alert, Box } from "@mui/material";
import JobApplicationForm from "../components/JobApplicationForm";

function Apply() {
  const { jobId, applicationId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (applicationId) {
          const applicationDoc = await getDoc(doc(db, "applications", applicationId));
          if (!applicationDoc.exists()) {
            setError("Application not found");
            return;
          }

          const applicationData = applicationDoc.data();
          setApplicationData(applicationData);
          setApplicationStatus(true);

          // Fetch job data using the jobId from the application
          const jobDoc = await getDoc(doc(db, "jobs", applicationData.jobId));
          if (!jobDoc.exists()) {
            setError("Associated job not found");
            return;
          }
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        } else if (jobId) {
          const jobDoc = await getDoc(doc(db, "jobs", jobId));
          if (!jobDoc.exists()) {
            setError("Job not found");
            return;
          }
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        }
      } catch (error) {
        setError("Error loading data");
      }
    };

    if (jobId || applicationId) {
      fetchData();
    }
  }, [jobId, applicationId]); // ✅ Ensured correct dependencies

  const handleSubmit = async (formData) => {
    if (!auth.currentUser) {
      setError("Please sign in to apply for this job");
      return;
    }

    if (!job) {
      setError("Job information is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      let jobPosterEmail = null;
      if (job.userId) {
        const userDoc = await getDoc(doc(db, "users", job.userId));
        if (userDoc.exists()) {
          jobPosterEmail = userDoc.data()?.email;
        }
      }

      // Make sure we have the correct job title
      const jobTitle = job.title || 'Untitled Job';
      console.log("Applying for job:", jobTitle);

      const applicationPayload = {
        jobId: applicationId ? job.id : jobId,
        userId: auth.currentUser.uid,
        jobPosterEmail,
        jobTitle: jobTitle, // Use the extracted job title
        ...formData,
        appliedAt: new Date().toISOString(),
        status: "pending",
      };

      let currentApplicationId;
      if (applicationId) {
        await updateDoc(doc(db, "applications", applicationId), applicationPayload);
        currentApplicationId = applicationId;
      } else {
        const docRef = await addDoc(collection(db, "applications"), applicationPayload);
        currentApplicationId = docRef.id;
      }

      // Prepare simplified notification data with only essential information
      const notificationData = {
        applicationId: currentApplicationId,
        jobId: applicationPayload.jobId,
        jobTitle: applicationPayload.jobTitle,
        fullName: applicationPayload.fullName,
        resumeLink: applicationPayload.resumeLink || ''
      };

      if (job.userId) {
        await sendNotificationToOwner(job.userId, notificationData);
      }

      navigate("/jobs");

    } catch (error) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job && !error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{
        mt: 6,
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {error ? (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.12)'
            }}
          >
            {error}
          </Alert>
        ) : (
          <Box sx={{
            width: '100%',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)'
          }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1
              }}
            >
              {applicationId ? "Edit Application for" : "Apply for"} {job?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                mb: 4
              }}
            >
              {job?.company} - {job?.location}
            </Typography>
            <JobApplicationForm
              open={true}
              onClose={() => navigate("/jobs")}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              initialData={{
                ...applicationData,
                jobTitle: job?.title || 'Untitled Job'
              }}
              applicationStatus={applicationStatus}
              jobOwnerId={job?.userId}
              setApplicationStatus={setApplicationStatus}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Apply;
