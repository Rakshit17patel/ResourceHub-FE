// src/Pages/SignIn/SignIn.jsx
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { PAGE_URLS } from '../../Router/paths';

const SignInPage = () => {
  return (
    <SignIn
      path={PAGE_URLS.SIGN_IN}
      routing="path"
      signUpUrl={PAGE_URLS.SIGN_UP}
      afterSignInUrl={PAGE_URLS.DASHBOARD}
      signInUrl={PAGE_URLS.SIGN_IN}
    />
  );
};

export default SignInPage;
