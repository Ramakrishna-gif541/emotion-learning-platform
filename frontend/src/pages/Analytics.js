import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import API from '../utils/api';
import Navbar from '../components/Navbar';

const COLORS = {
  happy:'#27ae60', focus:'#5b4cff', bored:'#f39c12',
  confused:'#e74c3c', frustrated:'#e67e22', neutral:'#95a5a6'
};

export default function Analytics() {
  const [summary,  setSummary]  = useState([]);
  const [sessions, setSessions] = useState([]);
  const [history,  setHistory]  = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/analytics/summary').then(r => setSummary(r.data)).catch(() => {});
    API.get('/analytics/sessions').then(r => setSessions(r.data)).catch(() => {});
    API.get('/emotion/history').then(r => setHistory(r.data.slice(0, 20).reverse())).catch(() => {});
  }, []);

  // Build timeline data for line chart
  const timelineData = history.map((log, i) => ({
    name: `#${i+1}`,
    emotion: log.emotion,
    value: { happy:5, focus:4, neutral:3, bored:2, confused:1, frustrated:1 }[log.emotion] || 3,
    confidence: Math.round(log.confidence * 100)
  }));

  const totalDetections = summary.reduce((a, b) => a + Number(b.count), 0);

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4ff', fontFamily:'Inter,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <h1 style={{ fontSize:26, fontWeight:700, color:'#1a1a2e', marginBottom:4 }}>📊 Your Analytics</h1>
        <p style={{ color:'#888', marginBottom:32, fontSize:14 }}>Insights from your emotion-based learning sessions</p>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:32 }}>
          {[
            { label:'Total Detections',  value: totalDetections, icon:'📡' },
            { label:'Sessions',          value: sessions.length, icon:'📚' },
            { label:'Top Emotion',       value: summary[0]?.emotion || '—', icon:'🏆' },
            { label:'Emotions Tracked',  value: summary.length,  icon:'🎭' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:'20px 24px', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize:28 }}>{s.icon}</div>
              <div style={{ fontSize:24, fontWeight:700, color:'#1a1a2e', marginTop:8 }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#aaa', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>

          {/* Pie chart */}
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:16, color:'#1a1a2e' }}>Emotion Distribution</div>
            {summary.length === 0
              ? <div style={{ textAlign:'center', color:'#bbb', padding:40 }}>No data yet</div>
              : <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={summary} dataKey="count" nameKey="emotion" cx="50%" cy="50%" outerRadius={90} label={({emotion}) => emotion}>
                      {summary.map((entry, i) => (
                        <Cell key={i} fill={COLORS[entry.emotion] || '#ccc'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>

          {/* Bar chart */}
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:16, color:'#1a1a2e' }}>Emotion Counts</div>
            {summary.length === 0
              ? <div style={{ textAlign:'center', color:'#bbb', padding:40 }}>No data yet</div>
              : <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={summary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="emotion" tick={{ fontSize:12 }} />
                    <YAxis tick={{ fontSize:12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6,6,0,0]}>
                      {summary.map((entry, i) => (
                        <Cell key={i} fill={COLORS[entry.emotion] || '#5b4cff'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>
        </div>

        {/* Timeline line chart */}
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', marginBottom:24 }}>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:16, color:'#1a1a2e' }}>Emotion Timeline (last 20 detections)</div>
          {timelineData.length === 0
            ? <div style={{ textAlign:'center', color:'#bbb', padding:40 }}>Start a session to see your timeline</div>
            : <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize:11 }} />
                  <YAxis domain={[0,6]} tick={{ fontSize:11 }} tickFormatter={v => ['','Frustrated','Confused','Bored','Neutral','Focus','Happy'][v] || v} />
                  <Tooltip formatter={(v, n) => [timelineData.find(d=>d.value===v)?.emotion || v, 'Emotion']} />
                  <Line type="monotone" dataKey="value" stroke="#5b4cff" strokeWidth={2} dot={{ fill:'#5b4cff', r:4 }} />
                </LineChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Session history table */}
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:16, color:'#1a1a2e' }}>Session History</div>
          {sessions.length === 0
            ? <div style={{ color:'#bbb', fontSize:14 }}>No sessions yet. Start learning!</div>
            : <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#f8f9ff' }}>
                    {['Course','Started','Ended','Duration'].map(h => (
                      <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:'#888', fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => {
                    const start = new Date(s.started_at);
                    const end   = s.ended_at ? new Date(s.ended_at) : null;
                    const mins  = end ? Math.round((end - start) / 60000) : '—';
                    return (
                      <tr key={s.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                        <td style={{ padding:'10px 14px', fontWeight:500 }}>{s.course_title}</td>
                        <td style={{ padding:'10px 14px', color:'#888' }}>{start.toLocaleString()}</td>
                        <td style={{ padding:'10px 14px', color:'#888' }}>{end ? end.toLocaleString() : 'Ongoing'}</td>
                        <td style={{ padding:'10px 14px', color:'#5b4cff', fontWeight:600 }}>{mins !== '—' ? `${mins} min` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>

        <button onClick={() => navigate('/dashboard')}
          style={{ marginTop:24, background:'#fff', border:'1.5px solid #ddd', padding:'10px 24px',
            borderRadius:10, fontSize:13, cursor:'pointer', color:'#555', fontWeight:500 }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
