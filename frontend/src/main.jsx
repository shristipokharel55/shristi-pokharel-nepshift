import { GoogleOAuthProvider } from '@react-oauth/google'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppWithProviders = () => {
  if (clientId && clientId.trim() !== '') {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <Toaster position="top-right" />
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    );
  }

  // If no Google client ID, skip Google OAuth Provider
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <App />
    </AuthProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)
