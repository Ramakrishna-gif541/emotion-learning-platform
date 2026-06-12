import axios from 'axios';

// Uses cloud backend URL in production, localhost in development
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
