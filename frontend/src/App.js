import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadResume from './pages/UploadResume';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/" element={<div className="p-6 text-center">Welcome to Resume Analyzer</div>} />
        </Routes>
      </Router>
  );
}

export default App;
