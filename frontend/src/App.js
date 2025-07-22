import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadResume from './pages/UploadResume';

const HomePage = () => (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Resume Analyzer</h1>
        <p className="text-slate-400 mb-8">Upload your resume to get started.</p>
        <Link
            to="/upload-resume"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
        >
            Go to Upload Page
        </Link>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/upload-resume" element={<UploadResume />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
