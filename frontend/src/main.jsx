import { GoogleOAuthProvider } from '@react-oauth/google'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppWithProviders = () => {
  if (clientId && clientId.trim() !== '') {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <SocketProvider>
            <Toaster position="top-right" />
            <App />
          </SocketProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    );
  }

  // If no Google client ID, skip Google OAuth Provider
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster position="top-right" />
        <App />
      </SocketProvider>
    </AuthProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)
