import React from 'react';
import { Box, Typography, Container, Grid, Paper, IconButton, Button } from '@mui/material';
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


function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Business', icon: <BusinessIcon sx={{ fontSize: 40 }} /> },
    { name: 'Technology', icon: <ComputerIcon sx={{ fontSize: 40 }} /> },
    { name: 'Healthcare', icon: <LocalHospitalIcon sx={{ fontSize: 40 }} /> },
    { name: 'Education', icon: <SchoolIcon sx={{ fontSize: 40 }} /> },
    { name: 'Retail', icon: <StorefrontIcon sx={{ fontSize: 40 }} /> },
    { name: 'Finance', icon: <AccountBalanceIcon sx={{ fontSize: 40 }} /> },
    { name: 'Manufacturing', icon: <FactoryIcon sx={{ fontSize: 40 }} /> },
    { name: 'Other', icon: <MoreHorizIcon sx={{ fontSize: 40 }} /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 5, sm: 8, md: 10 }, mb: { xs: 5, sm: 8, md: 10 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Welcome to the Job Board
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: { xs: 3, sm: 4, md: 6 },
            px: { xs: 2, sm: 0 }
          }}
        >
          Explore job opportunities and find your dream job
        </Typography>

        {/* Featured Jobs Section */}
        <Box sx={{ mb: { xs: 4, sm: 6, md: 8 }, mt: { xs: 4, sm: 6, md: 8 } }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: { xs: 2, sm: 3, md: 4 }
            }}
          >
            Featured Job Opportunities
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/jobs')}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
            }}
          >
            Browse All Jobs
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'text.secondary',
              px: { xs: 3, sm: 0 }
            }}
          >
            Discover the latest job opportunities across various industries
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: { xs: 8, sm: 12, md: 16 } }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: { xs: 4, sm: 6, md: 8 },
            fontWeight: 600
          }}
        >
          Popular Job Categories
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {categories.map((category) => (
            <Grid item xs={6} sm={6} md={3} key={category.name}>
              <Paper
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 4, md: 6 },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transform: {
                      xs: 'none',
                      sm: 'translateY(-5px)'
                    }
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => navigate(`/jobs?category=${category.name}`)}
              >
                <Box sx={{ color: 'primary.main', mb: { xs: 1, sm: 2, md: 4 } }}>
                  {React.cloneElement(category.icon, {
                    sx: { fontSize: { xs: 30, sm: 35, md: 40 } }
                  })}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                  }}
                >
                  {category.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          bgcolor: 'grey.50',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          p: { xs: 3, sm: 6, md: 8 },
          mt: { xs: 4, sm: 6, md: 8 }
        }}
      >
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              We are dedicated to connecting talented professionals with outstanding career opportunities.
              Our platform makes the job search and recruitment process more efficient and accessible for everyone.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Whether you're looking for your next career move or seeking top talent for your organization,
              we're here to help you succeed.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: { xs: 2, sm: 3 },
                p: { xs: 3, sm: 4, md: 6 },
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                height: '100%'
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  mb: { xs: 2, sm: 3, md: 4 },
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Why Choose Us
              </Typography>
              <Box component="ul" sx={{ pl: 2, '& li': { mb: 1.5 } }}>
                <Typography component="li" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Wide range of job opportunities across industries
                </Typography>
                <Typography component="li" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Easy and efficient application process
                </Typography>
                <Typography component="li" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Professional network building
                </Typography>
                <Typography component="li" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Regular updates on latest job postings
                </Typography>
                <Typography component="li" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Dedicated support for both job seekers and employers
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          bgcolor: 'grey.50',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          p: { xs: 3, sm: 6, md: 8 },
          mt: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: { xs: 3, sm: 4, md: 6 },
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: { xs: 3, sm: 4, md: 6 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Connect with us on social media to stay updated with the latest job opportunities
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3, md: 4 },
            flexWrap: 'wrap'
          }}
        >
          <IconButton
            href="https://www.instagram.com/self_sculpture_01?igsh=OWFid2YxcnJvMzdi&utm_source=ig_contact_invite"
            target="_blank"
            sx={{
              color: '#E1306C',
              '&:hover': { color: '#C13584', transform: 'scale(1.1)' },
              transition: 'all 0.2s ease'
            }}
            aria-label="Instagram"
          >
            <InstagramIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
          <IconButton
            href="https://www.facebook.com/share/1A545igQkb/"
            target="_blank"
            sx={{
              color: '#1877F2',
              '&:hover': { color: '#166FE5', transform: 'scale(1.1)' },
              transition: 'all 0.2s ease'
            }}
            aria-label="Facebook"
          >
            <FacebookIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/mathan-raj-258444353"
            target="_blank"
            sx={{
              color: '#0A66C2',
              '&:hover': { color: '#0077B5', transform: 'scale(1.1)' },
              transition: 'all 0.2s ease'
            }}
            aria-label="LinkedIn"
          >
            <LinkedInIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
          <IconButton
            href="https://x.com/Mathanraj139793?t=g4sQO_yAaDJ50HFfC9rlqg&s=09"
            target="_blank"
            sx={{
              color: '#14171A',
              '&:hover': { color: '#000000', transform: 'scale(1.1)' },
              transition: 'all 0.2s ease'
            }}
            aria-label="Twitter"
          >
            <TwitterIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
