/**
 * apiClient.js
 * Centralized Axios instance with timeouts, base URL, and auth interceptors.
 * Includes automatic 401 handling with refresh token flow.
 * NOTE: Prefer httpOnly cookies for tokens. Fallback to Authorization header if cookies not used.
 */

import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/storage';
import { authService } from './authService';

const DEFAULT_TIMEOUT = 10000;

// Use env variable for base URL. Do not hardcode sensitive info.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true, // Enable cookie-based auth for httpOnly JWTs
});

// Flag to avoid multiple parallel refresh calls
let isRefreshing = false;
let pendingRequestsQueue = [];

// Attach Authorization header if access token is available (non-cookie strategy)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    // If backend uses cookie httpOnly, Authorization header isn't required.
    if (token) {
      // Never log token; attach safely
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add common security headers (client-side suggestion; server must enforce)
    // eslint-disable-next-line no-param-reassign
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for 401 to trigger refresh flow
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error?.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // If unauthorized and not already retried
      if (error?.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue the request until refresh completes
          return new Promise((resolve, reject) => {
            pendingRequestsQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = token ? `Bearer ${token}` : undefined;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt refresh via service
          const refreshToken = getRefreshToken();
          const refreshed = await authService.refresh(refreshToken);
          const newAccessToken = refreshed?.accessToken || null;

          // Store tokens if provided (expiry handled inside refresh)
          if (newAccessToken) {
            setTokens({
              accessToken: newAccessToken,
              refreshToken: refreshed?.refreshToken || getRefreshToken(),
              expiresAt: refreshed?.expiresAt || null,
            }, true);
          }

          // Drain queue
          pendingRequestsQueue.forEach((p) => p.resolve(newAccessToken));
          pendingRequestsQueue = [];

          // Retry original request
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshErr) {
          // On refresh failure, clear tokens and reject queued requests
          clearTokens();
          pendingRequestsQueue.forEach((p) => p.reject(refreshErr));
          pendingRequestsQueue = [];
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      // Other errors
      return Promise.reject(error);
    } catch (interceptorErr) {
      return Promise.reject(interceptorErr);
    }
  },
);

export default apiClient;
