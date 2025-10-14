/**
 * authService.js
 * Authentication service providing login, register, forgot password, reset, refresh, and user profile (/me).
 * SECURITY: Avoid logging sensitive data. Handle tokens carefully.
 * TODO: Confirm backend response shapes and cookie strategy.
 */

import apiClient from './apiClient';
import { setTokens, clearTokens } from '../utils/storage';

// Helper to parse JWT without verifying signature (client-side role extraction)
function decodeToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export const authService = {
  /** Login user with credentials. Expecting backend to set httpOnly cookies or return tokens. */
  async login({ email, password }) {
    try {
      // Never log email/password
      const res = await apiClient.post('/api/auth/login', { email, password });

      // Expected responses:
      // 1) httpOnly cookie set; response returns minimal user data
      // 2) or JSON with { accessToken, refreshToken, expiresAt, user }
      const data = res?.data || {};
      const accessToken = data.accessToken || null;
      const refreshToken = data.refreshToken || null;
      const expiresAt = data.expiresAt || null;

      if (accessToken || refreshToken || expiresAt) {
        setTokens({ accessToken, refreshToken, expiresAt }, true);
      }

      let user = data.user || null;
      if (!user && accessToken) {
        // If only token returned, try decode for roles and basic info
        const payload = decodeToken(accessToken);
        user = payload ? { id: payload.sub, email: payload.email, roles: payload.roles || [] } : null;
      }

      // If backend uses cookies exclusively, we may need to fetch /me
      if (!user) {
        try {
          const meRes = await apiClient.get('/api/auth/me');
          user = meRes?.data || null;
        } catch {
          // ignore; user may be null until /me endpoint is available
        }
      }

      return { user };
    } catch (error) {
      // Map technical error to user-friendly message
      const message = error?.response?.data?.message || 'Unable to sign in. Please check your credentials.';
      throw new Error(message);
    }
  },

  // PUBLIC_INTERFACE
  async register({ name, email, password }) {
    try {
      const res = await apiClient.post('/api/auth/register', { name, email, password });
      return res?.data || { message: 'Registration successful. Please verify your email if required.' };
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  },

  // PUBLIC_INTERFACE
  async forgotPassword({ email }) {
    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email });
      return res?.data || { message: 'If your email exists, a reset link has been sent.' };
    } catch (error) {
      const message = error?.response?.data?.message || 'Request failed. Please try again later.';
      throw new Error(message);
    }
  },

  // PUBLIC_INTERFACE
  async resetPassword({ token, password }) {
    try {
      const res = await apiClient.post('/api/auth/reset-password', { token, password });
      return res?.data || { message: 'Password reset successful.' };
    } catch (error) {
      const message = error?.response?.data?.message || 'Reset failed. The link may be invalid or expired.';
      throw new Error(message);
    }
  },

  // PUBLIC_INTERFACE
  async refresh(refreshToken) {
    try {
      // If httpOnly cookie strategy, backend should read refresh cookie
      const res = await apiClient.post('/api/auth/refresh', { refreshToken });
      const data = res?.data || {};
      const accessToken = data.accessToken || null;
      const newRefreshToken = data.refreshToken || refreshToken || null;
      const expiresAt = data.expiresAt || null;

      if (accessToken || newRefreshToken || expiresAt) {
        setTokens({ accessToken, refreshToken: newRefreshToken, expiresAt }, true);
      }

      return { accessToken, refreshToken: newRefreshToken, expiresAt };
    } catch (error) {
      clearTokens();
      const message = error?.response?.data?.message || 'Session expired. Please sign in again.';
      throw new Error(message);
    }
  },

  // PUBLIC_INTERFACE
  async me() {
    try {
      const res = await apiClient.get('/api/auth/me');
      return res?.data || null;
    } catch {
      return null;
    }
  },

  // PUBLIC_INTERFACE
  logout() {
    // Client-side logout: clear tokens. Optionally call backend /logout if available.
    clearTokens();
  },
};
