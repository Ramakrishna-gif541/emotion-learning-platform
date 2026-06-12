# Smart Emotion-Based Learning Platform

A full-stack adaptive learning platform using AI emotion detection.

## Project Structure
```
emotion-learning-platform/
├── frontend/         → React app (runs on port 3000)
├── backend/          → Node.js + Express API (runs on port 5000)
├── ml-api/           → Python Flask emotion detection API (runs on port 8000)
└── database/         → MySQL schema
```

## Quick Start

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env    # fill in your values
npm run dev
```

### 3. ML API
```bash
cd ml-api
pip install -r requirements.txt
python app.py
```

### 4. Frontend
```bash
cd frontend
npm install
npm start
```

## Tech Stack
- **Frontend**: React, Tailwind CSS, Axios, face-api.js
- **Backend**: Node.js, Express, JWT, MySQL2
- **ML API**: Python, Flask, DeepFace / OpenCV, FER-2013
- **Database**: MySQL
- **Deployment**: DigitalOcean / AWS EC2
