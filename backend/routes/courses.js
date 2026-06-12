const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/courses  — list all courses
router.get('/', auth, async (req, res) => {
  const [courses] = await db.execute('SELECT * FROM courses');
  res.json(courses);
});

// GET /api/courses/:id/content?emotion=confused
router.get('/:id/content', auth, async (req, res) => {
  const { id } = req.params;
  const { emotion } = req.query;

  // Adaptive logic: prioritise content matching the detected emotion
  let query = 'SELECT * FROM content_items WHERE course_id = ?';
  const params = [id];

  if (emotion) {
    query += ' ORDER BY CASE WHEN target_emotion = ? THEN 0 WHEN target_emotion = "any" THEN 1 ELSE 2 END';
    params.push(emotion);
  }

  const [items] = await db.execute(query, params);
  res.json(items);
});

// POST /api/courses/:id/session  — start a learning session
router.post('/:id/session', auth, async (req, res) => {
  const { id } = req.params;
  const [result] = await db.execute(
    'INSERT INTO learning_sessions (user_id, course_id) VALUES (?, ?)',
    [req.user.id, id]
  );
  res.json({ sessionId: result.insertId });
});

// PATCH /api/courses/session/:sessionId  — end session
router.patch('/session/:sessionId', auth, async (req, res) => {
  const { sessionId } = req.params;
  const { emotionSummary } = req.body;
  await db.execute(
    'UPDATE learning_sessions SET ended_at = NOW(), emotion_summary = ? WHERE id = ?',
    [JSON.stringify(emotionSummary), sessionId]
  );
  res.json({ message: 'Session saved' });
});

module.exports = router;
