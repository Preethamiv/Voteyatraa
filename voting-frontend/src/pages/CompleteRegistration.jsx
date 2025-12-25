import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CompleteRegistration.css';

function CompleteRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedEmail = location.state?.email || '';

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    aadhaar: '',
  });

  useEffect(() => {
    if (!passedEmail) {
      alert('No email found. Please start from the Register page.');
      navigate('/register');
    } else {
      setFormData((prev) => ({ ...prev, email: passedEmail }));
    }
  }, [passedEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'aadhaar') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const aadhaar = formData.aadhaar.trim();
    const aadhaarRegex = /^\d{12}$/;

    if (!aadhaarRegex.test(aadhaar)) {
      alert('Aadhaar must be a 12-digit number (e.g., 123456789012)');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/register', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        aadhaar,
      });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <div className="complete-registration">
      <h2>Complete Your Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Candidate Name"
          value={formData.username}
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          disabled
        />
        <input
          type="text"
          name="aadhaar"
          placeholder="Enter 12-digit Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          maxLength={12}
          pattern="\d{12}"
          title="Enter a valid 12-digit Aadhaar number"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default CompleteRegistration;
