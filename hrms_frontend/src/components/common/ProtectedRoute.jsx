/**
 * ProtectedRoute.jsx
 * Route guard component for protecting routes based on authentication and roles.
 * Usage: <ProtectedRoute roles={['Admin']}><AdminPage /></ProtectedRoute>
 */

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// PUBLIC_INTERFACE
function ProtectedRoute({ children, roles = [] }) {
  /**
   * - If not authenticated, render a message prompting to sign in.
   * - If roles specified, ensure user has at least one of the required roles.
   * - Do not expose sensitive info; keep messages generic.
   */
  const { isAuthenticated, roles: userRoles, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="card auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="card auth-card">
          <h2 className="auth-title">Authentication required</h2>
          <p className="helper-text">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (roles.length > 0) {
    const hasRole = userRoles?.some((r) => roles.includes(r));
    if (!hasRole) {
      return (
        <div className="auth-container">
          <div className="card auth-card">
            <h2 className="auth-title">Access denied</h2>
            <p className="helper-text">You do not have permission to view this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
}

export default ProtectedRoute;
