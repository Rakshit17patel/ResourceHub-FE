import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { Link, Navigate } from 'react-router-dom';
import { PAGE_URLS } from '../../Router/paths';

const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  // Guest user credentials
  const guestEmail = 'guest_user+clerk_test@example.com';
  const guestCode = '424242';

  // State to handle copy feedback
  const [copyStatus, setCopyStatus] = useState({
    email: false,
    code: false,
  });

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyStatus(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [field]: false }));
        }, 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

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
      <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
        <Button 
          component={Link} 
          onClick={() => clerk.openSignIn()} 
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

        {/* Guest User Section */}
        <Box 
          sx={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem', 
            maxWidth: '400px', 
            textAlign: 'left', 
            backgroundColor: '#f9f9f9' 
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '1rem', color: '#333' }}>
            Explore as a Guest
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Use the credentials below to explore the app without creating an account:
          </Typography>
          <Box sx={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#333', flexGrow: 1 }}>
              <strong>Email:</strong> {guestEmail}
            </Typography>
            <Tooltip title={copyStatus.email ? "Copied!" : "Copy Email"}>
              <IconButton 
                onClick={() => handleCopy(guestEmail, 'email')}
                aria-label="copy email"
                size="small"
              >
                {copyStatus.email ? <CheckIcon color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#333', flexGrow: 1 }}>
              <strong>Code:</strong> {guestCode}
            </Typography>
            <Tooltip title={copyStatus.code ? "Copied!" : "Copy Code"}>
              <IconButton 
                onClick={() => handleCopy(guestCode, 'code')}
                aria-label="copy code"
                size="small"
              >
                {copyStatus.code ? <CheckIcon color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ marginTop: '1rem', color: '#555' }}>
            After copying, paste these credentials into the login form.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
