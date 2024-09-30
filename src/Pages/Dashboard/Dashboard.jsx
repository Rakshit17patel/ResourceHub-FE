import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { PAGE_URLS } from '../../Router';
import { useOrganization } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const { organization } = useOrganization();  // Fetch organization details
  const { user } = useUser();  // Fetch user details

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box >
        {organization ? (
          <>
            <Typography variant="body1">Organization Name: {organization.name}</Typography>
            <Typography variant="body1">Organization ID: {organization.id}</Typography>
          </>
        ) : (
          <Typography variant="body1">You are not part of any organization.</Typography>
        )}

        <Typography variant="body1">User ID: {user.id}</Typography>

        {/* Buttons to Navigate to Routes */}
        <Box sx={{ inTop: 4, display: 'flex', gap: 2 }}>
          <Button component={Link} to={PAGE_URLS.RESOURCES} variant="contained" color="primary">
            Resources
          </Button>
          <Button component={Link} to={PAGE_URLS.PROJECTS} variant="contained" color="primary">
            Projects
          </Button>
          <Button component={Link} to={PAGE_URLS.TEAMS} variant="contained" color="primary">
            Teams
          </Button>
          <Button component={Link} to={PAGE_URLS.ANALYTICS} variant="contained" color="primary">
            Analytics
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
