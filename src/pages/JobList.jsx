// import { useState, useEffect } from 'react';
// import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
// import { db, auth } from '../firebase';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Chip,
//   InputAdornment,
//   Divider,
//   Avatar,
//   Paper,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   IconButton,
//   Tooltip,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   Skeleton,
//   Badge,
//   Menu,
//   Tabs,
//   Tab,
//   Pagination
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import WorkIcon from '@mui/icons-material/Work';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import CategoryIcon from '@mui/icons-material/Category';
// import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import TuneIcon from '@mui/icons-material/Tune';
// import CloseIcon from '@mui/icons-material/Close';
// import SortIcon from '@mui/icons-material/Sort';
// import { categoryDefinitions } from './Categories';

// function JobList() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isMedium = useMediaQuery(theme.breakpoints.down('md'));

//   // State variables
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [jobsPerPage] = useState(9);

//   // Filter states
//   const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//   const [sortAnchorEl, setSortAnchorEl] = useState(null);
//   const [jobTypeFilter, setJobTypeFilter] = useState('all');
//   const [locationFilter, setLocationFilter] = useState('all');
//   const [salaryFilter, setSalaryFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [showFilters, setShowFilters] = useState(false);

//   // URL params handling
//   const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));
//   const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category'));

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setCategoryFilter(params.get('category'));

//     // Initialize search term from URL if present
//     const urlSearchTerm = params.get('search');
//     if (urlSearchTerm) {
//       setSearchTerm(urlSearchTerm);
//     }

//     // Initialize filters from URL if present
//     const urlJobType = params.get('jobType');
//     if (urlJobType) {
//       setJobTypeFilter(urlJobType);
//     }

//     const urlLocation = params.get('location');
//     if (urlLocation) {
//       setLocationFilter(urlLocation);
//     }

//     const urlSalary = params.get('salary');
//     if (urlSalary) {
//       setSalaryFilter(urlSalary);
//     }

//     const urlSort = params.get('sort');
//     if (urlSort) {
//       setSortBy(urlSort);
//     }

//     // Check for tab parameter in URL
//     const urlTab = params.get('tab');
//     if (urlTab) {
//       const tabIndex = parseInt(urlTab);
//       if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 2) {
//         setActiveTab(tabIndex);
//       } else {
//         // Reset to default tab if invalid
//         setActiveTab(0);
//       }
//     } else {
//       // Always default to "All Jobs" tab when no tab parameter is present
//       setActiveTab(0);
//     }
//   }, [location.search]);

//   // Fetch jobs and applications
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       setLoading(true);
//       try {
//         const jobsSnapshot = await getDocs(collection(db, 'jobs'));
//         const jobsData = jobsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           createdAt: doc.data().createdAt || new Date().toISOString() // Ensure createdAt exists
//         }));
//         setJobs(jobsData);

//         if (user) {
//           // Get all applications for the current user
//           const applicationsSnapshot = await getDocs(
//             query(collection(db, 'applications'), where('userId', '==', user.uid))
//           );
//           const applicationsData = applicationsSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//             status: doc.data().status || 'pending'
//           }));
//           setApplications(applicationsData);

//           // Get saved jobs for the current user
//           const savedJobsSnapshot = await getDocs(
//             query(collection(db, 'savedJobs'), where('userId', '==', user.uid))
//           );
//           const savedJobsData = savedJobsSnapshot.docs.map(doc => doc.data().jobId);
//           setSavedJobs(savedJobsData);
//         } else {
//           setApplications([]);
//           setSavedJobs([]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load jobs or applications');
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Handle application cancellation
//   const handleCancelApplication = async (applicationId) => {
//     try {
//       if (window.confirm('Are you sure you want to withdraw this application?')) {
//         await deleteDoc(doc(db, 'applications', applicationId));
//         setApplications(applications.filter(app => app.id !== applicationId));
//       }
//     } catch (error) {
//       console.error('Error canceling application:', error);
//       setError('Failed to cancel application');
//     }
//   };

//   // Handle job deletion
//   const handleDelete = async (jobId) => {
//     try {
//       if (window.confirm('Are you sure you want to delete this job posting?')) {
//         await deleteDoc(doc(db, 'jobs', jobId));
//         setJobs(jobs.filter(job => job.id !== jobId));
//       }
//     } catch (error) {
//       console.error('Error deleting job:', error);
//       setError('Failed to delete job');
//     }
//   };

//   // Handle job editing
//   const handleEdit = (jobId) => {
//     navigate(`/edit-job/${jobId}`);
//   };

//   // Handle saving/unsaving jobs
//   const toggleSaveJob = (jobId) => {
//     setSavedJobs(prev =>
//       prev.includes(jobId)
//         ? prev.filter(id => id !== jobId)
//         : [...prev, jobId]
//     );
//   };

//   // Filter menu handlers
//   const handleFilterClick = (event) => {
//     setFilterAnchorEl(event.currentTarget);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchorEl(null);
//   };

//   const handleSortClick = (event) => {
//     setSortAnchorEl(event.currentTarget);
//   };

//   const handleSortClose = () => {
//     setSortAnchorEl(null);
//   };

//   // Tab change handler
//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setCurrentPage(1); // Reset to first page when changing tabs

//     // Update URL with the selected tab
//     const params = new URLSearchParams(location.search);
//     params.set('tab', newValue.toString());
//     navigate(`/jobs?${params.toString()}`);
//   };

//   // Apply filters and update URL
//   const applyFilters = () => {
//     const params = new URLSearchParams();

//     if (searchTerm) {
//       params.append('search', searchTerm);
//     }

//     if (categoryFilter) {
//       params.append('category', categoryFilter);
//     }

//     if (jobTypeFilter !== 'all') {
//       params.append('jobType', jobTypeFilter);
//     }

//     if (locationFilter !== 'all') {
//       params.append('location', locationFilter);
//     }

//     if (salaryFilter !== 'all') {
//       params.append('salary', salaryFilter);
//     }

//     if (sortBy !== 'newest') {
//       params.append('sort', sortBy);
//     }

//     navigate(`/jobs?${params.toString()}`);
//     handleFilterClose();
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setJobTypeFilter('all');
//     setLocationFilter('all');
//     setSalaryFilter('all');
//     setSortBy('newest');
//     setCategoryFilter(null);
//     setSearchTerm('');
//     navigate('/jobs');
//     handleFilterClose();
//   };

//   // Get all category names in lowercase for comparison
//   const categoryNames = categoryDefinitions.map(cat => cat.name.toLowerCase());

//   // Get unique locations and job types for filter dropdowns
//   const uniqueLocations = [...new Set(jobs.map(job => job.location || 'Remote').filter(Boolean))];
//   const uniqueJobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];

//   // Filter and sort jobs
//   const filteredJobs = jobs.filter(job => {
//     // Search term filter
//     const searchTermLower = searchTerm.toLowerCase();
//     const matchesSearch = !searchTerm ||
//       job.title?.toLowerCase().includes(searchTermLower) ||
//       job.company?.toLowerCase().includes(searchTermLower) ||
//       job.description?.toLowerCase().includes(searchTermLower);

//     // Category filter
//     const matchesCategory = !categoryFilter ||
//       (job.category && job.category.toLowerCase() === categoryFilter.toLowerCase());

//     // Job type filter
//     const matchesJobType = jobTypeFilter === 'all' ||
//       job.jobType === jobTypeFilter;

//     // Location filter
//     const matchesLocation = locationFilter === 'all' ||
//       job.location === locationFilter ||
//       (locationFilter === 'Remote' && (!job.location || job.location === 'Remote'));

//     // Salary filter (simplified for demo)
//     const matchesSalary = salaryFilter === 'all' ||
//       (salaryFilter === 'high' && parseInt(job.salary || '0') >= 5000) ||
//       (salaryFilter === 'medium' && parseInt(job.salary || '0') >= 3000 && parseInt(job.salary || '0') < 5000) ||
//       (salaryFilter === 'low' && parseInt(job.salary || '0') < 3000);

//     // Tab filter
//     if (activeTab === 1) {
//       // My Applications tab
//       return applications.some(app => app.jobId === job.id);
//     } else if (activeTab === 2) {
//       // Saved Jobs tab
//       return savedJobs.includes(job.id);
//     }

//     // All Jobs tab (default)
//     return matchesSearch && matchesCategory && matchesJobType && matchesLocation && matchesSalary;
//   }).sort((a, b) => {
//     // Sort jobs
//     if (sortBy === 'newest') {
//       return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
//     } else if (sortBy === 'oldest') {
//       return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
//     } else if (sortBy === 'salary-high') {
//       return (parseInt(b.salary || '0') - parseInt(a.salary || '0'));
//     } else if (sortBy === 'salary-low') {
//       return (parseInt(a.salary || '0') - parseInt(b.salary || '0'));
//     } else if (sortBy === 'alphabetical') {
//       return (a.title || '').localeCompare(b.title || '');
//     }
//     return 0;
//   });

//   // Pagination logic
//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
//   const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

//   // Handle page change
//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//     // Scroll to top when changing pages
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Loading Skeleton Component
//   const JobCardSkeleton = () => (
//     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <CardContent>
//         <Skeleton variant="text" width="70%" height={32} />
//         <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
//         <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
//         <Box sx={{ mt: 2 }}>
//           <Skeleton variant="rectangular" width="100%" height={60} />
//         </Box>
//         <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
//           <Skeleton variant="rounded" width={80} height={32} />
//           <Skeleton variant="rounded" width={80} height={32} />
//           <Skeleton variant="rounded" width={80} height={32} />
//         </Stack>
//       </CardContent>
//     </Card>
//   );
  
//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
//       {!auth.currentUser ? (
//         <Paper
//           elevation={3}
//           sx={{
//             textAlign: 'center',
//             py: { xs: 6, md: 8 },
//             px: { xs: 3, md: 4 },
//             borderRadius: 3,
//             background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
//           }}
//         >
//           <BusinessCenterIcon sx={{ fontSize: { xs: 50, md: 60 }, color: 'primary.main', mb: 2 }} />
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
//             Please sign in to view available jobs
//           </Typography>
//           <Typography
//             variant="body1"
//             color="text.secondary"
//             paragraph
//             sx={{
//               maxWidth: 600,
//               mx: 'auto',
//               mb: 4,
//               fontSize: { xs: '0.95rem', md: '1rem' }
//             }}
//           >
//             Create an account or sign in to browse and apply for jobs that match your skills and career goals.
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             onClick={() => navigate('/signin')}
//             sx={{
//               px: 4,
//               py: 1.5,
//               borderRadius: 2,
//               fontSize: { xs: '1rem', md: '1.1rem' },
//               boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
//               '&:hover': {
//                 boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
//                 transform: 'translateY(-2px)'
//               },
//               transition: 'all 0.2s ease-in-out'
//             }}
//           >
//             Sign In
//           </Button>
//         ) : (
//           <>
//             {error ? (
//               <Alert 
//                 severity="error" 
//                 sx={{ 
//                   mt: 4,
//                   borderRadius: 2,
//                   boxShadow: '0 2px 8px rgba(239, 68, 68, 0.12)'
//                 }}
//               >
//                 {error}
//                 <Button 
//                   color="inherit" 
//                   size="small" 
//                   onClick={() => window.location.reload()}
//                   sx={{ ml: 2 }}
//                 >
//                   Retry
//                 </Button>
//               </Alert>
//             ) : loading ? (
//               <Grid container spacing={3} sx={{ mt: 2 }}>
//                 {[1, 2, 3, 4, 5, 6].map((item) => (
//                   <Grid item xs={12} sm={6} md={4} key={item}>
//                     <JobCardSkeleton />
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : (
//               // ... rest of your existing code ...
//             )}
//           </>
//         )}

//       {/* Header Section */}
//       <Box
//         sx={{
//           mb: { xs: 4, md: 6 },
//           background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
//           borderRadius: 3,
//           p: { xs: 3, md: 5 },
//           color: 'white',
//           position: 'relative',
//           overflow: 'hidden'
//         }}
//       >
//         {/* Background Pattern */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             opacity: 0.1,
//             background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
//         }}
//       />

//       <Box sx={{ position: 'relative', zIndex: 2 }}>
//         <Typography
//           variant="h3"
//           component="h1"
//           gutterBottom
//           sx={{
//             fontWeight: 800,
//             fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
//             mb: 2,
//             textShadow: '0 2px 10px rgba(0,0,0,0.1)'
//           }}
//         >
//           Discover Your Next Opportunity
//         </Typography>

//         <Typography
//           variant="h6"
//           sx={{
//             mb: 3,
//             fontWeight: 400,
//             opacity: 0.9,
//             fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
//           }}
//         >
//           {loading ? 'Loading available positions...' :
//             filteredJobs.length > 0 ?
//               `${filteredJobs.length} ${filteredJobs.length === 1 ? 'position' : 'positions'} available - Find your perfect role today` :
//               'Search for your ideal job using the filters below'}
//         </Typography>

//         {/* Search Box */}
//         <Paper
//           elevation={2}
//           sx={{
//             p: { xs: 2, md: 3 },
//             borderRadius: 3,
//             background: 'white',
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//           }}
//         >
//           <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Search by title, company, or keywords"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   applyFilters();
//                   e.preventDefault();
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   backgroundColor: 'white',
//                   transition: 'all 0.2s ease-in-out',
//                   '&:hover': {
//                     boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
//                   },
//                   '&.Mui-focused': {
//                     boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)'
//                   }
//                 }
//               }}
//             />

//             <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
//               <Tooltip title="Filter Jobs">
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={handleFilterClick}
//                   sx={{
//                     height: '56px',
//                     minWidth: '56px',
//                     borderRadius: 2,
//                     display: { xs: 'flex', md: 'none' }
//                   }}
//                 >
//                   <FilterListIcon />
//                 </Button>
//               </Tooltip>

//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={handleFilterClick}
//                 startIcon={<FilterListIcon />}
//                 sx={{
//                   height: '56px',
//                   borderRadius: 2,
//                   fontWeight: 600,
//                   display: { xs: 'none', md: 'flex' }
//                 }}
//               >
//                 Filters
//               </Button>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={applyFilters}
//                 sx={{
//                   height: '56px',
//                   borderRadius: 2,
//                   fontWeight: 600,
//                   boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
//                   '&:hover': {
//                     boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
//                     transform: 'translateY(-2px)'
//                   },
//                   transition: 'all 0.2s ease-in-out',
//                   flex: 1
//                 }}
//               >
//                 Search Jobs
//               </Button>
//             </Box>
//         </Box>

//         {/* Active Filters Display */}
//         {(categoryFilter || jobTypeFilter !== 'all' || locationFilter !== 'all' || salaryFilter !== 'all') && (
//           <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
//             <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
//               Active filters:
//             </Typography>

//             {categoryFilter && (
//               <Chip
//                 label={`Category: ${categoryFilter}`}
//                 color="primary"
//                 variant="outlined"
//                 onDelete={() => {
//                   setCategoryFilter(null);
//                   const params = new URLSearchParams(location.search);
//                   params.delete('category');
//                   navigate(`/jobs?${params.toString()}`);
//                 }}
//                 sx={{
//                   borderRadius: '16px',
//                   textTransform: 'capitalize'
//                 }}
//               />
//             )}

//             {jobTypeFilter !== 'all' && (
//               <Chip
//                 label={`Type: ${jobTypeFilter}`}
//                 color="primary"
//                 variant="outlined"
//                 onDelete={() => {
//                   setJobTypeFilter('all');
//                   const params = new URLSearchParams(location.search);
//                   params.delete('jobType');
//                   navigate(`/jobs?${params.toString()}`);
//                 }}
//                 sx={{
//                   borderRadius: '16px',
//                   textTransform: 'capitalize'
//                 }}
//               />
//             )}

//             {locationFilter !== 'all' && (
//               <Chip
//                 label={`Location: ${locationFilter}`}
//                 color="primary"
//                 variant="outlined"
//                 onDelete={() => {
//                   setLocationFilter('all');
//                   const params = new URLSearchParams(location.search);
//                   params.delete('location');
//                   navigate(`/jobs?${params.toString()}`);
//                 }}
//                 sx={{
//                   borderRadius: '16px',
//                   textTransform: 'capitalize'
//                 }}
//               />
//             )}

//             {salaryFilter !== 'all' && (
//               <Chip
//                 label={`Salary: ${salaryFilter}`}
//                 color="primary"
//                 variant="outlined"
//                 onDelete={() => {
//                   setSalaryFilter('all');
//                   const params = new URLSearchParams(location.search);
//                   params.delete('salary');
//                   navigate(`/jobs?${params.toString()}`);
//                 }}
//                 sx={{
//                   borderRadius: '16px',
//                   textTransform: 'capitalize'
//                 }}
//               />
//             )}

//             <Button
//               variant="text"
//               color="primary"
//               size="small"
//               onClick={resetFilters}
//               startIcon={<CloseIcon fontSize="small" />}
//               sx={{ ml: 'auto', fontSize: '0.8rem' }}
//             >
//               Clear All
//             </Button>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   </Box>

//   {/* Filter Menu */}
//   <Menu
//     anchorEl={filterAnchorEl}
//     open={Boolean(filterAnchorEl)}
//     onClose={handleFilterClose}
//     PaperProps={{
//       elevation: 3,
//       sx: {
//         mt: 1.5,
//         width: { xs: 280, sm: 350 },
//         borderRadius: 2,
//         p: 2
//       }
//     }}
//   >
//     <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
//       Filter Jobs
//     </Typography>

//     <FormControl fullWidth sx={{ mb: 2 }}>
//       <InputLabel id="job-type-label">Job Type</InputLabel>
//       <Select
//         labelId="job-type-label"
//         value={jobTypeFilter}
//         onChange={(e) => setJobTypeFilter(e.target.value)}
//         label="Job Type"
//         size="small"
//       >
//         <MenuItem value="all">All Types</MenuItem>
//         {uniqueJobTypes.map(type => (
//           <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
//             {type}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <FormControl fullWidth sx={{ mb: 2 }}>
//       <InputLabel id="location-label">Location</InputLabel>
//       <Select
//         labelId="location-label"
//         value={locationFilter}
//         onChange={(e) => setLocationFilter(e.target.value)}
//         label="Location"
//         size="small"
//       >
//         <MenuItem value="all">All Locations</MenuItem>
//         {uniqueLocations.map(location => (
//           <MenuItem key={location} value={location}>
//             {location}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <FormControl fullWidth sx={{ mb: 2 }}>
//       <InputLabel id="salary-label">Salary Range</InputLabel>
//       <Select
//         labelId="salary-label"
//         value={salaryFilter}
//         onChange={(e) => setSalaryFilter(e.target.value)}
//         label="Salary Range"
//         size="small"
//       >
//         <MenuItem value="all">All Ranges</MenuItem>
//         <MenuItem value="high">High (5000+)</MenuItem>
//         <MenuItem value="medium">Medium (3000-5000)</MenuItem>
//         <MenuItem value="low">Low (Below 3000)</MenuItem>
//       </Select>
//     </FormControl>

//     <FormControl fullWidth sx={{ mb: 3 }}>
//       <InputLabel id="sort-label">Sort By</InputLabel>
//       <Select
//         labelId="sort-label"
//         value={sortBy}
//         onChange={(e) => setSortBy(e.target.value)}
//         label="Sort By"
//         size="small"
//       >
//         <MenuItem value="newest">Newest First</MenuItem>
//         <MenuItem value="oldest">Oldest First</MenuItem>
//         <MenuItem value="salary-high">Highest Salary</MenuItem>
//         <MenuItem value="salary-low">Lowest Salary</MenuItem>
//         <MenuItem value="alphabetical">Alphabetical</MenuItem>
//       </Select>
//     </FormControl>

//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//       <Button
//         variant="outlined"
//         color="primary"
//         onClick={resetFilters}
//         size="small"
//       >
//         Reset
//       </Button>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={applyFilters}
//         size="small"
//       >
//         Apply Filters
//       </Button>
//     </Box>
//   </Menu>

//   {/* Tabs Section */}
//   <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
//     <Tabs
//       value={activeTab}
//       onChange={handleTabChange}
//       variant={isMobile ? "scrollable" : "standard"}
//       scrollButtons={isMobile ? "auto" : false}
//       allowScrollButtonsMobile
//       sx={{
//         '& .MuiTab-root': {
//           textTransform: 'none',
//           fontWeight: 600,
//           fontSize: { xs: '0.9rem', md: '1rem' },
//           minWidth: { xs: 'auto', md: 150 }
//         }
//       }}
//     >
//       <Tab
//         label={
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography>All Jobs</Typography>
//             {!loading && (
//               <Chip
//                 label={jobs.length}
//                 size="small"
//                 sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
//               />
//             )}
//           </Box>
//         }
//       />
//       <Tab
//         label={
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography>My Applications</Typography>
//             {!loading && (
//               <Chip
//                 label={applications.length}
//                 size="small"
//                 sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
//               />
//             )}
//           </Box>
//         }
//       />
//       <Tab
//         label={
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography>Saved Jobs</Typography>
//             {!loading && (
//               <Chip
//                 label={savedJobs.length}
//                 size="small"
//                 sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
//               />
//             )}
//           </Box>
//         }
//       />
//     </Tabs>
//   </Box>

//   {/* Loading State */}
//   {loading ? (
//     <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 2, md: 4 } }}>
//       {Array.from(new Array(6)).map((_, index) => (
//         <Grid item xs={12} sm={6} md={4} key={index}>
//           <Skeleton
//             variant="rectangular"
//             height={300}
//             sx={{ borderRadius: 2 }}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   ) : currentJobs.length === 0 ? (
//     <Grid item xs={12}>
//       <Paper
//         sx={{
//           p: { xs: 2, md: 3 },
//           textAlign: 'center',
//           borderRadius: 2,
//           bgcolor: '#f8fafc'
//         }}
//       >
//         <Typography variant="h6" color="text.secondary">
//           No jobs found matching your criteria
//         </Typography>
//       </Paper>
//     </Grid>
//   ) : (
//     <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 2, md: 4 } }}>
//       {currentJobs.map(job => (
//         <Grid item xs={12} sm={6} md={4} key={job.id}>
//           <Card
//             sx={{
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               p: { xs: 2, md: 3 },
//               borderRadius: 2,
//               transition: 'all 0.2s ease-in-out',
//               '&:hover': {
//                 transform: { xs: 'none', md: 'translateY(-4px)' },
//                 boxShadow: { xs: '0 4px 12px rgba(37, 99, 235, 0.08)', md: '0 12px 24px rgba(37, 99, 235, 0.12)' }
//               }
//             }}
//           >
//               {/* Save Job Button */}
//               <IconButton
//                 size="small"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSaveJob(job.id);
//                 }}
//                 sx={{
//                   position: 'absolute',
//                   top: 12,
//                   right: 12,
//                   bgcolor: 'white',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                   zIndex: 2,
//                   '&:hover': {
//                     bgcolor: 'white',
//                     transform: 'scale(1.1)'
//                   }
//                 }}
//               >
//                 {savedJobs.includes(job.id) ? (
//                   <BookmarkIcon color="primary" />
//                 ) : (
//                   <BookmarkBorderIcon color="primary" />
//                 )}
//               </IconButton>

//               <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <Avatar
//                     sx={{
//                       width: 45,
//                       height: 45,
//                       bgcolor: job.category ?
//                         job.category.toLowerCase() === 'technology' ? '#7c3aed' :
//                         job.category.toLowerCase() === 'healthcare' ? '#06b6d4' :
//                         job.category.toLowerCase() === 'education' ? '#10b981' :
//                         job.category.toLowerCase() === 'finance' ? '#8b5cf6' :
//                         job.category.toLowerCase() === 'retail' ? '#f59e0b' :
//                         job.category.toLowerCase() === 'manufacturing' ? '#ef4444' :
//                         'primary.light' : 'primary.light',
//                       mr: 1.5,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '1.2rem',
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     {job.company?.charAt(0) || 'J'}
//                   </Avatar>
//                   <Box>
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         color: '#1e3a8a',
//                         fontWeight: 700,
//                         mb: 0.5,
//                         lineHeight: 1.2,
//                         pr: 4 // Space for bookmark icon
//                       }}
//                     >
//                       {job.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>
//                       {job.company}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                   {job.category && (
//                     <Chip
//                       label={job.category}
//                       color="primary"
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         textTransform: 'capitalize',
//                         borderRadius: '16px',
//                         fontWeight: 500
//                       }}
//                     />
//                   )}

//                   {job.jobType && (
//                     <Chip
//                       label={job.jobType}
//                       color="secondary"
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         textTransform: 'capitalize',
//                         borderRadius: '16px',
//                         fontWeight: 500,
//                         bgcolor: job.jobType === 'full-time' ? 'rgba(25, 118, 210, 0.08)' :
//                                     job.jobType === 'part-time' ? 'rgba(46, 125, 50, 0.08)' :
//                                     job.jobType === 'contract' ? 'rgba(245, 124, 0, 0.08)' :
//                                     job.jobType === 'internship' ? 'rgba(123, 31, 162, 0.08)' : 'rgba(0, 0, 0, 0.08)',
//                         borderColor: job.jobType === 'full-time' ? '#1976d2' :
//                                         job.jobType === 'part-time' ? '#2e7d32' :
//                                         job.jobType === 'contract' ? '#f57c00' :
//                                         job.jobType === 'internship' ? '#7b1fa2' : '#757575',
//                         color: job.jobType === 'full-time' ? '#1976d2' :
//                               job.jobType === 'part-time' ? '#2e7d32' :
//                               job.jobType === 'contract' ? '#f57c00' :
//                               job.jobType === 'internship' ? '#7b1fa2' : '#757575'
//                       }}
//                     />
//                   )}

//                   {/* Posted Date */}
//                   {job.createdAt && (
//                     <Chip
//                       icon={<AccessTimeIcon fontSize="small" />}
//                       label={`${Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))} days ago`}
//                       size="small"
//                       variant="outlined"
//                       sx={{
//                         borderRadius: '16px',
//                         fontSize: '0.7rem',
//                         height: 24,
//                         ml: 'auto'
//                       }}
//                     />
//                   )}
//                 </Box>

//                 <Divider sx={{ my: 1.5 }} />

//                 <Typography
//                   variant="body2"
//                   paragraph
//                   sx={{
//                     color: 'text.primary',
//                     mb: 2,
//                     lineHeight: 1.6,
//                     height: '4.8em', // 3 lines of text
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     display: '-webkit-box',
//                     WebkitLineClamp: 3,
//                     WebkitBoxOrient: 'vertical',
//                   }}
//                 >
//                   {job.description}
//                 </Typography>

//                 <Box sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: 1,
//                   mb: 2,
//                   '& .detail-item': {
//                     display: 'flex',
//                     alignItems: 'center',
//                     color: 'text.secondary'
//                   },
//                   '& .detail-icon': {
//                     color: 'primary.main',
//                     mr: 1,
//                     fontSize: '1rem'
//                   }
//                 }}>
//                   <Box className="detail-item">
//                     <LocationOnIcon className="detail-icon" />
//                     <Typography variant="body2" fontWeight={500} noWrap>
//                       {job.location || 'Remote'}
//                     </Typography>
//                   </Box>

//                   <Box className="detail-item">
//                     <AttachMoneyIcon className="detail-icon" />
//                     <Typography variant="body2" fontWeight={500} noWrap>
//                       {job.salary ? `${job.salary} per month` : 'Competitive salary'}
//                     </Typography>
//                   </Box>

//                   {job.jobType && (
//                     <Box className="detail-item">
//                       <WorkIcon className="detail-icon" />
//                       <Typography variant="body2" fontWeight={500} noWrap sx={{ textTransform: 'capitalize' }}>
//                         {job.jobType}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>

//                 <Box sx={{ mt: 'auto' }}>
//                   {/* Check if current user is the job owner by UID or email */}
//                   {(job.userId === auth.currentUser?.uid ||
//                     job.userEmail === auth.currentUser?.email) ? (
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         size="small"
//                         onClick={() => handleEdit(job.id)}
//                         sx={{
//                           borderRadius: 2,
//                           py: 0.75,
//                           fontWeight: 600,
//                           flex: 1
//                         }}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => handleDelete(job.id)}
//                         sx={{
//                           borderRadius: 2,
//                           py: 0.75,
//                           fontWeight: 600,
//                           flex: 1
//                         }}
//                       >
//                         Delete
//                       </Button>
//                     </Box>
//                   ) : (
//                     <Box>
//                       {applications.some(app => app.jobId === job.id && app.status !== 'deleted') ? (
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                           {(() => {
//                             const application = applications.find(app => app.jobId === job.id);
//                             const status = application?.status || 'pending';
//                             const statusColor = {
//                               'accepted': 'success',
//                               'rejected': 'error',
//                               'pending': 'primary'
//                             }[status] || 'primary';

//                             const statusText = {
//                               'accepted': 'Application Accepted',
//                               'rejected': 'Application Rejected',
//                               'pending': 'Application Pending'
//                             }[status] || 'Application Pending';

//                             return (
//                               <Chip
//                                 label={statusText}
//                                 color={statusColor}
//                                 size="small"
//                                 sx={{
//                                   borderRadius: '16px',
//                                   fontWeight: 600,
//                                   fontSize: '0.8rem'
//                                 }}
//                               />
//                             );
//                           })()}

//                           <Button
//                             variant="outlined"
//                             color="error"
//                             size="small"
//                             onClick={() => handleCancelApplication(applications.find(app => app.jobId === job.id)?.id)}
//                             disabled={applications.find(app => app.jobId === job.id)?.status === 'accepted'}
//                             sx={{
//                               borderRadius: 2,
//                               py: 0.75,
//                               fontWeight: 600
//                             }}
//                           >
//                             Withdraw
//                           </Button>
//                         </Box>
//                       ) : (
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           fullWidth
//                           onClick={() => navigate(`/apply/${job.id}`)}
//                           sx={{
//                             borderRadius: 2,
//                             py: 0.75,
//                             fontWeight: 600,
//                             boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
//                             '&:hover': {
//                               boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
//                               transform: 'translateY(-2px)'
//                             }
//                           }}
//                         >
//                           Apply Now
//                         </Button>
//                       )}
//                     </Box>
//                   )}

//                   {error && (
//                     <Typography color="error" variant="caption" sx={{ mt: 1, fontWeight: 500, display: 'block' }}>
//                       {error}
//                     </Typography>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Pagination */}
//       {filteredJobs.length > jobsPerPage && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={handlePageChange}
//             color="primary"
//             size={isMobile ? "small" : "medium"}
//             showFirstButton
//             showLastButton
//             sx={{
//               '& .MuiPaginationItem-root': {
//                 fontWeight: 600
//               }
//             }}
//           />
//         </Box>
//       )}
//     </>
//   )}
// </>
// );
// }

// export default JobList;

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
          onChange={(_, v) => { setActiveTab(v); setCurrentPage(1); }}
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