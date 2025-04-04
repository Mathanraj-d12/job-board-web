import { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Alert, CircularProgress } from '@mui/material';
import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

function EmailAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSetEmailSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const createEmailSettings = httpsCallable(functions, 'createEmailSettings');
      const response = await createEmailSettings({ email, password });
      
      setResult({
        type: 'settings',
        message: 'Email settings updated successfully',
        data: response.data
      });
      
      // Clear password field for security
      setPassword('');
    } catch (err) {
      console.error('Error setting email credentials:', err);
      setError({
        type: 'settings',
        message: `Failed to update email settings: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const testEmailFunction = httpsCallable(functions, 'testEmail');
      const response = await testEmailFunction({ to: testEmail });
      
      setResult({
        type: 'test',
        message: `Test email sent successfully to ${testEmail}`,
        data: response.data
      });
    } catch (err) {
      console.error('Error sending test email:', err);
      setError({
        type: 'test',
        message: `Failed to send test email: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Email Configuration
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {result.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Set Email Credentials
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            These credentials will be used to send application emails to employers.
          </Typography>

          <Box component="form" onSubmit={handleSetEmailSettings} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              helperText="Gmail account to send emails from"
            />
            <TextField
              fullWidth
              label="App Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Gmail app password (not your regular password)"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading && result?.type === 'settings' ? <CircularProgress size={24} /> : 'Save Settings'}
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Test Email Functionality
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Send a test email to verify your configuration is working correctly.
          </Typography>

          <Box component="form" onSubmit={handleTestEmail} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Recipient Email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              margin="normal"
              required
              helperText="Email address to receive the test message"
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading && result?.type === 'test' ? <CircularProgress size={24} /> : 'Send Test Email'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Troubleshooting
        </Typography>
        <Typography variant="body2" paragraph>
          If emails are not being sent, check the following:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              Make sure you're using an App Password, not your regular Gmail password.
              <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                How to create an App Password
              </a>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Ensure "Less secure app access" is enabled for your Gmail account.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Check Firebase Functions logs for detailed error messages.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Verify that your Firebase project has the appropriate billing plan for external API calls.
            </Typography>
          </li>
        </ul>
      </Paper>
    </Container>
  );
}

export default EmailAdmin;