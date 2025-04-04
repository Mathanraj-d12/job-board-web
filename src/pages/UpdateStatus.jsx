import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { updateApplicationStatus } from '../firebase';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

function UpdateStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updateStatus = async () => {
      const applicationId = searchParams.get('applicationId');
      const status = searchParams.get('status');

      if (!applicationId || !status) {
        navigate('/jobs');
        return;
      }

      try {
        await updateApplicationStatus(applicationId, status);
        // Wait for a moment to show the success message
        setTimeout(() => navigate('/jobs'), 2000);
      } catch (error) {
        console.error('Error updating status:', error);
        navigate('/jobs');
      }
    };

    updateStatus();
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Updating Application Status...
        </Typography>
        <Typography color="text.secondary">
          Please wait while we process your response.
        </Typography>
      </Box>
    </Container>
  );
}

export default UpdateStatus;