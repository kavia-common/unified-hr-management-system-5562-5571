/**
 * AuthContext.jsx
 * React Context for authentication state, roles, and actions.
 * Provides: user, roles, isAuthenticated, login, logout, refresh, loading, error.
 * SECURITY: No sensitive data logged; tokens managed in storage helper.
 */

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { getAccessToken } from '../utils/storage';

export const AuthContext = createContext({
  user: null,
  roles: [],
  isAuthenticated: false,
  loading: true,
  error: null,
  // methods:
  login: async () => {},
  logout: () => {},
  refresh: async () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and handlers using React Context. */
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await authService.me();
      if (profile) {
        setUser(profile);
        setRoles(profile.roles || []);
      } else {
        setUser(null);
        setRoles([]);
      }
    } catch {
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // On mount, if token or cookie present, try load /me to restore session
    const token = getAccessToken();
    if (token) {
      loadProfile();
    } else {
      // We may still be authenticated via httpOnly cookie; attempt /me regardless
      loadProfile();
    }
  }, [loadProfile]);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const result = await authService.login(credentials);
      const me = result?.user || (await authService.me());
      if (me) {
        setUser(me);
        setRoles(me.roles || []);
      }
      return { success: true };
    } catch (err) {
      setUser(null);
      setRoles([]);
      setError(err.message || 'Login failed.');
      return { success: false, message: err.message || 'Login failed.' };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setRoles([]);
  }, []);

  const refresh = useCallback(async () => {
    try {
      await authService.refresh();
      await loadProfile();
    } catch (err) {
      // If refresh fails, ensure logout state
      logout();
      setError(err.message || 'Session expired.');
    }
  }, [loadProfile, logout]);

  const contextValue = useMemo(() => ({
    user,
    roles,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    refresh,
  }), [user, roles, loading, error, login, logout, refresh]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
