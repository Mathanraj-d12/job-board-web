import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import ComputerIcon from '@mui/icons-material/Computer';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FactoryIcon from '@mui/icons-material/Factory';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categories = [
    { name: 'Business', icon: <BusinessIcon />, color: '#2563eb' },
    { name: 'Technology', icon: <ComputerIcon />, color: '#7c3aed' },
    { name: 'Healthcare', icon: <LocalHospitalIcon />, color: '#06b6d4' },
    { name: 'Education', icon: <SchoolIcon />, color: '#10b981' },
    { name: 'Retail', icon: <StorefrontIcon />, color: '#f59e0b' },
    { name: 'Finance', icon: <AccountBalanceIcon />, color: '#8b5cf6' },
    { name: 'Manufacturing', icon: <FactoryIcon />, color: '#ef4444' },
    { name: 'Other', icon: <MoreHorizIcon />, color: '#6b7280' }
  ];

  const features = [
    {
      icon: <SearchIcon />,
      title: 'Smart Job Search',
      description: 'Find the perfect job match with our intelligent search algorithms'
    },
    {
      icon: <WorkIcon />,
      title: 'Career Growth',
      description: 'Discover opportunities that align with your career goals and aspirations'
    },
    {
      icon: <PeopleIcon />,
      title: 'Networking',
      description: 'Connect with industry professionals and expand your professional network'
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Skill Development',
      description: 'Identify in-demand skills and enhance your professional profile'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Software Developer',
      company: 'Tech Innovations',
      content: 'This platform helped me find my dream job in just two weeks! The application process was seamless and the interface is incredibly user-friendly.'
    },
    {
      name: 'Michael Chen',
      position: 'Marketing Director',
      company: 'Global Brands',
      content: 'As an employer, I\'ve found exceptional talent through this job board. The quality of applicants has been consistently high.'
    },
    {
      name: 'Emily Rodriguez',
      position: 'HR Manager',
      company: 'Future Solutions',
      content: 'The platform streamlines our recruitment process and helps us connect with qualified candidates quickly. Highly recommended!'
    }
  ];

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
          color: 'white',
          pt: { xs: 8, sm: 12, md: 16 },
          pb: { xs: 10, sm: 14, md: 20 },
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: -6, sm: -8, md: -10 }
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

        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                mb: 3,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                lineHeight: 1.2
              }}
            >
              Find Your Dream Job Today
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 5,
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
              }}
            >
              Connect with top employers and discover opportunities that match your skills and career goals
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/jobs')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  minWidth: { xs: '100%', sm: '200px' }
                }}
              >
                Find Jobs
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/job-post')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  borderRadius: 2,
                  minWidth: { xs: '100%', sm: '200px' }
                }}
              >
                Post a Job
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, sm: 10, md: 12 }, mb: { xs: 8, sm: 10, md: 12 } }}>
        {/* Stats Section */}
        <Box
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 4,
            py: 4,
            px: { xs: 3, sm: 6 },
            mt: { xs: 0, sm: -8, md: -10 },
            mb: { xs: 6, sm: 8, md: 10 },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            background: 'white',
            position: 'relative',
            zIndex: 10
          }}
        >
          <Box sx={{ textAlign: 'center', p: 2, minWidth: { xs: '50%', sm: '25%' } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>1000+</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Active Jobs</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: 2, minWidth: { xs: '50%', sm: '25%' } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>500+</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Companies</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: 2, minWidth: { xs: '50%', sm: '25%' } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>10K+</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Job Seekers</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: 2, minWidth: { xs: '50%', sm: '25%' } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>95%</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Success Rate</Typography>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 8, sm: 10, md: 12 } }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary'
            }}
          >
            Why Choose Our Platform
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            We provide the tools and resources you need to advance your career
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={2}
                  onClick={() => {
                    // Handle click based on feature title
                    if (feature.title === 'Smart Job Search') {
                      navigate('/jobs');
                    } else if (feature.title === 'Career Growth') {
                      navigate('/jobs');
                    } else if (feature.title === 'Networking') {
                      navigate('/jobs');
                    } else if (feature.title === 'Skill Development') {
                      navigate('/jobs');
                    }
                  }}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 70,
                        height: 70,
                        mb: 3,
                        mx: 'auto',
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: 35 } })}
                    </Avatar>

                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        mt: 1
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Categories Section */}
        <Box sx={{ mb: { xs: 8, sm: 10, md: 12 } }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary'
            }}
          >
            Explore Job Categories
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Find opportunities in your field of expertise
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} key={category.name}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onClick={() => navigate(`/jobs?category=${category.name.toLowerCase()}`)}
                >
                  <Box
                    sx={{
                      height: 8,
                      width: '100%',
                      bgcolor: category.color
                    }}
                  />

                  <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    flexGrow: 1
                  }}>
                    <Avatar
                      sx={{
                        bgcolor: `${category.color}15`,
                        color: category.color,
                        width: 60,
                        height: 60,
                        mb: 2
                      }}
                    >
                      {React.cloneElement(category.icon, { sx: { fontSize: 30 } })}
                    </Avatar>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: { xs: 8, sm: 10, md: 12 } }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary'
            }}
          >
            Success Stories
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Hear from professionals who found success through our platform
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box
                          component="span"
                          key={i}
                          sx={{
                            color: '#f59e0b',
                            fontSize: 24,
                            mr: 0.5
                          }}
                        >
                          ★
                        </Box>
                      ))}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        fontStyle: 'italic',
                        color: 'text.primary',
                        lineHeight: 1.7
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          mr: 2
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {testimonial.position}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            borderRadius: 4,
            p: { xs: 4, sm: 6, md: 8 },
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
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

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
              }}
            >
              Ready to Advance Your Career?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Join thousands of professionals who have found their ideal job through our platform
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  borderRadius: 2
                }}
              >
                Sign Up Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/jobs')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  borderRadius: 2
                }}
              >
                Browse Jobs
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Contact Section */}
        <Box sx={{ mt: { xs: 8, sm: 10, md: 12 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary'
            }}
          >
            Connect With Us
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Follow us on social media for the latest job opportunities and career advice
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3, md: 4 },
              mb: 4
            }}
          >
            <IconButton
              href="https://www.instagram.com/self_sculpture_01?igsh=OWFid2YxcnJvMzdi&utm_source=ig_contact_invite"
              target="_blank"
              sx={{
                color: 'white',
                bgcolor: '#E1306C',
                p: 2,
                '&:hover': {
                  bgcolor: '#C13584',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(225, 48, 108, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
              aria-label="Instagram"
            >
              <InstagramIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>

            <IconButton
              href="https://www.facebook.com/share/1A545igQkb/"
              target="_blank"
              sx={{
                color: 'white',
                bgcolor: '#1877F2',
                p: 2,
                '&:hover': {
                  bgcolor: '#166FE5',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(24, 119, 242, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
              aria-label="Facebook"
            >
              <FacebookIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>

            <IconButton
              href="https://www.linkedin.com/in/mathan-raj-258444353"
              target="_blank"
              sx={{
                color: 'white',
                bgcolor: '#0A66C2',
                p: 2,
                '&:hover': {
                  bgcolor: '#0077B5',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(10, 102, 194, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>

            <IconButton
              href="https://x.com/Mathanraj139793?t=g4sQO_yAaDJ50HFfC9rlqg&s=09"
              target="_blank"
              sx={{
                color: 'white',
                bgcolor: '#14171A',
                p: 2,
                '&:hover': {
                  bgcolor: '#000000',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(20, 23, 26, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
              aria-label="Twitter"
            >
              <TwitterIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} Job Board. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default Home;
