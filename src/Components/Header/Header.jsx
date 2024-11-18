import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { OrganizationSwitcher, useAuth, useClerk } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { PAGE_URLS } from '../../Router/paths';
import { CONSTANTS } from '../../Theme/Constants';

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { COLORS} = CONSTANTS;
  const clerk = useClerk();

  if (!isLoaded) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: COLORS.PrimaryBackground, padding: '0 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo and App Name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon sx={{ color: COLORS.MenuIcon }} /> 
            </IconButton>
            <Typography 
              variant="h6" 
              component={Link} 
              to={PAGE_URLS.HOME} 
              sx={{ 
                textDecoration: 'none', 
                color: COLORS.MenuIcon, 
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
                      backgroundColor: COLORS.GREY,
                      color: COLORS.WHITE,
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
                  onClick={()=>clerk.openSignIn()} 
                  sx={{
                    color: COLORS.WHITE,
                    backgroundColor: COLORS.MenuIcon,
                    borderRadius: '20px',
                    padding: '5px 15px',
                    marginRight: '10px', // Adds spacing between buttons
                    '&:hover': {
                      backgroundColor: COLORS.DARKGREY,
                    }
                  }}
                >
                  Sign In
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
