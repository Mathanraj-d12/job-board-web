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
  Paper,
  Divider,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';

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
          error = 'Enter a valid salary range (e.g. 50k-80k or $50000-$80000) - per month';
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
        userEmail: auth.currentUser.email,
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
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 3,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <WorkIcon sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Post a New Job
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Fill in the details below to create your job listing
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary.main" fontWeight={600} gutterBottom>
                Tips for a Great Job Posting
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific about responsibilities and requirements
              </Typography>
              <Typography variant="body2" paragraph>
                • Include salary information to attract more qualified candidates
              </Typography>
              <Typography variant="body2" paragraph>
                • Describe your company culture and benefits
              </Typography>
              <Typography variant="body2">
                • Proofread your listing before submitting
              </Typography>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Job Classification
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Job Type Dropdown */}
            <Grid item xs={12} md={6}>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              >
                <MenuItem value="">Select a job type</MenuItem>
                <MenuItem value="full-time">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Full-time"
                      size="small"
                      sx={{
                        bgcolor: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 600,
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">40+ hours per week</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="part-time">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Part-time"
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 600,
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">Less than 40 hours per week</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="contract">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Contract"
                      size="small"
                      sx={{
                        bgcolor: '#fff8e1',
                        color: '#f57c00',
                        fontWeight: 600,
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">Fixed-term employment</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="internship">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Internship"
                      size="small"
                      sx={{
                        bgcolor: '#f3e5f5',
                        color: '#7b1fa2',
                        fontWeight: 600,
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">Training position</Typography>
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>

            {/* Business Category */}
            <Grid item xs={12} md={6}>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              >
                <MenuItem value="">Select a business category</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="customer service">Customer Service</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="human resources">Human Resources</MenuItem>
                <MenuItem value="retail">Retail</MenuItem>
                <MenuItem value="manufacturing">Manufacturing</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Job Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
                placeholder="e.g. Senior Software Engineer"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
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
                placeholder="e.g. Acme Corporation"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                placeholder="e.g. New York, NY or Remote"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
            </Grid>

            {/* Salary */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                error={!!formErrors.salary}
                helperText={formErrors.salary || "e.g. 50k-80k or $50,000-$80,000 (per month)"}
                placeholder="e.g. 50k-80k or $50,000-$80,000 (per month)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Job Description
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Job Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={6}
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description || "Minimum 50 characters. Include responsibilities, requirements, and benefits."}
                placeholder="Describe the job responsibilities, requirements, qualifications, and benefits..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/jobs')}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!isFormValid}
                  sx={{
                    borderRadius: 2,
                    px: 6,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Post Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        </Box>
      </Paper>

      <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f9fafb' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            By posting a job, you agree to our terms and conditions. All job postings will be reviewed for quality and relevance.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default JobPost;
