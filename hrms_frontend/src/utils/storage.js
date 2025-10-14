/**
 * storage.js
 * Helpers for secure token storage handling with memory and localStorage fallback.
 * Prefer httpOnly secure cookies (server-managed) for JWT; store only minimal data client-side.
 * This module stores only access tokens if cookies aren't used, and avoids logging sensitive data.
 */

const MEMORY_STORE = {
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
};

const ACCESS_TOKEN_KEY = 'hrms_access_token';
const REFRESH_TOKEN_KEY = 'hrms_refresh_token';
const EXPIRES_AT_KEY = 'hrms_expires_at';

function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function setTokens({ accessToken, refreshToken, expiresAt }, useLocalStorage = false) {
  /** Store tokens with configurable backend strategy. Avoid logging token values. */
  if (accessToken) MEMORY_STORE.accessToken = accessToken;
  if (refreshToken) MEMORY_STORE.refreshToken = refreshToken;
  if (expiresAt) MEMORY_STORE.tokenExpiresAt = expiresAt;

  if (useLocalStorage && isLocalStorageAvailable()) {
    try {
      if (accessToken) window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      if (expiresAt) window.localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
    } catch {
      // Swallow storage errors silently to avoid crashing app
    }
  }
}

// PUBLIC_INTERFACE
export function getAccessToken() {
  /** Read token from memory first; fallback to localStorage if needed. */
  if (MEMORY_STORE.accessToken) return MEMORY_STORE.accessToken;
  if (isLocalStorageAvailable()) {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

// PUBLIC_INTERFACE
export function getRefreshToken() {
  if (MEMORY_STORE.refreshToken) return MEMORY_STORE.refreshToken;
  if (isLocalStorageAvailable()) {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

// PUBLIC_INTERFACE
export function getExpiresAt() {
  if (MEMORY_STORE.tokenExpiresAt) return Number(MEMORY_STORE.tokenExpiresAt);
  if (isLocalStorageAvailable()) {
    const val = window.localStorage.getItem(EXPIRES_AT_KEY);
    return val ? Number(val) : null;
  }
  return null;
}

// PUBLIC_INTERFACE
export function clearTokens() {
  /** Remove tokens from memory and storage. */
  MEMORY_STORE.accessToken = null;
  MEMORY_STORE.refreshToken = null;
  MEMORY_STORE.tokenExpiresAt = null;

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.localStorage.removeItem(EXPIRES_AT_KEY);
    } catch {
      // Ignore
    }
  }
}
