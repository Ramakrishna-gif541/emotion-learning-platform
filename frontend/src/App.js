import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn     from './pages/Learn';
import Analytics from './pages/Analytics';
import Admin     from './pages/Admin';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Navigate to="/dashboard" />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/learn/:id"  element={<PrivateRoute><Learn /></PrivateRoute>} />
        <Route path="/analytics"  element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/admin"      element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
