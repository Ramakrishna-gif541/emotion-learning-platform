import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EMOTION_EMOJI = { happy:'😄', focus:'🎯', bored:'😴', confused:'😕', frustrated:'😤', neutral:'😐' };
const EMOTION_COLOR = { happy:'#27ae60', focus:'#5b4cff', bored:'#f39c12', confused:'#e74c3c', frustrated:'#e67e22', neutral:'#95a5a6' };

export default function Dashboard() {
  const [courses, setCourses]   = useState([]);
  const [emotion, setEmotion]   = useState('neutral');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/courses').then(r => setCourses(r.data));
    // Poll recent emotion every 10 seconds
    const poll = setInterval(() => {
      API.get('/emotion/history').then(r => {
        if (r.data.length) setEmotion(r.data[0].emotion);
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(poll);
  }, []);

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4ff', fontFamily:'Inter,sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background:'#fff', padding:'14px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
        <span style={{ fontSize:20, fontWeight:700, color:'#5b4cff' }}>🧠 EmotionLearn</span>
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <span style={{ fontSize:14, color:'#333' }}>Hi, <b>{user.name}</b></span>
          <span style={{ background: EMOTION_COLOR[emotion] || '#95a5a6', color:'#fff', padding:'4px 12px', borderRadius:20, fontSize:13 }}>
            {EMOTION_EMOJI[emotion]} {emotion}
          </span>
          <button onClick={() => navigate('/analytics')} style={{ background:'#f0f4ff', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13 }}>📊 Analytics</button>
          <button onClick={logout} style={{ background:'#fff0f0', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13, color:'#c0392b' }}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding:'40px 32px 24px', maxWidth:1100, margin:'0 auto' }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:'#1a1a2e', margin:0 }}>Your Learning Dashboard</h1>
        <p style={{ color:'#666', marginTop:8 }}>Content adapts in real-time based on your emotions detected by your webcam.</p>
      </div>

      {/* Courses */}
      <div style={{ padding:'0 32px 48px', maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
        {courses.map(c => (
          <div key={c.id} style={{ background:'#fff', borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', cursor:'pointer', transition:'transform .15s' }}
            onClick={() => navigate(`/learn/${c.id}`)}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:36, marginBottom:12 }}>📚</div>
            <div style={{ fontSize:18, fontWeight:600, color:'#1a1a2e', marginBottom:6 }}>{c.title}</div>
            <div style={{ fontSize:13, color:'#888', marginBottom:16 }}>{c.description}</div>
            <span style={{ background:'#f0f4ff', color:'#5b4cff', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:500 }}>{c.difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
