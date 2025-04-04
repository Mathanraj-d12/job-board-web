import { useState } from 'react';
import { Button, Alert, Box, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import createUserDocument from '../scripts/recreateUsers';

/**
 * Component to create user documents in Firestore
 * This is useful when the users collection doesn't exist or user documents are missing
 *
 * @param {Object} props - Component props
 * @param {Function} props.onUserDocCreated - Optional callback function to call after user document is created
 */
function RecreateUsers({ onUserDocCreated }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ success: false, message: '', error: false });

  const handleCreateUserDocument = async () => {
    setLoading(true);
    setResult({ success: false, message: '', error: false });

    try {
      const response = await createUserDocument();

      if (response.success) {
        setResult({
          success: true,
          message: response.message,
          error: false
        });

        // Call the callback function if provided
        if (onUserDocCreated && typeof onUserDocCreated === 'function') {
          onUserDocCreated(response.userData);
        }

        // Reload the page after 2 seconds to refresh all components
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: response.message || 'Failed to create user document',
          error: true
        });
      }
    } catch (error) {
      console.error('Error creating user document:', error);
      setResult({
        success: false,
        message: `Error: ${error.message || 'Unknown error occurred'}`,
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
      <Alert severity="info" sx={{ mb: 3, fontWeight: 'medium' }}>
        Action required: Your profile needs to be set up to enable all features
      </Alert>

      <Typography variant="h5" gutterBottom sx={{ color: '#2563eb', fontWeight: 'bold' }}>
        Profile Setup Required
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" paragraph>
        <strong>Action Required:</strong> Your user profile needs to be set up in our database.
      </Typography>

      <Typography variant="body1" paragraph>
        We've detected that your user profile information is missing in our database. This is needed for:
      </Typography>

      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <Box component="li" sx={{ mb: 1 }}>
          Receiving notifications about job applications
        </Box>
        <Box component="li" sx={{ mb: 1 }}>
          Storing your preferences and settings
        </Box>
        <Box component="li" sx={{ mb: 1 }}>
          Ensuring all features of the platform work correctly
        </Box>
      </Box>

      <Typography variant="body1" paragraph>
        This is a one-time setup that will:
      </Typography>

      <Box component="ul" sx={{ pl: 4, mb: 3 }}>
        <Box component="li" sx={{ mb: 1 }}>
          Create your user profile in our secure database
        </Box>
        <Box component="li" sx={{ mb: 1 }}>
          Use your existing account information (email, name)
        </Box>
        <Box component="li" sx={{ mb: 1 }}>
          Enable all platform features for your account
        </Box>
      </Box>

      {result.message && (
        <Alert severity={result.error ? 'error' : 'success'} sx={{ mb: 3 }}>
          {result.message}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateUserDocument}
        disabled={loading}
        sx={{
          mt: 1,
          py: 1.5,
          px: 3,
          borderRadius: 2,
          fontWeight: 'medium',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
          }
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Set Up My Profile'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', fontStyle: 'italic' }}>
        Note: This is a one-time setup for your account. The page will refresh automatically after setup is complete.
      </Typography>
    </Paper>
  );
}

export default RecreateUsers;