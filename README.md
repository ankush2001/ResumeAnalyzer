# 🧠 Resume Analyzer (by Ankush)

## 🌟 Project Title
**Resume Analyzer with AI-Based ATS Scoring**

---

## 📄 Description

A full-stack AI-powered application that evaluates resumes against job descriptions. Users can upload resumes (PDF/DOCX) and paste job descriptions. The system parses resumes, calculates an ATS (Applicant Tracking System) score using NLP models, and suggests improvements to increase job-fit alignment.

### 🔍 Key Features:
- 📌 Extracted Resume Info: Name, Email, Phone, Position Title
- 📈 ATS Score: Based on cosine similarity using sentence embeddings
- 💡 Suggestions: Smart, AI-generated guidance for improving job-fit

---

## 🚀 Key Functionalities

- ✅ Upload resume (PDF/DOCX)
- ✅ Paste job description
- ✅ AI-based resume parsing
- ✅ ATS score calculation using HuggingFace embeddings
- ✅ Tailored suggestions using cosine similarity

---

## 🧱 Tech Stack

### 🖥️ Frontend:
- React.js
- Tailwind CSS
- Axios
- Framer Motion

### 🧩 Backend:
- Java 17 + Spring Boot
- Spring AI (HuggingFace integration)
- Apache Tika (resume parsing)
- PostgreSQL

### 🤖 AI/NLP:
- HuggingFace Transformers: `sentence-transformers/all-MiniLM-L6-v2`
- Cosine Similarity (for semantic ATS scoring)

### 🐳 Containerization:
- Docker
- Docker Compose

---

## 🌐 Deployment (via Render / DockerHub)

- **Backend** runs on port `8080`
- **Frontend** runs on port `80` (via NGINX)
- Docker Images hosted on DockerHub:
    - `ankush2026/resumeanalyzer-frontend:latest`
    - `ankush2026/resumeanalyzer-backend:latest`

---

## 🔐 Environment Variables

### `.env` file (Backend):
```env
# Spring Boot
spring.application.name=resumeanalyzer

# PostgreSQL Config
DATA_SOURCE_URL=jdbc:postgresql://host:port/dbname
DATA_SOURCE_USERNAME=your_db_username
DATA_SOURCE_PASSWORD=your_db_password

# HuggingFace API
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_URL=https://api-inference.huggingface.co
spring.ai.huggingface.model-id=sentence-transformers/all-MiniLM-L6-v2

# Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_key
GEMINI_URL=https://api.gemini.google.com

# Perplexity (Optional)
PERPLEXITY_API_KEY=your_perplexity_key
PERPLEXITY_URL=https://api.perplexity.ai

# CORS Setup
FRONTEND_ORIGIN=http://localhost:3000
```

---

## 📂 Project Structure

```
ResumeAnalyzer/
├── backend/               # Spring Boot backend
│   ├── src/
│   └── Dockerfile
├── frontend/              # React frontend
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml     # Launches both frontend and backend
└── README.md              # This file
```

---

## 🛠️ Setup & Run

### Using Docker:
```bash
# From project root
docker-compose up --build
```

### Without Docker:
- Start PostgreSQL and configure `.env`
- Run backend:
```bash
cd backend
./mvnw spring-boot:run
```
- Run frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Future Improvements

- 🔍 **JD keyword highlighting** in parsed resume
- 📊 **Detailed ATS score breakdown** (by section)
- 📤 **Support for multiple resume uploads**
- 📧 **Email alerts** for matching job descriptions
- 🧠 **Interactive job suggestions** based on resume using AI
- 💼 **Job recommendation UI** with filters, cards & real-time relevance scores

---

## 👤 Author

**Ankush Choudhary**  
🚀 Passionate about AI, Java, and full-stack development  
📬 Contact: [LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/ankush2026)
