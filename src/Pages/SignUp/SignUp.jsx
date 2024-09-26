import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { PAGE_URLS } from '../../Router/paths';  // Import your route paths

const SignUpPage = () => {
  return (
    <SignUp
      path={PAGE_URLS.SIGN_UP}           // Sign-up URL
      routing="path"                     // Ensure the routing method is correct
      signInUrl={PAGE_URLS.SIGN_IN}      // Link to the Sign In page
      redirectUrl={PAGE_URLS.DASHBOARD}  // Redirect after successful sign-up
   />
  );
};

export default SignUpPage;
