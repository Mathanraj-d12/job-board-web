import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, Chip } from '@mui/material';
import { categoryDefinitions } from './Categories';

function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);

        if (auth.currentUser) {
          const applicationsSnapshot = await getDocs(
            query(collection(db, 'applications'), where('userId', '==', auth.currentUser.uid))
          );
          const applicationsData = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setApplications(applicationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load jobs or applications');
      }
    };

    fetchJobsAndApplications();
  }, []);

  const handleCancelApplication = async (applicationId) => {
    try {
      await deleteDoc(doc(db, 'applications', applicationId));
      setApplications(applications.filter(app => app.id !== applicationId));
    } catch (error) {
      console.error('Error canceling application:', error);
      setError('Failed to cancel application');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job');
    }
  };

  const handleEdit = (jobId) => {
    console.log('Editing job with ID:', jobId); // Log jobId being edited
    navigate(`/edit-job/${jobId}`);
  };

  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategoryFilter(params.get('category'));
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || 
      (categoryFilter.toLowerCase() === 'other' ? 
        !job.category || !categoryDefinitions.some(cat => cat.name.toLowerCase() === job.category.toLowerCase()) :
        job.category && job.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg">
      {!auth.currentUser ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Please sign in to view available jobs
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/signin')} sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              Discover Your Next Opportunity
            </Typography>
            {filteredJobs.length > 0 && (
              <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available - Find your perfect role today
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, company, or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)'
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSearchTerm(searchTerm)}
                sx={{
                  minWidth: '120px',
                  height: '56px',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)'
                  }
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
          {filteredJobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No positions currently available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please check back later for new opportunities
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card className="job-card">
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1e3a8a', mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#4b5563' }}>
                        {job.company}
                      </Typography>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      {job.company}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {job.description}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Location: {job.location}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Salary: {job.salary}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Category: {job.category}
                    </Typography>
                    {job.userId === auth.currentUser?.uid ? (
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="outlined" color="primary" fullWidth onClick={() => handleEdit(job.id)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" fullWidth onClick={() => handleDelete(job.id)}>
                          Delete
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        {applications.some(app => app.jobId === job.id) ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Chip label={`Status: ${applications.find(app => app.jobId === job.id)?.status || 'pending'}`} color="primary" sx={{ mb: 1 }} />
                            <Box sx={{ display: 'flex', gap: 1 }}>

                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={() => handleCancelApplication(applications.find(app => app.jobId === job.id)?.id)}
                              >
                                Cancel Application
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/apply/${job.id}`)}>
                            Apply
                          </Button>
                        )}
                      </Box>
                    )}
                    {error && (
                      <Typography color="error" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default JobList;
