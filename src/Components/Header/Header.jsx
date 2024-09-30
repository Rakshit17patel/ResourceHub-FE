import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { OrganizationSwitcher, useAuth } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { PAGE_URLS } from '../../Router/paths';

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f5f5f5', padding: '0 20px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {/* Placeholder Logo */}
          <img src="https://via.placeholder.com/40" alt="Logo" style={{ borderRadius: '50%', marginRight: '10px' }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to={PAGE_URLS.HOME} 
            sx={{ 
              textDecoration: 'none', 
              color: '#333', 
              fontWeight: 'bold',
              '&:hover': { 
                color: '#555'  // Hover effect on the logo
              }
            }}
          >
            ResourceHub
          </Typography>
        </Box>

        {/* Organization Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSignedIn && (
            <OrganizationSwitcher 
              appearance={{
                elements: {
                  organizationSwitcherButton: {
                    backgroundColor: '#e0e0e0',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#ccc',
                    },
                  },
                },
              }}
            />
          )}
        </Box>

        {/* Sign In/Out Controls */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isSignedIn ? (
            <UserButton afterSignOutUrl={PAGE_URLS.HOME} />
          ) : (
            <>
              {/* Sign In Button */}
              <Button 
                component={Link} 
                to={PAGE_URLS.SIGN_IN} 
                sx={{
                  color: '#fff', 
                  backgroundColor: '#1976d2', // Blue color for the button
                  borderRadius: '20px',
                  padding: '5px 15px',
                  '&:hover': {
                    backgroundColor: '#115293', // Darker blue on hover
                  }
                }}
              >
                Sign In
              </Button>

              {/* Sign Up Button */}
              <Button 
                component={Link} 
                to={PAGE_URLS.SIGN_UP} 
                sx={{
                  color: '#fff', 
                  backgroundColor: '#1976d2', // Same blue color for the button
                  borderRadius: '20px',
                  padding: '5px 15px',
                  '&:hover': {
                    backgroundColor: '#115293', // Darker blue on hover
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
