import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, clearToken } from '../services/auth';
import UploadResume from './UploadResume';

export default function Profile() {
  const navigate = useNavigate();
  const user = getUserInfo();

  const onLogout = () => {
    clearToken();
    navigate('/login');
  };

  const labelStyle = { color: '#9ca3af', fontSize: 14, marginRight: 8 };
  const valueStyle = { color: '#e5e7eb', fontSize: 16, fontWeight: 600, wordBreak: 'break-word' };

  return React.createElement(
    'div',
    {
      style: {
        minHeight: '100vh',
        background: '#0f172a',
        color: '#fff',
        padding: '16px',
      },
    },
    React.createElement(
      'div',
      { style: { maxWidth: 960, margin: '0 auto' } },
      React.createElement(
        'div',
        {
          style: {
            background: '#111827',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: 20,
          },
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            },
          },
          React.createElement(
            'h1',
            { style: { fontSize: 24, fontWeight: 700, margin: 0 } },
            'User Profile'
          ),
          React.createElement(
            'button',
            {
              onClick: onLogout,
              style: {
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
              },
            },
            'Logout'
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'grid', gridTemplateColumns: '1fr', rowGap: 8 } },
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
            React.createElement('span', { style: labelStyle }, 'Username:'),
            React.createElement(
              'span',
              { style: valueStyle },
              user && user.username ? user.username : 'N/A'
            )
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
            React.createElement('span', { style: labelStyle }, 'Email:'),
            React.createElement(
              'span',
              { style: valueStyle },
              user && user.email ? user.email : 'N/A'
            )
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
            React.createElement('span', { style: labelStyle }, 'Roles/Scope:'),
            React.createElement(
              'span',
              { style: valueStyle },
              Array.isArray(user && user.roles)
                ? user.roles.join(', ')
                : user && user.roles
                ? user.roles
                : 'N/A'
            )
          )
        )
      ),
      React.createElement(
        'div',
        {
          style: {
            background: '#111827',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          },
        },
        React.createElement(
          'h2',
          { style: { marginTop: 0, marginBottom: 12 } },
          'Upload Resume'
        ),
        React.createElement(UploadResume, { embedded: true })
      )
    )
  );
}
