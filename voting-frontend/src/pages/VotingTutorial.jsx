import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emblem from '../assets/candidates/emblem.jpg';
import './VotingTutorial.css';

function VotingTutorial() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('voteyatra_user');
    setLoggedInUser(user);
  }, []);

  return (
    <div className="tutorial-wrapper">
      {/* ✅ Consistent Full-Width Header (like Home) */}
      <header className="home-header">
  <img src={emblem} alt="Indian Emblem" className="emblem" />
  
  <Link to="/" className="no-underline">
    <h1 className="home-title">🗳️ VoteYatra</h1>
  </Link>

  <div className="header-buttons">
    {loggedInUser ? (
      <>
        <span className="welcome-user">Welcome, {loggedInUser}</span>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('voteyatra_user');
            localStorage.removeItem('voteyatra_token');
            setLoggedInUser(null);
            navigate('/');
          }}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link to="/register">
          <button className="register-header-btn">Register</button>
        </Link>
        <Link to="/login">
          <button className="login-header-btn">Log in</button>
        </Link>
      </>
    )}
  </div>
</header>

      
            <hr className="separator" />

      {/* ✅ Tutorial Content in Blocks */}
      <div className="tutorial-container">
        <h2>📘 How to Vote Using VoteYatra</h2>
        <p className="intro-text">Follow these simple steps to participate in the election process securely and smoothly:</p>

        <div className="step">
          <h3>Step 1: Register Your Email</h3>
          <p>Go to the Register page and enter your email. You’ll receive an OTP to verify your identity.</p>
        </div>

        <div className="step">
          <h3>Step 2: Complete Your Profile</h3>
          <p>Once OTP is verified, provide your full name, Aadhaar number, and create a secure password to complete your registration.</p>
        </div>

        <div className="step">
          <h3>Step 3: Log In</h3>
          <p>Use your registered email and password to log in securely into the platform.</p>
        </div>

        <div className="step">
          <h3>Step 4: Book Your Voting Slot</h3>
          <p>Navigate to the <strong>“Book Slot”</strong> section and choose an available time slot to vote.</p>
        </div>

        <div className="step">
          <h3>Step 5: Cast Your Vote</h3>
          <p>Once your slot is active, head over to the <strong>“Cast Vote”</strong> section, choose your preferred candidate, and submit your vote.</p>
        </div>

        <p className="closing-text">🛡️ Your vote is confidential and secure. Make your voice count!</p>
      </div>
    </div>
  );
}

export default VotingTutorial;
