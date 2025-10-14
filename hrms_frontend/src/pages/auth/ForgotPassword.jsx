/**
 * ForgotPassword.jsx
 * Page for requesting password reset link.
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { isValidEmail, sanitizeString } from '../../utils/validators';

// PUBLIC_INTERFACE
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const emailError = useMemo(() => (isValidEmail(email) ? null : 'Please enter a valid email address.'), [email]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched(true);
    if (emailError) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await authService.forgotPassword({ email: sanitizeString(email) });
      setInfo('If your email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Request failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@example.com"
              required
            />
            {touched && emailError && <div className="form-error">{emailError}</div>}
          </div>

          {error && <div className="alert" role="alert">{error}</div>}
          {info && (
            <div className="alert" role="status" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
              {info}
            </div>
          )}

          <div className="actions">
            <button className="btn" type="submit" disabled={!!emailError || submitting}>
              {submitting ? 'Please wait…' : 'Send reset link'}
            </button>
            <Link className="link small" to="/auth/login">Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
