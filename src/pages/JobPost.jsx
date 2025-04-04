import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  MenuItem,
} from '@mui/material';

function JobPost() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    jobType: '',
    category: ''
  });

  // Validation function for form fields
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'jobType':
        if (!value) error = 'Please select a job type';
        break;
      case 'title':
        if (value.length < 5 || value.length > 100)
          error = 'Job title must be between 5 and 100 characters';
        break;
      case 'company':
        if (value.length < 2 || value.length > 50)
          error = 'Company name must be between 2 and 50 characters';
        break;
      case 'location':
        if (value.length < 2 || value.length > 50)
          error = 'Location must be between 2 and 50 characters';
        break;
      case 'salary':
        if (!/^\$?\d+([kK])?(-\$?\d+([kK])?)?$/.test(value))
          error = 'Enter a valid salary range (e.g. 50k-80k or $50000-$80000)';
        break;
      case 'description':
        if (value.length < 50 || value.length > 5000)
          error = 'Description must be between 50 and 5000 characters';
        break;
      case 'category':
        if (!value) error = 'Please select a business category';
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input changes & validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(() => {
    const hasErrors = Object.values(formErrors).some((err) => err !== '');
    const hasEmptyFields = Object.values(formData).some((val) => val === '');
    setIsFormValid(!hasErrors && !hasEmptyFields && auth.currentUser);
  }, [formData, formErrors]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!auth.currentUser) {
      setError('Please sign in to post a job.');
      return;
    }
    if (!isFormValid) {
      setError('Fix all errors before submitting.');
      return;
    }

    try {
      const jobData = {
        ...formData,
        userId: auth.currentUser.uid,
        postedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'jobs'), jobData);
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate('/jobs'), 1500); // Redirect after success
    } catch (error) {
      setError('Error posting job. Try again.');
      console.error('Job posting error:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Post a New Job
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Job Type Dropdown */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                error={!!formErrors.jobType}
                helperText={formErrors.jobType}
              >
                <MenuItem value="">Select a job type</MenuItem>
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>
            </Grid>

            {/* Business Category */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Business Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={!!formErrors.category}
                helperText={formErrors.category}
              >
                <MenuItem value="">Select a business category</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="retail">Retail</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="manufacturing">Manufacturing</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Job Title */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                error={!!formErrors.company}
                helperText={formErrors.company}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Grid>

            {/* Salary */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                error={!!formErrors.salary}
                helperText={formErrors.salary}
                placeholder="e.g. 50k-80k or $50000-$80000"
              />
            </Grid>

            {/* Job Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!isFormValid}
              >
                Post Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default JobPost;
