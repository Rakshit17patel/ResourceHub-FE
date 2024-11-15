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
      path={PAGE_URLS.SIGN_UP}
      routing="path"                     
      signInUrl={PAGE_URLS.SIGN_IN}      
      redirectUrl={PAGE_URLS.DASHBOARD}  
   />
   </Box>
  );
};

export default SignUpPage;
