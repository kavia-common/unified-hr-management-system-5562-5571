# HRMS Frontend Authentication Module

This module implements an enterprise-ready authentication flow with pages, services, context, route protection, and secure token handling for the HRMS React application.

## Features
- Login, Registration, Forgot Password, Reset Password pages
- AuthContext with user, roles, isAuthenticated, login, logout, refresh
- Axios client with timeouts and interceptors for JWT and refresh handling
- Role-based route protection component
- Ocean Professional theme styling
- Input validation utilities and storage helpers
- Environment-configurable API base URL

## Architecture
- Services: `src/services/apiClient.js`, `src/services/authService.js`
- Context: `src/context/AuthContext.jsx`
- Components: 
  - `src/components/auth/AuthForm.jsx`
  - `src/components/common/ProtectedRoute.jsx`
- Pages:
  - `src/pages/auth/Login.jsx`
  - `src/pages/auth/Register.jsx`
  - `src/pages/auth/ForgotPassword.jsx`
  - `src/pages/auth/ResetPassword.jsx`
- Utils: `src/utils/validators.js`, `src/utils/storage.js`
- Styles: `src/styles/theme.css`

## Security Considerations
- Prefer httpOnly, Secure cookies for JWTs. The axios client is configured with `withCredentials: true`.
- Storage helpers support memory and localStorage; they should only be used when cookie strategy is not available.
- Sensitive data (passwords, tokens) are never logged.
- Inputs are sanitized and validated client-side; final validation and hashing must occur server-side.
- All requests must be over HTTPS in production.

## Backend API Endpoints (placeholders)
Update to match FastAPI backend:
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- POST `/api/auth/refresh`
- GET `/api/auth/me`

Response shapes assumed:
- `login` may set httpOnly cookies or return `{ accessToken, refreshToken, expiresAt, user }`
- `refresh` returns `{ accessToken, refreshToken?, expiresAt? }`
- `me` returns `{ id, email, roles: ['Admin'|'HR'|'Employee', ...], ... }`

## Environment Variables
- `REACT_APP_API_BASE_URL`: Base URL for backend (e.g., `https://api.example.com`)

## Usage
- Wrap the app with `AuthProvider` (already done in `src/App.js`)
- Protect routes using `<ProtectedRoute roles={['Admin']}>...</ProtectedRoute>`

## TODOs
- Confirm backend cookie vs header token strategy and adjust storage usage accordingly.
- Add `/logout` endpoint support and CSRF protection if required by backend.
- Extend role-based routes for Admin, HR, and Employee dashboards.
