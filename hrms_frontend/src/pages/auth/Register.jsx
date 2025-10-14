/**
 * Register.jsx
 * Registration page integrating AuthForm and AuthService.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { authService } from '../../services/authService';

// PUBLIC_INTERFACE
function Register() {
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    setSubmitting(true);
    setInfo(null);
    setError(null);
    try {
      await authService.register({ name, email, password });
      setInfo('Registration successful. You can now sign in.');
      // Redirect to login after a short delay
      setTimeout(() => navigate('/auth/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join HRMS to manage your workforce</p>
        <AuthForm mode="register" onSubmit={handleRegister} isSubmitting={submitting} error={error} />
        {info && <div className="alert" role="status" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>{info}</div>}
        <div style={{ marginTop: '1rem' }}>
          <span className="small">Already have an account? </span>
          <Link className="link small" to="/auth/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
