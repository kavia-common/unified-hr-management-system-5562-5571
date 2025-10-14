/**
 * App.js
 * Minimal HRMS shell replacing CRA boilerplate.
 * Provides:
 * - Sidebar with navigation placeholders
 * - Topbar with theme toggle (preserving data-theme attribute on <html>)
 * - Main content welcome panel aligned to Ocean Professional theme
 *
 * Security: No sensitive data; avoids inline event code injection.
 * Accessibility: ARIA labels for theme toggle and nav landmarks.
 */

import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Validate a theme string and coerce to acceptable value.
 * Accepts only 'light' or 'dark'. Defaults to 'light' on invalid value.
 */
function sanitizeTheme(input) {
  try {
    const value = String(input || '').toLowerCase().trim();
    return value === 'dark' ? 'dark' : 'light';
  } catch {
    // Fallback to light if any unexpected error occurs
    return 'light';
  }
}

// PUBLIC_INTERFACE
function App() {
  /** Theme state retained and applied to document root data attribute. */
  const [theme, setTheme] = useState('light');

  // Apply theme to the <html> element using data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', sanitizeTheme(theme));
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (sanitizeTheme(prevTheme) === 'light' ? 'dark' : 'light'));
  };

  // Memoize the next theme label for accessibility text and button content
  const nextThemeLabel = useMemo(
    () => (sanitizeTheme(theme) === 'light' ? 'dark' : 'light'),
    [theme]
  );

  return (
    <div className="App layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">👤</div>
          <div className="brand-text">
            <span className="brand-title">HRMS</span>
            <span className="brand-subtitle">Ocean Professional</span>
          </div>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item active"><span>Dashboard</span></li>
            <li className="nav-item"><span>Employees</span></li>
            <li className="nav-item"><span>Attendance</span></li>
            <li className="nav-item"><span>Leave</span></li>
            <li className="nav-item"><span>Payroll</span></li>
            <li className="nav-item"><span>Performance</span></li>
            <li className="nav-item"><span>Settings</span></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <small className="sidebar-hint">v0.1.0</small>
        </div>
      </aside>

      {/* Main content area */}
      <div className="main">
        {/* Topbar with theme toggle */}
        <header className="topbar">
          <h1 className="topbar-title">Unified HR Management</h1>
          <div className="topbar-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${nextThemeLabel} mode`}
              title={`Switch to ${nextThemeLabel} mode`}
              type="button"
            >
              {sanitizeTheme(theme) === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </header>

        {/* Welcome panel */}
        <main className="content" aria-labelledby="welcome-title">
          <section className="panel welcome">
            <h2 id="welcome-title" className="panel-title">Welcome to HRMS</h2>
            <p className="panel-description">
              Manage employees, attendance, leave, payroll, and performance with a modern,
              secure, and responsive dashboard. Use the sidebar to explore modules.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
