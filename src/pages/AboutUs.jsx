import { Box, Container, Typography, Paper, Grid, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

function AboutUs() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h1" gutterBottom align="center">
                About JobBoard
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                JobBoard is dedicated to connecting talented professionals with outstanding career opportunities. 
                We strive to make the job search and recruitment process more efficient, transparent, and 
                accessible for everyone.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                What We Do
              </Typography>
              <Typography variant="body1" paragraph>
                We provide a comprehensive platform where employers can post job opportunities and job seekers 
                can explore various positions across different industries. Our platform features advanced search 
                capabilities, easy application processes, and tools for both employers and candidates to make 
                informed decisions.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Our Values
              </Typography>
              <Typography variant="body1" paragraph>
                • Transparency: We believe in clear, honest communication between employers and candidates.
                <br />
                • Innovation: We continuously improve our platform to better serve our users.
                <br />
                • Inclusivity: We promote equal opportunities and diverse workplace environments.
                <br />
                • Quality: We maintain high standards in job listings and candidate profiles.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body1" paragraph>
                Have questions or suggestions? We'd love to hear from you. Reach out to our support team 
                for assistance.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <IconButton
                  href="https://www.instagram.com/self_sculpture_01?igsh=OWFid2YxcnJvMzdi&utm_source=ig_contact_invite"
                  target="_blank"
                  sx={{ color: '#E1306C', '&:hover': { color: '#C13584' } }}
                >
                  <InstagramIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <IconButton
                  href="https://www.facebook.com/share/1A545igQkb/"
                  target="_blank"
                  sx={{ color: '#1877F2', '&:hover': { color: '#166FE5' } }}
                >
                  <FacebookIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <IconButton
                  href="https://www.linkedin.com/in/mathan-raj-258444353"
                  target="_blank"
                  sx={{ color: '#0A66C2', '&:hover': { color: '#004182' } }}
                >
                  <LinkedInIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <IconButton
                  href="https://x.com/Mathanraj139793?t=g4sQO_yAaDJ50HFfC9rlqg&s=09"
                  target="_blank"
                  sx={{ color: '#14171A', '&:hover': { color: '#000000' } }}
                >
                  <TwitterIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default AboutUs;