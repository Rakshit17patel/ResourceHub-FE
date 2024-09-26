import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { PAGE_URLS } from '../../Router/paths';  // Import your route paths

const SignInPage = () => {
  return (
    <SignIn
      path={PAGE_URLS.SIGN_IN}
      routing="path"
      signUpUrl={PAGE_URLS.SIGN_UP}  // Provide the link to the Sign Up page
      afterSignInUrl={PAGE_URLS.DASHBOARD}  // Redirect after successful sign-in
    />
  );
};

export default SignInPage;
