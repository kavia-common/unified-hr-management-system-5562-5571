/**
 * ResetPassword.jsx
 * Page to set a new password using a reset token (from URL query or state).
 */

import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { isStrongPassword } from '../../utils/validators';

// PUBLIC_INTERFACE
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    if (!isStrongPassword(password)) {
      e.password = 'Password must be 8+ chars with upper, lower, and number.';
    }
    if (confirm !== password) {
      e.confirm = 'Passwords do not match.';
    }
    if (!token) {
      e.token = 'Missing reset token. Please use the reset link from your email.';
    }
    return e;
  }, [password, confirm, token]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ password: true, confirm: true });
    if (hasErrors) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await authService.resetPassword({ token, password });
      setInfo('Your password has been reset. You can now sign in with your new password.');
    } catch (err) {
      setError(err.message || 'Reset failed. The link may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">Choose a strong password</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="********"
              required
            />
            {touched.password && errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              className="input"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              placeholder="********"
              required
            />
            {touched.confirm && errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          {errors.token && <div className="alert" role="alert">{errors.token}</div>}
          {error && <div className="alert" role="alert">{error}</div>}
          {info && (
            <div className="alert" role="status" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
              {info}
            </div>
          )}

          <div className="actions">
            <button className="btn" type="submit" disabled={hasErrors || submitting}>
              {submitting ? 'Please wait…' : 'Reset password'}
            </button>
            <Link className="link small" to="/auth/login">Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
