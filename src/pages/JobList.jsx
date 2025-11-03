import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent, TextField, Button, Chip,
  InputAdornment, Divider, Avatar, Paper, MenuItem, Select, FormControl, InputLabel,
  IconButton, Tooltip, useTheme, useMediaQuery, Stack, Skeleton, Menu, Tabs, Tab,
  Pagination, Drawer, AppBar, Toolbar, CssBaseline
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { categoryDefinitions } from './Categories';

function JobList() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auth & Data
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Mobile: fewer cards

  // Filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');

  // URL Sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setCategoryFilter(params.get('category') || '');
    setJobTypeFilter(params.get('jobType') || 'all');
    setLocationFilter(params.get('location') || 'all');
    setSalaryFilter(params.get('salary') || 'all');
    setSortBy(params.get('sort') || 'newest');
    setActiveTab(parseInt(params.get('tab') || '0'));
  }, [location.search]);

  // Fetch Data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      try {
        const jobsSnap = await getDocs(collection(db, 'jobs'));
        const jobsData = jobsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          salary: parseInt(doc.data().salary) || 0
        }));
        setJobs(jobsData);

        if (currentUser) {
          const appsSnap = await getDocs(query(collection(db, 'applications'), where('userId', '==', currentUser.uid)));
          setApplications(appsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

          const savedSnap = await getDocs(query(collection(db, 'savedJobs'), where('userId', '==', currentUser.uid)));
          setSavedJobs(savedSnap.docs.map(d => d.data().jobId));
        }
      } catch (err) {
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Save Job
  const toggleSaveJob = async (jobId) => {
    if (!user) return navigate('/signin');
    try {
      if (savedJobs.includes(jobId)) {
        const q = query(collection(db, 'savedJobs'), where('userId', '==', user.uid), where('jobId', '==', jobId));
        const snap = await getDocs(q);
        snap.forEach(d => deleteDoc(d.ref));
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        await addDoc(collection(db, 'savedJobs'), { userId: user.uid, jobId, savedAt: serverTimestamp() });
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (err) {
      setError('Save failed');
    }
  };

  // Apply Filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter) params.set('category', categoryFilter);
    if (jobTypeFilter !== 'all') params.set('jobType', jobTypeFilter);
    if (locationFilter !== 'all') params.set('location', locationFilter);
    if (salaryFilter !== 'all') params.set('salary', salaryFilter);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    params.set('tab', activeTab);
    navigate(`/jobs?${params.toString()}`);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setJobTypeFilter('all');
    setLocationFilter('all');
    setSalaryFilter('all');
    setSortBy('newest');
    navigate('/jobs?tab=0');
    setFilterOpen(false);
  };

  // Filter Data
  const uniqueLocations = [...new Set(jobs.map(j => j.location || 'Remote'))];
  const uniqueJobTypes = [...new Set(jobs.map(j => j.jobType))];

  const filteredJobs = jobs
    .filter(job => {
      const match = (str) => str?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = !searchTerm || match(job.title) || match(job.company) || match(job.description);
      const matchesCat = !categoryFilter || job.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = jobTypeFilter === 'all' || job.jobType === jobTypeFilter;
      const matchesLoc = locationFilter === 'all' || job.location === locationFilter;
      const matchesSal = salaryFilter === 'all' ||
        (salaryFilter === 'high' && job.salary >= 5000) ||
        (salaryFilter === 'medium' && job.salary >= 3000 && job.salary < 5000) ||
        (salaryFilter === 'low' && job.salary < 3000);

      if (activeTab === 1) return applications.some(a => a.jobId === job.id);
      if (activeTab === 2) return savedJobs.includes(job.id);

      return matchesSearch && matchesCat && matchesType && matchesLoc && matchesSal;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.createdAt - a.createdAt;
        case 'salary-high': return b.salary - a.salary;
        case 'alphabetical': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  // Mobile Drawer
  const FilterDrawer = () => (
    <Drawer anchor="bottom" open={filterOpen} onClose={() => setFilterOpen(false)}>
      <Box sx={{ p: 3, pb: 5, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Job Type</InputLabel>
          <Select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {uniqueJobTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Location</InputLabel>
          <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {uniqueLocations.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Salary</InputLabel>
          <Select value={salaryFilter} onChange={(e) => setSalaryFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">₹5000+</MenuItem>
            <MenuItem value="medium">₹3000-5000</MenuItem>
            <MenuItem value="low">Below ₹3000</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" fullWidth onClick={applyFilters} sx={{ mb: 1 }}>
          Apply Filters
        </Button>
        <Button variant="outlined" fullWidth onClick={resetFilters}>
          Reset
        </Button>
      </Box>
    </Drawer>
  );

  if (!user && !loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 10 }}>
        <BusinessCenterIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h5" gutterBottom>Sign In Required</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky" color="primary" sx={{ display: isMobile ? 'flex' : 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>JobHunt</Typography>
          <IconButton color="inherit" onClick={() => setFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ pt: isMobile ? 2 : 4, pb: 10 }}>
        {/* Search */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => { setSearchTerm(''); applyFilters(); }}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Paper>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => { 
            setActiveTab(v); 
            setCurrentPage(1);
            const params = new URLSearchParams(location.search);
            params.set('tab', v);
            navigate(`/jobs?${params.toString()}`);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label={`All (${jobs.length})`} />
          <Tab label={`Applied (${applications.length})`} />
          <Tab label={`Saved (${savedJobs.length})`} />
        </Tabs>

        {/* Jobs */}
        {loading ? (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : currentJobs.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" variant="h6" sx={{ py: 5 }}>
            No jobs found. Try different filters!
          </Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {currentJobs.map(job => (
                <Grid item xs={12} key={job.id}>
                  <Card sx={{ position: 'relative' }}>
                    <IconButton sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} onClick={() => toggleSaveJob(job.id)}>
                      {savedJobs.includes(job.id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                    </IconButton>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2 }}>{job.company?.[0]}</Avatar>
                        <div>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{job.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                        </div>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <LocationOnIcon fontSize="small" /> {job.location || 'Remote'} • ₹{job.salary || 'Negotiable'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, height: 60, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {job.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={job.category} size="small" />
                        <Chip label={job.jobType} size="small" />
                      </Box>
                      {job.userId === user?.uid ? (
                        <Button fullWidth variant="outlined" onClick={() => navigate(`/edit-job/${job.id}`)}>
                          Edit Job
                        </Button>
                      ) : applications.some(a => a.jobId === job.id) ? (
                        <Button fullWidth variant="outlined" color="error">
                          Applied
                        </Button>
                      ) : (
                        <Button fullWidth variant="contained" onClick={() => navigate(`/apply/${job.id}`)}>
                          Apply Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, p) => setCurrentPage(p)}
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
              size={isMobile ? "small" : "medium"}
            />
          </>
        )}
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer />

      {/* Desktop Filters */}
      {!isMobile && (
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterOpen(true)}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          Filters
        </Button>
      )}
    </>
  );
}

export default JobList;