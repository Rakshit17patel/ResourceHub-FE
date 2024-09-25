import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button,  } from '@mui/material';
import { OrganizationSwitcher, useAuth } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { PAGE_URLS } from '../../Router/paths';

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* App Name or Logo */}
          <Typography variant="h6" component={Link} to={PAGE_URLS.HOME} sx={{ textDecoration: 'none', color: 'inherit' }}>
            ResourceHub
          </Typography>

          {/* Organization Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isSignedIn && (
              <>
                
                  
                    {/* Organization Switcher - Show current organization and allow switching */}
                    <OrganizationSwitcher 
                      appearance={{
                        elements: {
                          organizationSwitcherButton: {
                            backgroundColor: '#000',
                            color: '#fff',
                          },
                        },
                      }}
                    />


                
                  
              
              </>
            )}
          </Box>

          {/* Sign In/Out Controls */}
          <Box>
            {isSignedIn ? (
              <UserButton afterSignOutUrl={PAGE_URLS.HOME} />
            ) : (
              <Button component={Link} to={PAGE_URLS.SIGN_IN} color="inherit">
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

     
    </>
  );
};

export default Header;
