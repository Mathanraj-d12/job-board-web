import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
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

import { Link as RouterLink } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const categoryDefinitions = [
  { id: 1, name: 'Technology', icon: <ComputerIcon /> },
  { id: 2, name: 'Marketing', icon: <LocalOfferIcon /> },
  { id: 3, name: 'Design', icon: <DesignServicesIcon /> },
  { id: 4, name: 'Sales', icon: <PeopleIcon /> },
  { id: 5, name: 'Customer Service', icon: <GroupAddIcon /> },
  { id: 6, name: 'Finance', icon: <MonetizationOnIcon /> },
  { id: 7, name: 'Healthcare', icon: <HealthAndSafetyIcon /> },
  { id: 8, name: 'Education', icon: <SchoolIcon /> },
  { id: 9, name: 'Engineering', icon: <EngineeringIcon /> },
  { id: 10, name: 'Human Resources', icon: <BusinessCenterIcon /> }
];


function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const jobs = jobsSnapshot.docs.map(doc => doc.data());
        
        const categoryCounts = categoryDefinitions.map(category => {
          const count = jobs.filter(job => 
            job.category && job.category.toLowerCase() === category.name.toLowerCase()
          ).length;
          return { ...category, count };
        });

        setCategories(categoryCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job counts:', error);
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, []);
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Categories
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse jobs by category and find your next career opportunity
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Paper
                component={RouterLink}
                to={`/jobs?category=${category.name.toLowerCase()}`}
                className="category-card"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {React.cloneElement(category.icon, { sx: { fontSize: 32, mr: 2, color: 'primary.main' } })}
                  <Typography variant="h6">
                    {category.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {category.count} jobs available
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Categories;
