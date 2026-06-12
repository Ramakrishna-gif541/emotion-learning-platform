const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const courseRoutes    = require('./routes/courses');
const emotionRoutes   = require('./routes/emotion');
const analyticsRoutes = require('./routes/analytics');

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  'https://emotion-learning-platform.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: '10mb' }));

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/analytics', analyticsRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    time: new Date()
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});