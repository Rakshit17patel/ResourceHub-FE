import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { PAGE_URLS } from '../../Router/paths';
import { Box } from '@mui/material';  


const SignUpPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#f5f5f5',
      }}
    >
    <SignUp
      path={PAGE_URLS.SIGN_UP}           // Sign-up URL
      routing="path"                     // Ensure the routing method is correct
      signInUrl={PAGE_URLS.SIGN_IN}      // Link to the Sign In page
      redirectUrl={PAGE_URLS.DASHBOARD}  // Redirect after successful sign-up
   />
   </Box>
  );
};

export default SignUpPage;
