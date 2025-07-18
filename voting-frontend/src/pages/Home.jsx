import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';
import emblem from '../assets/candidates/emblem.jpg';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
  const user = localStorage.getItem('voteyatra_user');
  const role = localStorage.getItem('voteyatra_role');

  setLoggedInUser(user);
  setIsAdmin(role === 'admin' && !!user);  // admin role is valid only if user exists
}, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={emblem} alt="Indian Emblem" className="emblem" />
        <h1 className="home-title">🗳️ VoteYatra</h1>

        <div className="header-buttons">
          {loggedInUser ? (
            <>
              <span className="welcome-user">Welcome, {loggedInUser}</span>
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('voteyatra_user');
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

      <p className="voting-info">
         <h1>Making Voting Simple, Secure, and Accessible</h1>
Voting is the cornerstone of every thriving democracy. It is not just a right, but a responsibility that shapes the future of our nation. <strong>VoteYatra</strong> is built to simplify and secure this important process, ensuring that every eligible citizen can participate with confidence and ease. Whether you are casting your vote for the first time or have been a regular voter, our platform is designed to assist you at every stage — from slot booking and candidate awareness to casting your final vote. We believe that an informed voter is an empowered voter, and with the right guidance, every voice can truly make a difference. Through a seamless and user-friendly experience, VoteYatra brings transparency, accessibility, and reliability to the forefront of the democratic process. This is more than a tool — it’s a movement to encourage participation and strengthen our democracy. Your vote. Your voice. Your power. Welcome to your VoteYatra.


      </p>

      <div className="features">
        {isAdmin && (
  <div className="feature-box">
    <h2>🔐 Admin’s Portal (Only for Admins)</h2>
    <p>Manage users, votes, and summaries securely.</p>
    <Link to="/admin">Go to Admin Portal →</Link>
  </div>
)}


        <div className="feature-box">
          <h2>📢 Announcements</h2>
          <p>Stay up to date with the latest election news and updates.</p>
          <Link to="/announcements">Go to Announcements →</Link>
        </div>

        <div className="feature-box">
          <h2>👤 Candidate List</h2>
          <p>Explore the list of candidates contesting the upcoming election.</p>
          <Link to="/candidates">View Candidates →</Link>
        </div>

        <div className="feature-box">
          <h2>📘 How to Vote</h2>
          <p>Understand the step-by-step guide to book a slot and cast your vote.</p>
          <Link to="/tutorial">View Voting Tutorial →</Link>
        </div>

        <div className="feature-box">
          <h2>📅 Book Slot</h2>
          <p>Reserve your time slot for voting to avoid long queues.</p>
          <Link to="/book-slot">Book Your Slot →</Link>
        </div>

        <div className="feature-box">
          <h2>🗳️ Cast Your Vote</h2>
          <p>Cast your vote securely and make your voice count.</p>
          <Link to="/cast-vote">Vote Now →</Link>
        </div>
      </div>

      <footer className="admin-contact">
        <p>For queries, contact admin:</p>
        <p>📞 <strong>8431765360</strong></p>
        <p>📧 <strong>immadi.pree1214@gmail.com</strong></p>
      </footer>
    </div>
  );
}

export default Home;
