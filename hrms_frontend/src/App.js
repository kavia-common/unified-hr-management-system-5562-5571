import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Simple Home component demonstrating protected content
function Home() {
  return (
    <div className="auth-container" style={{ paddingTop: '4rem' }}>
      <div className="card auth-card">
        <h1 className="auth-title">HRMS Dashboard</h1>
        <p className="auth-subtitle">Your secure HR workspace.</p>
        <div className="row">
          <div>
            <span className="badge">Protected</span>
          </div>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <Link className="link" to="/auth/login">Sign in</Link>
            <Link className="link" to="/auth/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        type="button"
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={(
                <ProtectedRoute roles={[]}>
                  <Home />
                </ProtectedRoute>
              )}
            />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            {/* TODO: Add role-specific routes:
                <Route path="/admin" element={<ProtectedRoute roles={['Admin']}><Admin /></ProtectedRoute>} />
                <Route path="/hr" element={<ProtectedRoute roles={['HR']}><HR /></ProtectedRoute>} />
                <Route path="/employee" element={<ProtectedRoute roles={['Employee']}><Employee /></ProtectedRoute>} />
            */}
            <Route path="*" element={<div className="auth-container"><div className="card auth-card"><h2 className="auth-title">Page not found</h2></div></div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
