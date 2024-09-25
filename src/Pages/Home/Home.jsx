// src/Pages/Home/Home.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
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
    <Container>
      <Typography variant="h4">Welcome to ResourceHub</Typography>
    
    </Container>
  );
};

export default Home;
