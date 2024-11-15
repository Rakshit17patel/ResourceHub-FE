import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '@clerk/clerk-react';
import { Link, Navigate } from 'react-router-dom';
import { PAGE_URLS } from '../../Router/paths';

const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null; // Optional loading state
  }

  if (isSignedIn) {
    return <Navigate to={PAGE_URLS.DASHBOARD} />;
  }

  return (
    <Container 
      sx={{
        textAlign: 'center', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      {/* Welcome Section */}
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
          Welcome to ResourceHub
        </Typography>
        <Typography variant="subtitle1" sx={{ marginTop: '1rem', color: '#666' }}>
          Simplifying Resource Management for Your Organization
        </Typography>
      </Box>

      {/* Description Section */}
      <Box sx={{ maxWidth: '600px', marginBottom: '3rem' }}>
        <Typography variant="body1" sx={{ color: '#555' }}>
          Whether you're an HR professional or a project manager, ResourceHub helps you efficiently allocate resources across various roles such as developers, business analysts, managers, QAs, and more. Let us recommend the right people based on your needs and their skills.
        </Typography>
      </Box>

      {/* Call-to-Action Buttons */}
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button 
          component={Link} 
          to={PAGE_URLS.SIGN_UP} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#333', 
            color: '#fff', 
            padding: '10px 20px', 
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#555',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
