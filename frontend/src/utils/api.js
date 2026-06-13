import axios from 'axios';

// Cloud backend URL
const API = axios.create({
  baseURL: "https://emotion-learning-platform.onrender.com/api",
});

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;