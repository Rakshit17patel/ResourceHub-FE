// src/App.jsx
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import {Header }from './Components/Header';
import {Footer }from './Components/Footer';
import {AppRouter }from './Router';

const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <BrowserRouter>
        <Header />
        <AppRouter />
        <Footer/>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
