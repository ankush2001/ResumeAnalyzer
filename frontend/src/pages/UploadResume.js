import React, { useState } from 'react';
import axios from 'axios';

// --- Icon Components (Defined directly in this file) ---

const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
const EnvelopeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);
const PhoneIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const BriefcaseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
);
const CloudArrowUpIcon = (props) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16" {...props}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
    </svg>
);
const DocumentIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" />
    </svg>
);
const XMarkIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- Sub-Components (Defined directly in this file) ---

const FormField = ({ name, placeholder, value, onChange, type = 'text', icon, required = false }) => (
    <div className="relative">
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-slate-900/70 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 pl-10 transition-all duration-300"
        />
    </div>
);

const FileDropzone = ({ file, onFileChange, onFileRemove }) => (
    <div>
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-900/70 hover:bg-slate-700/50 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon style={{ height: '2rem', width: '2rem' }} className="mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-400">
                    <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PDF only (MAX. 5MB)</p>
            </div>
            <input id="file-upload" type="file" name="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
        </label>

        {file && (
            <div className="flex items-center justify-between mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <DocumentIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-slate-300 font-medium truncate">{file.name}</span>
                </div>
                <button
                    type="button"
                    onClick={onFileRemove}
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        )}
    </div>
);


// --- Main UploadResume Component ---

const UploadResume = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        positionTitle: '',
        jobDescription: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleFileRemove = () => {
        setFile(null);
        if (document.getElementById('file-upload')) {
            document.getElementById('file-upload').value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please upload a resume file.');
            return;
        }

        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));
        payload.append('file', file);

        try {
            setLoading(true);
            setMessage('');
            await axios.post('/api/resume/upload', payload);
            setMessage('Resume uploaded successfully!');
            setFormData({ name: '', email: '', phone: '', positionTitle: '' , jobDescription: '' });
            handleFileRemove();
        } catch (error) {
            setMessage('Error uploading resume: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Style object for icons, equivalent to "h-4 w-4"
    const iconStyle = { height: '1rem', width: '1rem' };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-xl mx-auto p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Upload Your Profile</h2>
                    <p className="text-slate-400">Let's find the perfect fit for your skills.</p>
                </div>

                {message && (
                    <div className={`mb-6 text-center text-sm font-medium ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required icon={<UserIcon style={iconStyle} />} />
                    <FormField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required icon={<EnvelopeIcon style={iconStyle} />} />
                    <FormField name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required icon={<PhoneIcon style={iconStyle} />} />
                    <FormField name="positionTitle" placeholder="Position Applying For" value={formData.positionTitle} onChange={handleChange} required icon={<BriefcaseIcon style={iconStyle} />} />
                    <FormField name="jobDescription" placeholder="Job Description (Mandatory)" value={formData.jobDescription} onChange={handleChange} required type="textarea" />
                    <FileDropzone file={file} onFileChange={handleFileChange} onFileRemove={handleFileRemove} />

                    <button type="submit" disabled={loading} className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2">
                        {loading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        )}
                        <span>{loading ? 'Uploading...' : 'Submit Application'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadResume;
