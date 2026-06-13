const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    res.status(201).json({
      message: 'User registered',
      userId: result.insertId
    });

  } catch (err) {
    console.error('Register Error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role || 'student'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role || 'student'
      }
    });

  } catch (err) {
    console.error('Login Error:', err);

    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

module.exports = router;