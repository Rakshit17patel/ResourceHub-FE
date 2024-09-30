import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box } from '@mui/material';  
import { PAGE_URLS } from '../../Router/paths';

const SignInPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  
        backgroundColor: '#f5f5f5'
      }}
    >
      <SignIn
        path={PAGE_URLS.SIGN_IN}
        routing="path"
        signUpUrl={PAGE_URLS.SIGN_UP}
        afterSignInUrl={PAGE_URLS.DASHBOARD}
      />
    </Box>
  );
};

export default SignInPage;
