import React, { useState } from 'react';
import { Snackbar, Alert, Button, Link } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Component to display a notification when a resume is downloaded
 *
 * @param {Object} props
 * @param {string} props.resumeLink - URL of the resume
 * @param {string} props.applicantName - Name of the applicant
 * @param {boolean} props.open - Whether the notification is open
 * @param {Function} props.onClose - Function to call when the notification is closed
 */
const ResumeDownloadNotification = ({ resumeLink, applicantName, open, onClose }) => {
  const [showDownloadButton, setShowDownloadButton] = useState(true);

  const handleDownload = () => {
    // Open the resume in a new tab
    window.open(resumeLink, '_blank');

    // Hide the download button after clicking
    setShowDownloadButton(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity="info" 
        variant="filled"
        sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <div>Resume is ready to view</div>
        
        {showDownloadButton && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mt: 1 }}
          >
            View Resume
          </Button>
        )}
        
        {!showDownloadButton && (
          <Link
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1, fontSize: '0.875rem' }}
          >
            Click here if the resume didn't open
          </Link>
        )}
      </Alert>
    </Snackbar>
  );
};

export default ResumeDownloadNotification;