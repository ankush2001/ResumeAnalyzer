/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: New file - Token helpers for JWT persistence and auth state utilities.
 * Search Strings:
 *  - const TOKEN_KEY = 'authToken';
 *  - export const isAuthenticated = () => !!getToken();
 */
const TOKEN_KEY = 'authToken';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // no-op
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    try { localStorage.removeItem('userEmail'); } catch {}
  } catch {
    // no-op
  }
};

/**
 * Decode base64url JWT payload safely
 */
const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const json = JSON.parse(atob(padded));
    return json;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    try { clearToken(); } catch {}
    return false;
  }
  return true;
};

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;

  const json = decodeJwtPayload(token);
  const emailFromStorage = (() => {
    try { return localStorage.getItem('userEmail'); } catch { return null; }
  })();

  if (!json) {
    return { username: null, email: emailFromStorage || null, roles: null };
  }

  const username = json?.sub || json?.username || null;
  const email = emailFromStorage || json?.email || null;
  const roles = json?.roles || json?.authorities || null;
  return { username, email, roles };
};

const authService = { getToken, setToken, clearToken, isAuthenticated, getUserInfo };

export default authService;
