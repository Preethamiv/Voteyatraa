import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [flash, setFlash] = useState('');

  useEffect(() => {
    const flashMsg = sessionStorage.getItem('flashMessage');
    if (flashMsg) {
      setFlash(flashMsg);
      sessionStorage.removeItem('flashMessage');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3000/auth/login', formData);
      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem('voteyatra_token', token);
        localStorage.setItem('voteyatra_user', user.username);
        localStorage.setItem('voteyatra_role', user.role);

        setMessage('Login successful!');
        navigate('/');
      } else {
        setMessage('Login failed: missing token or user info');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to VoteYatra</h2>

      {/* ✅ Flash Message on Redirect */}
      {flash && <div className="flash-message">{flash}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {message && <p className="status">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
