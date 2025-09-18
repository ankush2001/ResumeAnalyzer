/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: New file - Login UI; posts to /api/auth/login, stores JWT token, redirects to /upload-resume.
 * Search Strings:
 *  - export default function Login()
 *  - axios.post(`${API_BASE}/api/auth/login`
 */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { setToken, isAuthenticated } from '../services/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fromPath = location.state?.from?.pathname || '/profile';
    if (isAuthenticated()) {
      navigate(fromPath, { replace: true });
    }
  }, [navigate, location.state?.from?.pathname]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        username: form.username,
        password: form.password,
      });
      if (res?.data?.token) {
        setToken(res.data.token);
        navigate(location.state?.from?.pathname || '/profile');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      let message = 'Login failed';
      if (err?.response?.data) {
        message =
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#fff',
        padding: '16px',
      }}
    >
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#111827',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>Login</h1>
        <p style={{ color: '#9ca3af', marginBottom: 16 }}>
          Sign in to access resume analysis and more.
        </p>

        {error ? (
          <div
            role="alert"
            style={{
              background: '#7f1d1d',
              border: '1px solid #b91c1c',
              color: '#fecaca',
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#d1d5db' }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={onChange}
            placeholder="your-username"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #374151',
              background: '#0b1220',
              color: '#fff',
              marginBottom: 12,
              outline: 'none',
            }}
          />

          <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#d1d5db' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="Your secure password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #374151',
              background: '#0b1220',
              color: '#fff',
              marginBottom: 16,
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: 'none',
              background: loading ? '#2563eb80' : '#2563eb',
              color: '#fff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 12, fontSize: 14, color: '#9ca3af' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
