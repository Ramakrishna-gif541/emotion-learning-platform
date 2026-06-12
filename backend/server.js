const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const courseRoutes    = require('./routes/courses');
const emotionRoutes   = require('./routes/emotion');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Allow both local dev and cloud frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,   // e.g. https://your-app.netlify.app
].filter(Boolean);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/courses',   courseRoutes);
app.use('/api/emotion',   emotionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development', time: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
