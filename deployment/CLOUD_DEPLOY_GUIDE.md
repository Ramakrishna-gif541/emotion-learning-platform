# ☁️ Cloud Deployment Guide
# Smart Emotion-Based Learning Platform

## Architecture After Deployment

```
Students (Browser)
       ↓
  Netlify CDN          ← React Frontend (FREE)
  netlify.app
       ↓
  Railway.app          ← Node.js Backend API (FREE tier)
  railway.app
    ↙       ↘
PlanetScale   Render.com
(MySQL DB)    (Flask ML API)
  FREE          FREE tier
```

---

## STEP 1 — Push Code to GitHub

1. Create a GitHub account at https://github.com
2. Create a new repository called `internship-project`
3. Open VS Code terminal and run:

```bash
git init
git add .
git commit -m "Initial commit - Smart Emotion Learning Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/internship-project.git
git push -u origin main
```

---

## STEP 2 — Deploy Database (PlanetScale — FREE)

1. Go to https://planetscale.com → Sign up free
2. Click **"Create database"** → name it `emotion-learning`
3. Choose region closest to India (e.g. **AWS ap-south-1 Mumbai**)
4. Click **"Connect"** → copy the connection string
5. Go to **"Console"** tab → paste and run `database/schema.sql`
6. Save these values (you'll need them later):
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`

---

## STEP 3 — Deploy ML API (Render — FREE)

1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo → select `internship-project`
4. Fill in:
   - **Name**: `emotion-ml-api`
   - **Root Directory**: `ml-api`
   - **Runtime**: `Docker`
   - **Plan**: Free
5. Add environment variables:
   - `BACKEND_URL` = (you'll fill this after Step 4)
6. Click **"Create Web Service"**
7. Wait ~5 minutes for build (downloads DeepFace model)
8. Copy your URL: `https://emotion-ml-api.onrender.com`

---

## STEP 4 — Deploy Backend (Railway — FREE)

1. Go to https://railway.app → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `internship-project`
4. Click **"Add service"** → configure:
   - **Root Directory**: `backend`
5. Go to **Variables** tab → add all these:

```
DB_HOST        = (from PlanetScale Step 2)
DB_USER        = (from PlanetScale Step 2)
DB_PASSWORD    = (from PlanetScale Step 2)
DB_NAME        = emotion_learning
JWT_SECRET     = mySuper$ecretKey2024RandomString
ML_API_URL     = https://emotion-ml-api.onrender.com
FRONTEND_URL   = (fill after Step 5)
NODE_ENV       = production
```

6. Railway auto-deploys → copy your URL:
   `https://internship-project-backend.railway.app`

7. Go back to Render → update `BACKEND_URL` with this Railway URL

---

## STEP 5 — Deploy Frontend (Netlify — FREE)

1. Go to https://netlify.com → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub → select `internship-project`
4. Fill in build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Click **"Show advanced"** → add environment variable:
   - `REACT_APP_API_URL` = `https://internship-project-backend.railway.app/api`
6. Click **"Deploy site"**
7. Your live URL: `https://random-name.netlify.app`
8. Optional: change to custom name in **Site settings → Domain**

---

## STEP 6 — Update CORS on Railway

Go back to Railway → Variables → update:
```
FRONTEND_URL = https://your-site-name.netlify.app
```

Railway auto-redeploys in ~30 seconds.

---

## STEP 7 — Setup CI/CD (GitHub Actions — auto deploy)

In your GitHub repo → **Settings → Secrets → Actions** → add:

| Secret | Value |
|--------|-------|
| `NETLIFY_AUTH_TOKEN` | From Netlify → User Settings → Personal Access Tokens |
| `NETLIFY_SITE_ID` | From Netlify → Site Settings → General → Site ID |
| `RAILWAY_TOKEN` | From Railway → Account Settings → Tokens |
| `RENDER_DEPLOY_HOOK_URL` | From Render → your service → Settings → Deploy Hook |
| `REACT_APP_API_URL` | `https://your-backend.railway.app/api` |

Now every time you push to GitHub → all 3 services auto-deploy! ✅

---

## STEP 8 — Test Your Live App

1. Open `https://your-site.netlify.app`
2. Register an account
3. Login → Dashboard shows courses
4. Click a course → webcam emotion detection runs live
5. Check Analytics page → charts with your emotion data

---

## Final URLs (fill these in after deployment)

| Service | URL |
|---------|-----|
| 🌐 Frontend | `https://____________.netlify.app` |
| ⚙️ Backend API | `https://____________.railway.app/api/health` |
| 🧠 ML API | `https://____________.onrender.com/health` |
| 🗄️ Database | PlanetScale dashboard |

---

## 💡 Mention in Your Project Report

> "The platform is deployed using a modern cloud architecture:
> the React frontend is hosted on **Netlify's global CDN**,
> the Node.js backend runs on **Railway** (PaaS),
> the Python emotion detection ML API runs on **Render** using Docker containers,
> and the MySQL database is managed by **PlanetScale** with automatic scaling.
> CI/CD is implemented using **GitHub Actions**, enabling automatic deployment
> on every code push. This demonstrates real-world use of
> Infrastructure as a Service (IaaS), Platform as a Service (PaaS),
> and containerisation principles of Cloud Computing."
