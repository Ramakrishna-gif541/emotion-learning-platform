import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import API from '../utils/api';
import Navbar from '../components/Navbar';

const COLORS = { happy:'#27ae60', focus:'#5b4cff', bored:'#f39c12', confused:'#e74c3c', frustrated:'#e67e22', neutral:'#95a5a6' };

export default function Admin() {
  const [data, setData]   = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/analytics/admin')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || 'Access denied'));
  }, []);

  // Group by user
  const users = [...new Set(data.map(d => d.name))];

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4ff', fontFamily:'Inter,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <h1 style={{ fontSize:26, fontWeight:700, color:'#1a1a2e', marginBottom:4 }}>🛠 Admin Panel</h1>
        <p style={{ color:'#888', marginBottom:32, fontSize:14 }}>Overview of all student emotion data</p>

        {error && (
          <div style={{ background:'#fff0f0', color:'#c0392b', padding:'14px 20px', borderRadius:12, marginBottom:24 }}>
            {error} — You need admin privileges to view this page.
          </div>
        )}

        {users.map(userName => {
          const userData = data.filter(d => d.name === userName);
          return (
            <div key={userName} style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:600, color:'#1a1a2e', marginBottom:16 }}>👤 {userName}</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="emotion" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {userData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[entry.emotion] || '#5b4cff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}

        {users.length === 0 && !error && (
          <div style={{ textAlign:'center', color:'#bbb', padding:60 }}>No student data available yet.</div>
        )}

        <button onClick={() => navigate('/dashboard')}
          style={{ marginTop:8, background:'#fff', border:'1.5px solid #ddd', padding:'10px 24px', borderRadius:10, fontSize:13, cursor:'pointer', color:'#555' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
