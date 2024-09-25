// src/App.jsx
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import {Header }from './Components/Header';
import {AppRouter }from './Router';

const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <BrowserRouter>
        <Header />
        <AppRouter />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
