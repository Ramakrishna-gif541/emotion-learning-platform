-- Smart Emotion-Based Learning Platform
-- MySQL Schema

CREATE DATABASE IF NOT EXISTS emotion_learning;
USE emotion_learning;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses / Modules
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content items (videos, text, quizzes)
CREATE TABLE content_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  type ENUM('video', 'text', 'quiz', 'animation') NOT NULL,
  title VARCHAR(200),
  url TEXT,
  body TEXT,
  target_emotion ENUM('focus', 'bored', 'confused', 'happy', 'any') DEFAULT 'any',
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Emotion logs
CREATE TABLE emotion_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT,
  emotion VARCHAR(50) NOT NULL,
  confidence FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sessions / learning progress
CREATE TABLE learning_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  content_id INT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  emotion_summary JSON,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Sample data
INSERT INTO courses (title, description, difficulty) VALUES
  ('Python Basics', 'Learn Python fundamentals', 'easy'),
  ('Data Structures', 'Arrays, stacks, queues, trees', 'medium'),
  ('Machine Learning', 'Intro to ML concepts', 'hard');

INSERT INTO content_items (course_id, type, title, url, target_emotion) VALUES
  (1, 'video',  'Python Intro Video', '/content/python-intro.mp4', 'any'),
  (1, 'text',   'Quick Summary', NULL, 'bored'),
  (1, 'quiz',   'Python Quiz', NULL, 'focus'),
  (2, 'video',  'Arrays Explained Simply', '/content/arrays-simple.mp4', 'confused'),
  (2, 'animation', 'Sorting Visualizer', '/content/sort.html', 'bored'),
  (3, 'video',  'ML Deep Dive', '/content/ml-deep.mp4', 'focus');
