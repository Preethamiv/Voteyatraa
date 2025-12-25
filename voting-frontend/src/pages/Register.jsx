import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/send-otp', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/verify-otp', { email, otp });
      setMessage(res.data.message);
//       console.log("OTP verified, navigating with email:", email);
// navigate('/complete-registration', { state: { email } });

      // ✅ Navigate to complete-registration and pass email
      navigate('/complete-register', { state: { email } });

    } catch (err) {
      setMessage(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  return (
    <div className="register-container">
      <h2>Register for VoteYatra</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {message && <p className="status">{message}</p>}
    </div>
  );
}

export default Register;
