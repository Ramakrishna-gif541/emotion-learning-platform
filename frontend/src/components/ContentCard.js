import React, { useState } from 'react';

const TYPE_ICON = { video:'🎬', text:'📄', quiz:'✏️', animation:'🎨' };

export default function ContentCard({ item, isRecommended }) {
  const [quizAnswer, setQuizAnswer] = useState('');
  const [submitted,  setSubmitted]  = useState(false);

  return (
    <div style={{
      background:'#fff', borderRadius:16, padding:24,
      boxShadow: isRecommended
        ? '0 0 0 2px #5b4cff, 0 4px 20px rgba(91,76,255,0.15)'
        : '0 2px 12px rgba(0,0,0,0.08)',
      position:'relative', marginBottom:16
    }}>
      {isRecommended && (
        <span style={{
          position:'absolute', top:-12, left:20,
          background:'#5b4cff', color:'#fff',
          padding:'3px 12px', borderRadius:20, fontSize:11, fontWeight:700
        }}>
          ⚡ Recommended for your mood
        </span>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <span style={{ fontSize:26 }}>{TYPE_ICON[item.type] || '📌'}</span>
        <div>
          <div style={{ fontSize:16, fontWeight:600, color:'#1a1a2e' }}>{item.title}</div>
          <div style={{ fontSize:12, color:'#aaa', textTransform:'capitalize' }}>{item.type}</div>
        </div>
      </div>

      {/* VIDEO */}
      {item.type === 'video' && item.url && (
        <video controls style={{ width:'100%', borderRadius:10, background:'#000' }}>
          <source src={item.url} type="video/mp4" />
          Your browser does not support video.
        </video>
      )}

      {/* TEXT */}
      {item.type === 'text' && item.body && (
        <div style={{ fontSize:14, lineHeight:1.7, color:'#444', background:'#f8f9ff', borderRadius:10, padding:16 }}>
          {item.body}
        </div>
      )}

      {/* QUIZ */}
      {item.type === 'quiz' && (
        <div style={{ background:'#f8f9ff', borderRadius:10, padding:16 }}>
          <div style={{ fontSize:14, fontWeight:500, marginBottom:10, color:'#333' }}>
            📝 {item.body || 'Answer the following question to test your understanding.'}
          </div>
          {!submitted ? (
            <>
              <textarea
                value={quizAnswer}
                onChange={e => setQuizAnswer(e.target.value)}
                placeholder="Type your answer here…"
                style={{ width:'100%', padding:10, borderRadius:8, border:'1.5px solid #ddd', fontSize:13, resize:'vertical', minHeight:80, boxSizing:'border-box' }}
              />
              <button
                onClick={() => setSubmitted(true)}
                style={{ marginTop:10, background:'#5b4cff', color:'#fff', border:'none', padding:'8px 20px', borderRadius:8, cursor:'pointer', fontWeight:600 }}>
                Submit
              </button>
            </>
          ) : (
            <div style={{ color:'#27ae60', fontWeight:600, fontSize:14 }}>
              ✅ Answer submitted! Great job.
            </div>
          )}
        </div>
      )}

      {/* ANIMATION */}
      {item.type === 'animation' && item.url && (
        <iframe src={item.url} title={item.title}
          style={{ width:'100%', height:300, border:'none', borderRadius:10 }} />
      )}
    </div>
  );
}
