import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const styles = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4ff' },
  card:  { background:'#fff', borderRadius:16, padding:40, width:380, boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  title: { fontSize:26, fontWeight:700, color:'#1a1a2e', marginBottom:8 },
  sub:   { fontSize:14, color:'#666', marginBottom:28 },
  label: { display:'block', fontSize:13, fontWeight:500, color:'#333', marginBottom:6 },
  input: { width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #ddd', fontSize:14, boxSizing:'border-box' },
  btn:   { width:'100%', padding:12, background:'#5b4cff', color:'#fff', border:'none', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', marginTop:20 },
  err:   { background:'#fff0f0', color:'#c0392b', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 },
  ok:    { background:'#f0fff4', color:'#27ae60', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 },
  link:  { textAlign:'center', fontSize:13, color:'#666', marginTop:20 }
};

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Create Account 🎓</div>
        <div style={styles.sub}>Start your smart learning journey</div>
        {error   && <div style={styles.err}>{error}</div>}
        {success && <div style={styles.ok}>{success}</div>}
        {['name','email','password'].map(field => (
          <div key={field} style={{ marginBottom:16 }}>
            <label style={styles.label}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
            <input style={styles.input} type={field==='password'?'password':'text'}
              value={form[field]}
              onChange={e => setForm({...form, [field]: e.target.value})} />
          </div>
        ))}
        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <div style={styles.link}>
          Already have an account? <Link to="/login" style={{ color:'#5b4cff' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
