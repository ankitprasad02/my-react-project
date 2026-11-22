import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { ClinicProvider } from './context/ClinicContext.jsx';
import { AuthRoleProvider } from './context/AuthRoleContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClinicProvider>
        <AuthRoleProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
              },
              success: {
                iconTheme: {
                  primary: '#0d9488',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#e11d48',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AuthRoleProvider>
      </ClinicProvider>
    </BrowserRouter>
  </React.StrictMode>
);
