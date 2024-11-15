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
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#f5f5f5', padding: '0 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo and App Name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon sx={{ color: '#333' }} /> {/* Darker Menu Icon */}
            </IconButton>
            <Typography 
              variant="h6" 
              component={Link} 
              to={PAGE_URLS.HOME} 
              sx={{ 
                textDecoration: 'none', 
                color: '#333', 
                fontWeight: 'bold',
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
                      backgroundColor: '#555',
                      color: '#fff',
                    },
                  },
                }}
              />
            )}
          </Box>

          {/* Sign In/Out Controls */}
          <Box>
            {isSignedIn ? (
              <UserButton afterSignOutUrl={PAGE_URLS.HOME} />
            ) : (
              <>
                <Button 
                  component={Link} 
                  to={PAGE_URLS.SIGN_IN} 
                  sx={{
                    color: '#fff', 
                    backgroundColor: '#333', // Dark color for Sign In (close to black)
                    borderRadius: '20px',
                    padding: '5px 15px',
                    marginRight: '10px', // Adds spacing between buttons
                    '&:hover': {
                      backgroundColor: '#1f1f1f', // Slightly darker on hover
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  component={Link} 
                  to={PAGE_URLS.SIGN_UP} 
                  sx={{
                    color: '#fff', 
                    backgroundColor: '#333', // Dark color for Sign Up (close to black)
                    borderRadius: '20px',
                    padding: '5px 15px',
                    '&:hover': {
                      backgroundColor: '#1f1f1f', // Slightly darker on hover
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
    </>
  );
};

export default Header;
