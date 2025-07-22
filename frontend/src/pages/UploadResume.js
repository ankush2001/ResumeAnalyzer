import React, { useState } from 'react';
import axios from 'axios';
import './UploadResume.css';
import ReactMarkdown from 'react-markdown';
export default function UploadResume() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        positionTitle: '',
        jobDescription: ''
    });

    const [resume, setResume] = useState(null);
    const [aiResponse, setAiResponse] = useState(null);

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

        const formDataToSend = new FormData();
        formDataToSend.append('file', resume);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('positionTitle', formData.positionTitle);
        formDataToSend.append('jobDescription', formData.jobDescription);

        try {
            const res = await axios.post('http://localhost:8080/api/resume/upload', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAiResponse(res.data);
        } catch (error) {
            console.error(error);
            setAiResponse({ error: '❌ Failed to get response from server.' });
        }
    };

    return (
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
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="response-container">
                <h2>AI Resume Feedback</h2>
                {aiResponse ? (
                    aiResponse.error ? (
                        <p>{aiResponse.error}</p>
                    ) : (
                        <div className="ai-feedback">
                            <p><strong>ATS Score:</strong> {aiResponse.atsScore?.toFixed(2)}%</p>
                            <ReactMarkdown>{aiResponse.feedback?.detailedFeedback}</ReactMarkdown>
                        </div>
                    )
                ) : (
                    <p>Submit the form to get feedback.</p>
                )}
            </div>

        </div>
    );
}
