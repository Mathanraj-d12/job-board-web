import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Card,
  CardContent,
  LinearProgress,
  Fade,
  Grow,
  Avatar
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ComputerIcon from '@mui/icons-material/Computer';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FactoryIcon from '@mui/icons-material/Factory';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

// Category definitions with improved icons and descriptions
export const categoryDefinitions = [
  {
    id: 11,
    name: 'Business',
    icon: <BusinessCenterIcon />,
    description: 'Business management, consulting, and administration roles',
    color: '#2563eb' // blue
  },
  {
    id: 1,
    name: 'Technology',
    icon: <ComputerIcon />,
    description: 'Software development, IT support, and technical roles',
    color: '#7c3aed' // purple
  },
  {
    id: 2,
    name: 'Marketing',
    icon: <LocalOfferIcon />,
    description: 'Digital marketing, brand management, and market research',
    color: '#f59e0b' // amber
  },
  {
    id: 3,
    name: 'Design',
    icon: <DesignServicesIcon />,
    description: 'Graphic design, UX/UI, and creative direction',
    color: '#ec4899' // pink
  },
  {
    id: 4,
    name: 'Sales',
    icon: <PeopleIcon />,
    description: 'Sales representatives, account management, and business development',
    color: '#10b981' // emerald
  },
  {
    id: 5,
    name: 'Customer Service',
    icon: <GroupAddIcon />,
    description: 'Customer support, client relations, and service management',
    color: '#0ea5e9' // sky
  },
  {
    id: 6,
    name: 'Finance',
    icon: <MonetizationOnIcon />,
    description: 'Accounting, financial analysis, and investment management',
    color: '#64748b' // slate
  },
  {
    id: 7,
    name: 'Healthcare',
    icon: <HealthAndSafetyIcon />,
    description: 'Medical professionals, healthcare administration, and wellness',
    color: '#06b6d4' // cyan
  },
  {
    id: 8,
    name: 'Education',
    icon: <SchoolIcon />,
    description: 'Teaching, training, and educational administration',
    color: '#8b5cf6' // violet
  },
  {
    id: 9,
    name: 'Engineering',
    icon: <EngineeringIcon />,
    description: 'Civil, mechanical, electrical, and software engineering',
    color: '#f97316' // orange
  },
  {
    id: 10,
    name: 'Human Resources',
    icon: <PeopleIcon />,
    description: 'Recruitment, employee relations, and HR management',
    color: '#14b8a6' // teal
  },
  {
    id: 12,
    name: 'Retail',
    icon: <StorefrontIcon />,
    description: 'Store management, merchandising, and retail operations',
    color: '#ef4444' // red
  },
  {
    id: 13,
    name: 'Manufacturing',
    icon: <FactoryIcon />,
    description: 'Production, quality control, and manufacturing operations',
    color: '#6366f1' // indigo
  }
];

function Categories() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const jobs = jobsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));

        const categoryCounts = categoryDefinitions.map(category => {
          // Count jobs for each category
          const count = jobs.filter(job =>
            job.category && job.category.toLowerCase() === category.name.toLowerCase()
          ).length;

          return { ...category, count };
        });

        // Sort categories by job count (descending)
        const sortedCategories = [...categoryCounts].sort((a, b) => b.count - a.count);

        // Set top 4 categories as popular
        setPopularCategories(sortedCategories.slice(0, 4));
        setCategories(categoryCounts);
        setLoading(false);

        // Fetch featured jobs (newest 3 jobs)
        try {
          const featuredJobsQuery = query(
            collection(db, 'jobs'),
            orderBy('createdAt', 'desc'),
            limit(3)
          );

          const featuredSnapshot = await getDocs(featuredJobsQuery);
          const featuredJobsData = featuredSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setFeaturedJobs(featuredJobsData);
          setFeaturedLoading(false);
        } catch (error) {
          console.error('Error fetching featured jobs:', error);
          setFeaturedLoading(false);
        }

      } catch (error) {
        console.error('Error fetching job counts:', error);
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, []);

  // Function to get a lighter version of the category color for backgrounds
  const getLighterColor = (color) => {
    return `${color}15`; // 15% opacity
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          mt: { xs: 4, md: 6 },
          mb: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
          boxShadow: '0 10px 40px rgba(37, 99, 235, 0.2)',
          color: 'white',
          py: { xs: 4, md: 6 },
          px: { xs: 3, md: 5 }
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <CategoryIcon sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Explore Career Categories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              fontWeight: 400,
              opacity: 0.9,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Browse through our comprehensive list of professional categories to find your perfect career match
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/jobs')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)'
                }
              }}
            >
              Search All Jobs
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<WorkIcon />}
              onClick={() => navigate('/personality-quiz')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Take Career Quiz
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Popular Categories Section */}
      {!loading && popularCategories.length > 0 && (
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <TrendingUpIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              Popular Categories
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {popularCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Grow in={true} timeout={(index + 1) * 200}>
                  <Paper
                    component={RouterLink}
                    to={`/jobs?category=${encodeURIComponent(category.name.toLowerCase())}`}
                    elevation={3}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px 24px',
                      borderRadius: 4,
                      height: '100%',
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${getLighterColor(category.color)} 0%, white 100%)`,
                      border: '1px solid',
                      borderColor: `${category.color}30`,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 28px ${category.color}20`,
                        borderColor: `${category.color}50`,
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: category.color,
                        mb: 2,
                        boxShadow: `0 8px 16px ${category.color}30`
                      }}
                    >
                      {React.cloneElement(category.icon, {
                        sx: {
                          fontSize: 36,
                          color: 'white'
                        }
                      })}
                    </Avatar>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1
                      }}
                    >
                      {category.name}
                    </Typography>

                    <Chip
                      label={`${category.count} ${category.count === 1 ? 'job' : 'jobs'}`}
                      color="primary"
                      size="small"
                      sx={{
                        bgcolor: category.color,
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    />
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Featured Jobs Section */}
      {!featuredLoading && featuredJobs.length > 0 && (
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Featured Opportunities
              </Typography>
            </Box>

            <Button
              variant="text"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/jobs')}
              sx={{ fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredJobs.map((job, index) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Fade in={true} timeout={(index + 1) * 300}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          label={job.category || 'General'}
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600,
                            mb: 1
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(job.createdAt)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          lineHeight: 1.3
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {job.company} • {job.location}
                      </Typography>

                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          component={RouterLink}
                          to={`/apply/${job.id}`}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Categories Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        {loading ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
              <Skeleton variant="text" width={200} height={40} />
            </Box>

            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={180}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <CategoryIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                All Career Categories
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Fade in={true} timeout={300 + (index * 100)}>
                    <Paper
                      component={RouterLink}
                      to={`/jobs?category=${encodeURIComponent(category.name.toLowerCase())}`}
                      elevation={2}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        padding: '24px',
                        borderRadius: 3,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'white',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                          borderColor: `${category.color}40`,
                          '& .category-icon-wrapper': {
                            bgcolor: category.color,
                            '& svg': {
                              color: 'white'
                            }
                          }
                        }
                      }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          justifyContent: 'space-between'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Box
                              className="category-icon-wrapper"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: getLighterColor(category.color),
                                mr: 2,
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {React.cloneElement(category.icon, {
                                sx: {
                                  fontSize: 28,
                                  color: category.color,
                                  transition: 'all 0.3s ease'
                                }
                              })}
                            </Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                fontSize: { xs: '1.25rem', md: '1.4rem' }
                              }}
                            >
                              {category.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {category.description}
                        </Typography>

                        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={`${category.count} ${category.count === 1 ? 'job' : 'jobs'}`}
                            size="small"
                            sx={{
                              bgcolor: category.count > 0 ? getLighterColor(category.color) : 'grey.100',
                              color: category.count > 0 ? category.color : 'text.secondary',
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: category.count > 0 ? `${category.color}30` : 'grey.200'
                            }}
                          />

                          <ArrowForwardIcon
                            sx={{
                              color: 'text.secondary',
                              opacity: 0.6,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                color: category.color,
                                opacity: 1
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          mb: 8,
          textAlign: 'center',
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: 'primary.dark',
            mb: 2
          }}
        >
          Ready to Find Your Dream Job?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 4,
            color: 'text.secondary'
          }}
        >
          Browse through our extensive job listings or take our personality quiz to discover the perfect career path for your skills and interests.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/jobs')}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Browse All Jobs
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<WorkIcon />}
            onClick={() => navigate('/personality-quiz')}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Take Career Quiz
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Categories;
