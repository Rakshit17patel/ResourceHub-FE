import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Home } from '../Pages/Home';
import { SignInPage } from '../Pages/SignIn';
import { SignUpPage } from '../Pages/SignUp';
import { Dashboard } from '../Pages/Dashboard';
import { Teams } from '../Pages/Teams';  // Make sure Teams is imported
import { Resources } from '../Pages/Resources';  // Import the Resources component
import { Projects } from '../Pages/Projects';  // Import the Projects component
import { Analytics } from '../Pages/Analytics';  // Import the Analytics component
import { PAGE_URLS } from '../Router/paths';

const AppRouter = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path={PAGE_URLS.HOME} 
        element={isSignedIn ? <Navigate to={PAGE_URLS.DASHBOARD} /> : <Home />} 
      />
      <Route 
        path={PAGE_URLS.SIGN_IN} 
        element={isSignedIn ? <Navigate to={PAGE_URLS.DASHBOARD} /> : <SignInPage />} 
      />
      <Route 
        path={PAGE_URLS.SIGN_UP} 
        element={isSignedIn ? <Navigate to={PAGE_URLS.DASHBOARD} /> : <SignUpPage />} 
      />

      {/* Protected Routes */}
      <Route 
        path={PAGE_URLS.DASHBOARD} 
        element={isSignedIn ? <Dashboard /> : <Navigate to={PAGE_URLS.SIGN_IN} />} 
      />
      <Route 
        path={PAGE_URLS.TEAMS} 
        element={isSignedIn ? <Teams /> : <Navigate to={PAGE_URLS.SIGN_IN} />} 
      />
      <Route 
        path={PAGE_URLS.RESOURCES} 
        element={isSignedIn ? <Resources /> : <Navigate to={PAGE_URLS.SIGN_IN} />} 
      />
      <Route 
        path={PAGE_URLS.PROJECTS} 
        element={isSignedIn ? <Projects /> : <Navigate to={PAGE_URLS.SIGN_IN} />} 
      />
      <Route 
        path={PAGE_URLS.ANALYTICS} 
        element={isSignedIn ? <Analytics /> : <Navigate to={PAGE_URLS.SIGN_IN} />} 
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to={PAGE_URLS.HOME} />} />
    </Routes>
  );
};

export default AppRouter;
