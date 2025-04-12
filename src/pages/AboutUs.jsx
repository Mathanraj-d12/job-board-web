import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import DiversityIcon from '@mui/icons-material/Diversity3';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Link as RouterLink } from 'react-router-dom';

function AboutUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Team members data
  const teamMembers = [
    {
      name: "Mathan Raj",
      role: "Founder & CEO",
      bio: "Passionate about connecting talent with opportunity and building innovative solutions for the job market.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      linkedin: "https://www.linkedin.com/in/mathan-raj-258444353"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Product",
      bio: "Experienced product leader focused on creating intuitive and powerful tools for job seekers and employers.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      linkedin: "#"
    },
    {
      name: "David Chen",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in building scalable platforms and optimizing user experiences.",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
      linkedin: "#"
    }
  ];

  // Company stats
  const stats = [
    { label: "Job Seekers", value: "10,000+" },
    { label: "Employers", value: "500+" },
    { label: "Jobs Posted", value: "5,000+" },
    { label: "Successful Placements", value: "2,500+" }
  ];

  // Values with icons
  const values = [
    {
      title: "Transparency",
      description: "We believe in clear, honest communication between employers and candidates.",
      icon: <VerifiedIcon sx={{ fontSize: 40, color: '#2563eb' }} />
    },
    {
      title: "Innovation",
      description: "We continuously improve our platform to better serve our users with cutting-edge features.",
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#7c3aed' }} />
    },
    {
      title: "Inclusivity",
      description: "We promote equal opportunities and diverse workplace environments for all professionals.",
      icon: <DiversityIcon sx={{ fontSize: 40, color: '#10b981' }} />
    },
    {
      title: "Quality",
      description: "We maintain high standards in job listings and candidate profiles to ensure meaningful connections.",
      icon: <VerifiedIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
    }
  ];

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
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 5 },
          textAlign: 'center'
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
          <BusinessCenterIcon sx={{ fontSize: { xs: 50, md: 70 }, mb: 3 }} />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            About JobBoard
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              fontWeight: 400,
              opacity: 0.9,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Connecting talented professionals with outstanding career opportunities since 2023
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/jobs"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)'
              }
            }}
          >
            Explore Jobs
          </Button>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Fade in={true} timeout={(index + 1) * 300}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: 'primary.main',
                      mb: 1,
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Mission Section */}
      <Grid container spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Our Mission
              </Typography>
            </Box>

            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                mb: 3
              }}
            >
              JobBoard is dedicated to connecting talented professionals with outstanding career opportunities.
              We strive to make the job search and recruitment process more efficient, transparent, and
              accessible for everyone.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkOutlineIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                What We Do
              </Typography>
            </Box>

            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'text.secondary'
              }}
            >
              We provide a comprehensive platform where employers can post job opportunities and job seekers
              can explore various positions across different industries. Our platform features advanced search
              capabilities, easy application processes, and tools for both employers and candidates to make
              informed decisions.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Team collaboration"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupsIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.dark'
                  }}
                >
                  Join Our Community
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: 'text.secondary',
                  lineHeight: 1.7
                }}
              >
                Be part of a growing network of professionals and companies. Whether you're looking for your next career move or searching for top talent, JobBoard is here to help you succeed.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/signup"
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
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Values Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              mb: 1
            }}
          >
            Our Core Values
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            The principles that guide everything we do at JobBoard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={true} timeout={(index + 1) * 300}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              mb: 1
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            The passionate people behind JobBoard
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in={true} timeout={(index + 1) * 400}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6
                      }}
                    >
                      {member.bio}
                    </Typography>
                    <IconButton
                      href={member.linkedin}
                      target="_blank"
                      sx={{
                        color: '#0A66C2',
                        '&:hover': {
                          color: '#004182',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          mb: 6,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
          color: 'white',
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

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 2 }}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MailOutlineIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Contact Us
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: 500
              }}
            >
              Have questions or suggestions? We'd love to hear from you. Reach out to our support team for assistance.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/jobs"
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
                Browse Jobs
              </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Follow Us
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                href="https://www.instagram.com/self_sculpture_01?igsh=OWFid2YxcnJvMzdi&utm_source=ig_contact_invite"
                target="_blank"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <InstagramIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                href="https://www.facebook.com/share/1A545igQkb/"
                target="_blank"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <FacebookIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com/in/mathan-raj-258444353"
                target="_blank"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <LinkedInIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                href="https://x.com/Mathanraj139793?t=g4sQO_yAaDJ50HFfC9rlqg&s=09"
                target="_blank"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <TwitterIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.985594191228!2d77.59791287381694!3d12.971598914933867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1682458665044!5m2!1sen!2sus"
                sx={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                  minHeight: 300
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AboutUs;