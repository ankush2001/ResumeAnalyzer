/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: Modified to use shared axios instance with Authorization header and added Logout control in UI.
 * Updates: Added 'embedded' prop to hide top header and banner when used inside Profile page.
 * Search Strings:
 *  - import api from '../services/api';
 *  - const res = await api.post('/api/resume/upload'
 *  - embedded header control
 */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { clearToken, isAuthenticated } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import './UploadResume.css';
import ReactMarkdown from 'react-markdown';

export default function UploadResume({ embedded = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    positionTitle: '',
    jobDescription: ''
  });

  const [resume, setResume] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
const [loading, setLoading] = useState(false); // loading state

  // Auto-fill name & email when embedded inside Profile and user is authenticated
  useEffect(() => {
    const fillUser = async () => {
      if (!embedded) return;
      try {
        const res = await api.get('/api/auth/me');
        const { username, email } = res.data || {};
        setFormData((prev) => ({
          ...prev,
          name: username || prev.name,
          email: email || prev.email,
        }));
      } catch (err) {
        // silent fail – user can still type manually
      }
    };
    fillUser();
  }, [embedded]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'resume') {
      setResume(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('file', resume);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('positionTitle', formData.positionTitle);
    formDataToSend.append('jobDescription', formData.jobDescription);

    try {
      const res = await api.post('/api/resume/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAiResponse(res.data);
    } catch (error) {
      console.error(error);
      setAiResponse({ error: '❌ Failed to get response from server.' });
    } finally {
      setLoading(false); // Done loading
    }
  };

  return (
    <React.Fragment>
      {!embedded && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 16px',
            background: '#0b1220',
            color: '#9ca3af',
          }}
        >
          {isAuthenticated() ? (
            <button
              onClick={() => {
                clearToken();
                navigate('/login');
              }}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          ) : null}
        </div>
      )}

      {!embedded && (
        <div className="banner-warning">
          ⚠️ Some features are currently under testing or unavailable. Server may take time to
          respond if it's waking up.
        </div>
      )}

      <div className="main-container">
        <div className="form-container">
          <h1>Job Application</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="positionTitle"
              placeholder="Enter Position Title"
              required
              value={formData.positionTitle}
              onChange={handleChange}
            />
            <textarea
              name="jobDescription"
              rows="6"
              placeholder="Paste Job Description..."
              required
              value={formData.jobDescription}
              onChange={handleChange}
            />
            <label className="upload-btn">
              Upload Resume
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={loading || !resume}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        <div className="response-container">
          <h2>AI Resume Feedback</h2>
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <span>Analyzing resume, please wait...</span>
            </div>
          ) : aiResponse ? (
            aiResponse.error ? (
              <p>{aiResponse.error}</p>
            ) : (
              <div className="ai-feedback">
                <p>
                  <strong>ATS Score:</strong>{' '}
                  {typeof aiResponse.atsScore === 'number'
                    ? aiResponse.atsScore.toFixed(2)
                    : (typeof aiResponse.atsScore === 'string' ? aiResponse.atsScore : 'N/A')}
                  %
                </p>
                <ReactMarkdown>{aiResponse.feedback?.detailedFeedback}</ReactMarkdown>
              </div>
            )
          ) : (
            <p>Submit the form to get feedback.</p>
          )}
        </div>

      </div>
    </React.Fragment>
  );
}
