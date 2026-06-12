const express = require('express');
const axios   = require('axios');
const db      = require('../config/db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// POST /api/emotion/detect
// Body: { imageBase64: "data:image/jpeg;base64,...", courseId: 1 }
router.post('/detect', auth, async (req, res) => {
  const { imageBase64, courseId } = req.body;

  try {
    // Forward image to Python ML API
    const mlRes = await axios.post(`${process.env.ML_API_URL}/predict`, {
      image: imageBase64,
    });

    const { emotion, confidence } = mlRes.data;

    // Log to DB
    await db.execute(
      'INSERT INTO emotion_logs (user_id, course_id, emotion, confidence) VALUES (?, ?, ?, ?)',
      [req.user.id, courseId || null, emotion, confidence]
    );

    res.json({ emotion, confidence });
  } catch (err) {
    console.error('ML API error:', err.message);
    res.status(500).json({ error: 'Emotion detection failed', emotion: 'neutral' });
  }
});

// GET /api/emotion/history
router.get('/history', auth, async (req, res) => {
  const [logs] = await db.execute(
    'SELECT * FROM emotion_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 100',
    [req.user.id]
  );
  res.json(logs);
});

module.exports = router;
