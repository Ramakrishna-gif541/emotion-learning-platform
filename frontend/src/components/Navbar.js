import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmotionBadge from './EmotionBadge';

export default function Navbar({ emotion = 'neutral' }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav style={{
      background:'#fff', padding:'14px 32px',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      boxShadow:'0 2px 8px rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:100
    }}>
      <span onClick={() => navigate('/dashboard')}
        style={{ fontSize:20, fontWeight:700, color:'#5b4cff', cursor:'pointer' }}>
        🧠 EmotionLearn
      </span>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        <span style={{ fontSize:14, color:'#555' }}>Hi, <b>{user.name}</b></span>
        <EmotionBadge emotion={emotion} />
        <button onClick={() => navigate('/dashboard')}
          style={{ background:'#f0f4ff', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13, color:'#5b4cff', fontWeight:500 }}>
          🏠 Home
        </button>
        <button onClick={() => navigate('/analytics')}
          style={{ background:'#f0f4ff', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13, color:'#5b4cff', fontWeight:500 }}>
          📊 Analytics
        </button>
        <button onClick={logout}
          style={{ background:'#fff0f0', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13, color:'#c0392b', fontWeight:500 }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
