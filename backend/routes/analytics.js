const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/analytics/summary  — emotion breakdown for logged-in user
router.get('/summary', auth, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT emotion, COUNT(*) as count
     FROM emotion_logs WHERE user_id = ?
     GROUP BY emotion ORDER BY count DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/analytics/sessions  — session history
router.get('/sessions', auth, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT ls.*, c.title as course_title
     FROM learning_sessions ls
     JOIN courses c ON ls.course_id = c.id
     WHERE ls.user_id = ?
     ORDER BY ls.started_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/analytics/admin  — admin: all users emotion stats
router.get('/admin', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const [rows] = await db.execute(
    `SELECT u.name, el.emotion, COUNT(*) as count
     FROM emotion_logs el JOIN users u ON el.user_id = u.id
     GROUP BY u.id, el.emotion`
  );
  res.json(rows);
});

module.exports = router;
