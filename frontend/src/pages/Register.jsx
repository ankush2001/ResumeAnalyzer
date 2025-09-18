/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: Convert to standard React JSX (use React, not Oracle JET).
 * Notes:
 *  - Posts to /api/auth/register and navigates to /login on success.
 */
import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      const txt = typeof res.data === 'string' ? res.data : 'Registration successful';
      setMsg(txt);

      if (txt.toLowerCase().includes('success')) {
        setTimeout(() => navigate('/login'), 800);
      }
    } catch (err) {
      let message = 'Registration failed';
      if (err && err.response && err.response.data) {
        message = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || message);
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
          maxWidth: 480,
          background: '#111827',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>Create account</h1>
        <p style={{ color: '#9ca3af', marginBottom: 16 }}>
          Register to start analyzing your resumes with AI.
        </p>

        {msg ? (
          <div
            role="status"
            style={{
              background: '#052e16',
              border: '1px solid #166534',
              color: '#bbf7d0',
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {msg}
          </div>
        ) : null}

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
            placeholder="Pick a username"
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
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
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
            placeholder="Create a strong password"
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
            Confirm password
          </label>
          <input
            type="password"
            name="confirm"
            required
            value={form.confirm}
            onChange={onChange}
            placeholder="Re-enter password"
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
              background: loading ? '#16a34a80' : '#16a34a',
              color: '#fff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: 12, fontSize: 14, color: '#9ca3af' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
