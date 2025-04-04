import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
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

function EditJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    jobType: '',
    category: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
        console.log('Fetching job with ID:', jobId); // Log jobId

      try {
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        console.log('Job document fetched:', jobDoc.exists(), jobDoc.data(), 'for jobId:', jobId); // Log job document existence, data, and jobId


        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          if (auth.currentUser?.uid !== jobData.userId) {
            setError('You are not authorized to edit this job');
            return;
          }
          setFormData(jobData);
        } else {
          setError('Job not found. Please check the job ID or if the job exists.'); // More descriptive error
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Error loading job data');
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'jobType':
        if (!value) error = 'Please select a job type';
        break;
      case 'title':
        if (value.length < 5 || value.length > 100) error = 'Job title must be between 5 and 100 characters';
        break;
      case 'company':
        if (value.length < 2 || value.length > 50) error = 'Company name must be between 2 and 50 characters';
        break;
      case 'location':
        if (value.length < 2 || value.length > 50) error = 'Location must be between 2 and 50 characters';
        break;
      case 'salary':
        if (!/^(\$?\d+(k)?(-\$?\d+(k)?)?)$/.test(value)) error = 'Enter a valid salary range (e.g. 50k-80k or $50000-$80000)';
        break;
      case 'description':
        if (value.length < 50 || value.length > 5000) error = 'Description must be between 50 and 5000 characters';
        break;
      case 'category':
        if (!value) error = 'Please select a business category';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = Object.values(formErrors).every((err) => !err) &&
    Object.values(formData).every((val) => val.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Please sign in to update the job');
      return;
    }
    if (!isFormValid) {
      setError('Please fix all errors before submitting');
      return;
    }
    try {
      await updateDoc(doc(db, 'jobs', jobId), formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Error updating job. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Job
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required fullWidth select label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange} error={!!formErrors.jobType} helperText={formErrors.jobType}>
                <MenuItem value="">Select a job type</MenuItem>
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>
            </Grid>
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
            {['title', 'company', 'location', 'salary', 'description'].map((field, index) => (
              <Grid key={index} item xs={12} sm={field === 'description' ? 12 : 6}>
                <TextField
                  required
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  error={!!formErrors[field]}
                  helperText={formErrors[field]}
                  multiline={field === 'description'}
                  rows={field === 'description' ? 4 : 1}
                  placeholder={field === 'salary' ? 'e.g. 50k-80k or $50000-$80000' : ''}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={!isFormValid}>
                Update Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default EditJob;
