import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const styles = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4ff' },
  card:  { background:'#fff', borderRadius:16, padding:40, width:380, boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  title: { fontSize:26, fontWeight:700, color:'#1a1a2e', marginBottom:8 },
  sub:   { fontSize:14, color:'#666', marginBottom:28 },
  label: { display:'block', fontSize:13, fontWeight:500, color:'#333', marginBottom:6 },
  input: { width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #ddd', fontSize:14, boxSizing:'border-box', outline:'none' },
  btn:   { width:'100%', padding:12, background:'#5b4cff', color:'#fff', border:'none', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', marginTop:20 },
  err:   { background:'#fff0f0', color:'#c0392b', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 },
  link:  { textAlign:'center', fontSize:13, color:'#666', marginTop:20 }
};

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Welcome Back 👋</div>
        <div style={styles.sub}>Log in to continue learning</div>
        {error && <div style={styles.err}>{error}</div>}
        <div style={{ marginBottom:16 }}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button style={styles.btn} onClick={handleSubmit}>Login</button>
        <div style={styles.link}>
          Don't have an account? <Link to="/register" style={{ color:'#5b4cff' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
