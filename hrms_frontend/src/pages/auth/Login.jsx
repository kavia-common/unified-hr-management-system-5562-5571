/**
 * Login.jsx
 * Login page integrating AuthForm and AuthContext.
 */

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { AuthContext } from '../../context/AuthContext';

// PUBLIC_INTERFACE
function Login() {
  const { login, error: contextError } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true);
    setLocalError(null);
    try {
      const result = await login({ email, password });
      if (result.success) {
        // Redirect to dashboard/home after login
        navigate('/');
      } else {
        setLocalError(result.message || 'Login failed.');
      }
    } catch (err) {
      setLocalError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to HRMS</p>
        <AuthForm mode="login" onSubmit={handleLogin} isSubmitting={submitting} error={localError || contextError} />
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <Link className="link small" to="/auth/register">Create account</Link>
          <Link className="link small" to="/auth/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
