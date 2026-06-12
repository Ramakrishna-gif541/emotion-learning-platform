# ✅ Step-by-Step Setup Guide (VS Code)

## Prerequisites — Install these first
- Node.js v18+         → https://nodejs.org
- Python 3.10+         → https://python.org
- MySQL 8+             → https://dev.mysql.com/downloads/
- VS Code              → https://code.visualstudio.com
- Git                  → https://git-scm.com

---

## Step 1 — Open project in VS Code
```
File → Open Folder → select "internship project"
```
Open the integrated terminal: Ctrl + ` (backtick)

---

## Step 2 — Setup Database
```bash
mysql -u root -p
```
```sql
source database/schema.sql
exit
```

---

## Step 3 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
```
DB_PASSWORD=your_mysql_password
JWT_SECRET=any_random_string_32chars
```
```bash
npm run dev
```
✅ Backend running at http://localhost:5000

---

## Step 4 — Setup ML API
Open a NEW terminal tab (+ icon):
```bash
cd ml-api
pip install -r requirements.txt
python app.py
```
✅ ML API running at http://localhost:8000
(First run downloads the FER-2013 model — takes 2-3 minutes)

---

## Step 5 — Setup Frontend
Open a NEW terminal tab:
```bash
cd frontend
npm install
npm start
```
✅ React app opens at http://localhost:3000

---

## Step 6 — Test the App
1. Open http://localhost:3000
2. Click Register → create an account
3. Login → you see the Dashboard with courses
4. Click any course → Learn page opens
5. Click "Start Camera" → allow camera permission
6. The system detects your emotion every 5 seconds
7. Content reorders based on your emotion!
8. Visit /analytics to see your emotion charts

---

## Folder Structure
```
internship project/
├── .vscode/
│   ├── launch.json        ← Debug config
│   └── extensions.json    ← Recommended extensions
├── frontend/              ← React app (port 3000)
│   └── src/
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── Learn.js       ← Main learning page
│       │   ├── Analytics.js   ← Charts & stats
│       │   └── Admin.js       ← Admin panel
│       ├── components/
│       │   ├── WebcamCapture.js   ← Live emotion detection
│       │   ├── ContentCard.js     ← Adaptive content display
│       │   ├── EmotionBadge.js    ← Emotion indicator
│       │   └── Navbar.js
│       └── utils/api.js
├── backend/               ← Node.js API (port 5000)
│   ├── routes/
│   │   ├── auth.js        ← Register / Login
│   │   ├── courses.js     ← Courses + adaptive content
│   │   ├── emotion.js     ← Emotion detection + logs
│   │   └── analytics.js   ← Charts data
│   ├── middleware/auth.js
│   ├── config/db.js
│   └── server.js
├── ml-api/                ← Python Flask (port 8000)
│   ├── app.py             ← Emotion prediction endpoint
│   └── requirements.txt
├── database/
│   └── schema.sql         ← MySQL tables + sample data
├── api-test.http          ← VS Code REST Client tests
└── README.md
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot connect to MySQL` | Check DB_PASSWORD in .env |
| `Camera permission denied` | Allow camera in browser settings |
| `ML API not responding` | Make sure `python app.py` is running |
| `Module not found` | Run `npm install` in the right folder |
| `Port 3000 in use` | Kill process: `npx kill-port 3000` |
| `DeepFace download slow` | Wait — downloads model on first run only |
