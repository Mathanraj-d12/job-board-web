import { useState, useEffect } from 'react';
import { sendNotificationToOwner } from '../firebase';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const JobApplicationForm = ({ open, onClose, onSubmit, isSubmitting, initialData, applicationStatus, setApplicationStatus, jobOwnerId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resumeLink: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // No file upload handlers needed anymore

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) errors.email = 'Email is not valid';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phonePattern = /^[0-9]+$/;
      if (!phonePattern.test(formData.phone)) errors.phone = 'Phone number must be numeric';
    }

    if (!formData.experience.trim()) errors.experience = 'Experience is required';

    // Validate resume link - now required
    if (!formData.resumeLink || !formData.resumeLink.trim()) {
      errors.resumeLink = 'Resume link is required';
    } else if (!isValidURL(formData.resumeLink)) {
      errors.resumeLink = 'Please enter a valid URL';
    }

    return errors;
  };

  // Helper function to validate URLs
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Prepare submission data
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        coverLetter: formData.coverLetter || '',
        resumeLink: formData.resumeLink || '',
        jobTitle: initialData?.jobTitle || 'Untitled Job'
      };

      // Log the job title for debugging
      console.log("Job application for:", submissionData.jobTitle);

      // Submit application with complete information
      await onSubmit(submissionData);

      setApplicationStatus(true); // ✅ Mark application as applied
      resetForm();
      onClose();
    } catch (error) {
      setFormErrors({
        submit: 'Failed to submit application. Please try again.'
      });
      // Display the error message to the user
      alert('Failed to submit application: ' + (error.message || 'Unknown error occurred'));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      experience: '',
      coverLetter: '',
      resumeLink: ''
    });
    setFormErrors({});
  };

  const handleCancelApplication = () => {
    setApplicationStatus(false); // ✅ Mark application as not applied
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Job Application</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {formErrors.submit && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 1 }}
            >
              {formErrors.submit}
            </Alert>
          )}

          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={!!formErrors.fullName} helperText={formErrors.fullName} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} error={!!formErrors.email} helperText={formErrors.email} margin="normal" type="email" />
          <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} error={!!formErrors.phone} helperText={formErrors.phone} margin="normal" />
          <TextField fullWidth label="Relevant Experience" name="experience" multiline rows={3} value={formData.experience} onChange={handleInputChange} error={!!formErrors.experience} helperText={formErrors.experience} margin="normal" />
          <TextField fullWidth label="Cover Letter" name="coverLetter" multiline rows={4} value={formData.coverLetter || ''} onChange={handleInputChange} margin="normal" />

          <TextField
            fullWidth
            required
            label="Resume Link (Google Drive, Dropbox, etc.)"
            name="resumeLink"
            value={formData.resumeLink || ''}
            onChange={handleInputChange}
            error={!!formErrors.resumeLink}
            helperText={formErrors.resumeLink || "Share a link to your resume (Google Drive, Dropbox, etc.)"}
            margin="normal"
            placeholder="https://drive.google.com/file/your-resume"
          />

          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>Application Information</Typography>
            <Typography variant="body2">
              Your application will be stored in our system and the employer will be able to view your resume link.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The employer will receive a notification with your name and resume link when you submit your application.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {applicationStatus ? (
          <Button onClick={handleCancelApplication} variant="contained" color="error">
            Cancel Application
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        )}
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplicationForm;
