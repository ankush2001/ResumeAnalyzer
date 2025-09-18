/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: New file - Axios instance with base URL and Authorization header via interceptor.
 * Search Strings:
 *  - const api = axios.create({
 *  - api.interceptors.request.use(
 */
import axios from 'axios';
import { getToken, clearToken } from './auth';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handling (e.g., auth errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try { clearToken(); } catch {}
      try {
        // Use HashRouter-friendly redirect
        if (typeof window !== 'undefined' && window.location) {
          window.location.hash = '#/login';
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;
