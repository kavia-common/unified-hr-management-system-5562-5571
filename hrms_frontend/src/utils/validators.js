/**
 * validators.js
 * Utility functions for validating user input fields.
 * Security: sanitize and validate inputs to prevent basic client-side issues.
 */

// PUBLIC_INTERFACE
export function isValidEmail(email) {
  /** Validate email with a robust but not overly-permissive regex. */
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
}

// PUBLIC_INTERFACE
export function isStrongPassword(password) {
  /** 
   * Enforce basic strong password client-side policy:
   * - At least 8 chars, one uppercase, one lowercase, one number
   * NOTE: Final enforcement happens server-side; client aids UX only.
   */
  if (typeof password !== 'string') return false;
  const pwd = password.trim();
  const longEnough = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  return longEnough && hasUpper && hasLower && hasNumber;
}

// PUBLIC_INTERFACE
export function sanitizeString(input) {
  /** Basic sanitization to trim and remove control chars. */
  if (typeof input !== 'string') return '';
  return input.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}
