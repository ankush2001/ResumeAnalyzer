import React, { useState } from 'react';
import axios from 'axios';

const UploadResume = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        positionTitle: '',
        file: null
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file) {
            setMessage('Please upload a resume file.');
            return;
        }

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('phone', formData.phone);
        payload.append('positionTitle', formData.positionTitle);
        payload.append('file', formData.file);

        try {
            setLoading(true);
            await axios.post('/api/resume/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Resume uploaded successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                positionTitle: '',
                file: null,
            });
        } catch (error) {
            setMessage('Error uploading resume: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Resume</h2>

            {message && <div className="mb-4 text-center text-sm text-blue-600">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="positionTitle" placeholder="Position Title" value={formData.positionTitle} onChange={handleChange} required />
                <input type="file" name="file" accept="application/pdf" onChange={handleChange} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit Resume'}
                </button>
            </form>
        </div>
    );
};

export default UploadResume;
