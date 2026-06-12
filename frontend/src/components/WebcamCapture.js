import React, { useRef, useEffect, useState, useCallback } from 'react';
import API from '../utils/api';

const EMOTION_EMOJI  = { happy:'😄', focus:'🎯', bored:'😴', confused:'😕', frustrated:'😤', neutral:'😐' };
const EMOTION_COLOR  = { happy:'#27ae60', focus:'#5b4cff', bored:'#f39c12', confused:'#e74c3c', frustrated:'#e67e22', neutral:'#95a5a6' };
const CAPTURE_EVERY  = 5000; // ms between captures

export default function WebcamCapture({ courseId, onEmotionDetected }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const intervalRef = useRef(null);

  const [emotion,     setEmotion]     = useState('neutral');
  const [confidence,  setConfidence]  = useState(0);
  const [camActive,   setCamActive]   = useState(false);
  const [error,       setError]       = useState('');
  const [detecting,   setDetecting]   = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current       = stream;
      videoRef.current.srcObject = stream;
      setCamActive(true);
      setError('');
    } catch {
      setError('Camera permission denied. Please allow camera access.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    clearInterval(intervalRef.current);
    setCamActive(false);
  }, []);

  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setDetecting(true);
    const canvas = canvasRef.current;
    canvas.width  = videoRef.current.videoWidth  || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.7);

    try {
      const res = await API.post('/emotion/detect', { imageBase64, courseId });
      const { emotion: em, confidence: conf } = res.data;
      setEmotion(em);
      setConfidence(conf);
      onEmotionDetected && onEmotionDetected(em);
    } catch {
      // silently fail — keep last known emotion
    } finally {
      setDetecting(false);
    }
  }, [courseId, onEmotionDetected]);

  useEffect(() => {
    if (camActive) {
      captureAndDetect();
      intervalRef.current = setInterval(captureAndDetect, CAPTURE_EVERY);
    }
    return () => clearInterval(intervalRef.current);
  }, [camActive, captureAndDetect]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div style={{ background:'#1a1a2e', borderRadius:16, padding:20, color:'#fff', width:280 }}>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#aaa' }}>📷 Emotion Detector</div>

      {/* Video feed */}
      <div style={{ position:'relative', borderRadius:12, overflow:'hidden', background:'#000', aspectRatio:'4/3' }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{ width:'100%', height:'100%', objectFit:'cover', display: camActive ? 'block' : 'none' }} />
        {!camActive && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:180, color:'#555', fontSize:13 }}>
            Camera off
          </div>
        )}
        {detecting && (
          <div style={{ position:'absolute', top:8, right:8, background:'rgba(91,76,255,0.9)', borderRadius:20, padding:'2px 10px', fontSize:11 }}>
            detecting…
          </div>
        )}
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display:'none' }} />

      {/* Current emotion */}
      {camActive && (
        <div style={{ marginTop:16, background:'rgba(255,255,255,0.07)', borderRadius:12, padding:'12px 16px' }}>
          <div style={{ fontSize:11, color:'#888', marginBottom:4 }}>CURRENT EMOTION</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:28 }}>{EMOTION_EMOJI[emotion] || '😐'}</span>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color: EMOTION_COLOR[emotion] || '#fff', textTransform:'capitalize' }}>
                {emotion}
              </div>
              <div style={{ fontSize:12, color:'#888' }}>
                {Math.round(confidence * 100)}% confidence
              </div>
            </div>
          </div>
          {/* Confidence bar */}
          <div style={{ marginTop:10, background:'rgba(255,255,255,0.1)', borderRadius:4, height:6 }}>
            <div style={{ width:`${confidence*100}%`, background: EMOTION_COLOR[emotion] || '#5b4cff', borderRadius:4, height:6, transition:'width .5s' }} />
          </div>
        </div>
      )}

      {error && <div style={{ marginTop:12, color:'#e74c3c', fontSize:12 }}>{error}</div>}

      {/* Controls */}
      <button
        onClick={camActive ? stopCamera : startCamera}
        style={{ marginTop:14, width:'100%', padding:'10px 0', background: camActive ? '#e74c3c' : '#5b4cff',
          color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>
        {camActive ? '⏹ Stop Camera' : '▶ Start Camera'}
      </button>
    </div>
  );
}
