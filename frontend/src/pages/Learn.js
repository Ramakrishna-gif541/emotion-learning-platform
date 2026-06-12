import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Navbar       from '../components/Navbar';
import WebcamCapture from '../components/WebcamCapture';
import ContentCard  from '../components/ContentCard';

const EMOTION_MSG = {
  happy:      '😄 You seem happy! Keeping the energy going with engaging content.',
  focus:      '🎯 Great focus! Serving in-depth material to match your concentration.',
  bored:      '😴 Looks like you might be bored. Switching to a more engaging format!',
  confused:   '😕 Seems like something is confusing. Loading a simpler explanation!',
  frustrated: '😤 Let\'s slow down. Switching to a calm, easy explanation.',
  neutral:    '😐 All good! Showing standard content.',
};

export default function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content,    setContent]    = useState([]);
  const [emotion,    setEmotion]    = useState('neutral');
  const [sessionId,  setSessionId]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [emotionLog, setEmotionLog] = useState({});

  // Start session
  useEffect(() => {
    API.post(`/courses/${id}/session`)
      .then(r => setSessionId(r.data.sessionId))
      .catch(() => {});
  }, [id]);

  // Load adaptive content whenever emotion changes
  useEffect(() => {
    setLoading(true);
    API.get(`/courses/${id}/content?emotion=${emotion}`)
      .then(r => { setContent(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id, emotion]);

  // Called by webcam component when a new emotion is detected
  const handleEmotionDetected = useCallback((em) => {
    setEmotion(em);
    setEmotionLog(prev => ({ ...prev, [em]: (prev[em] || 0) + 1 }));
  }, []);

  // End session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        API.patch(`/courses/session/${sessionId}`, { emotionSummary: emotionLog }).catch(() => {});
      }
    };
  }, [sessionId, emotionLog]);

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4ff', fontFamily:'Inter,sans-serif' }}>
      <Navbar emotion={emotion} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px', display:'flex', gap:28 }}>

        {/* LEFT: Webcam panel */}
        <div style={{ flexShrink:0 }}>
          <WebcamCapture courseId={Number(id)} onEmotionDetected={handleEmotionDetected} />

          {/* Emotion log */}
          <div style={{ marginTop:16, background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#aaa', marginBottom:12 }}>SESSION LOG</div>
            {Object.keys(emotionLog).length === 0
              ? <div style={{ fontSize:12, color:'#bbb' }}>No data yet. Start camera.</div>
              : Object.entries(emotionLog).map(([em, count]) => (
                <div key={em} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                  <span style={{ textTransform:'capitalize' }}>{em}</span>
                  <span style={{ fontWeight:600, color:'#5b4cff' }}>{count}x</span>
                </div>
              ))
            }
          </div>

          <button onClick={() => navigate('/dashboard')}
            style={{ marginTop:14, width:'100%', padding:'10px 0', background:'#fff', border:'1.5px solid #ddd',
              borderRadius:10, fontSize:13, cursor:'pointer', color:'#555', fontWeight:500 }}>
            ← Back to Dashboard
          </button>
        </div>

        {/* RIGHT: Adaptive content */}
        <div style={{ flex:1 }}>
          {/* Emotion alert banner */}
          <div style={{ background:'#fff', borderRadius:12, padding:'14px 20px', marginBottom:20,
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)', fontSize:14, color:'#444', borderLeft:'4px solid #5b4cff' }}>
            {EMOTION_MSG[emotion] || EMOTION_MSG.neutral}
          </div>

          {loading
            ? <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>Loading content…</div>
            : content.length === 0
              ? <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>No content available for this course yet.</div>
              : content.map((item, idx) => (
                  <ContentCard key={item.id} item={item} isRecommended={idx === 0 && emotion !== 'neutral'} />
                ))
          }
        </div>
      </div>
    </div>
  );
}
