/**
 * AuthForm.jsx
 * Reusable authentication form component for login and registration.
 * SECURITY: Never log credentials; minimal controlled inputs; client-side validation with clear messages.
 */

import React, { useMemo, useState } from 'react';
import { isValidEmail, isStrongPassword, sanitizeString } from '../../utils/validators';

// PUBLIC_INTERFACE
function AuthForm({
  mode = 'login', // 'login' | 'register'
  onSubmit,
  isSubmitting = false,
  error = null,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({});

  const isLogin = mode === 'login';

  const errors = useMemo(() => {
    const e = {};
    if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (!isStrongPassword(password)) {
      e.password = 'Password must be 8+ chars with upper, lower, and number.';
    }
    if (!isLogin) {
      if (!sanitizeString(name)) e.name = 'Name is required.';
    }
    return e;
  }, [email, password, isLogin, name]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (hasErrors) return;
    // Sanitize values
    const payload = {
      name: sanitizeString(name),
      email: sanitizeString(email),
      password, // send raw; server hashes
    };
    try {
      await onSubmit(payload);
    } catch {
      // onSubmit handles error setting
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            className="input"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Jane Doe"
            required
          />
          {touched.name && errors.name && <div className="form-error">{errors.name}</div>}
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="you@example.com"
          required
        />
        {touched.email && errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder="********"
          required
        />
        {touched.password && errors.password && (
          <div className="form-error">{errors.password}</div>
        )}
        {!isLogin && (
          <div className="helper-text small">
            Use a unique password. Never reuse passwords.
          </div>
        )}
      </div>

      {error && <div className="alert" role="alert">{error}</div>}

      <div className="actions">
        <button className="btn" type="submit" disabled={isSubmitting || hasErrors}>
          {isSubmitting ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
        {!isLogin && (
          <span className="badge">By continuing, you agree to our terms.</span>
        )}
      </div>
    </form>
  );
}

export default AuthForm;
