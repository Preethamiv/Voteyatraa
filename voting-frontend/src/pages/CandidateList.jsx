import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emblem from '../assets/candidates/emblem.jpg';
import './CandidateList.css';
import modiImg from '../assets/candidates/narendra_modi.jpg';
import rahulImg from '../assets/candidates/Rahul_Gandhi.jpg';
import kejriwalImg from '../assets/candidates/Arvind_Kejriwal.jpg';
import owaisiImg from '../assets/candidates/Asaduddin_Owaisi.jpg';

const candidates = [
  {
    name: 'Narendra Modi',
    party: 'Bharatiya Janta Party',
    image: modiImg,
    description:
      'Narendra Modi is the current Prime Minister of India, known for his strong leadership, emphasis on development, and focus on national security, infrastructure growth, and international diplomacy.',
    manifesto: 'https://www.bjp.org/bjp-manifesto-2024',
  },
  {
    name: 'Rahul Gandhi',
    party: 'Indian National Congress',
    image: rahulImg,
    description:
      'Rahul Gandhi advocates for social justice, inclusive growth, and democratic values. He envisions a progressive India built on equality and sustainable development.',
    manifesto: 'https://inc.in/',
  },
  {
    name: 'Arvind Kejriwal',
    party: 'Aam Aadmi Party',
    image: kejriwalImg,
    description:
      'Arvind Kejriwal is known for his focus on clean governance, education, and healthcare. He champions transparency and people-centric policies.',
    manifesto: 'https://aamaadmiparty.org/',
  },
  {
    name: 'Asaduddin Owaisi',
    party: 'AIMIM',
    image: owaisiImg,
    description:
      'Asaduddin Owaisi is a strong advocate for minority rights, constitutional values, and social justice. He focuses on education and political representation.',
    manifesto: 'https://www.aimim.org/',
  },
];

function CandidateList() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('voteyatra_user');
    setLoggedInUser(user);
  }, []);

  return (
    <div className="candidate-list-wrapper">
      {/* ✅ Header Section */}
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

      {/* ✅ Candidate Grid Section */}
      <div className="candidate-list-container">
        <h2 className="candidate-list-title">🗳️ Candidate List</h2>
        <div className="candidate-grid">
          {candidates.map((cand, index) => (
            <div className="candidate-card" style={{ animationDelay: `${index * 0.1}s` }} key={index}>
              <img src={cand.image} alt={cand.name} className="candidate-img" />
              <div className="candidate-info">
                <h3>{cand.name}</h3>
                <p className="candidate-party">{cand.party}</p>
                <p className="candidate-desc">{cand.description}</p>
                <a href={cand.manifesto} className="manifesto-link" target="_blank" rel="noreferrer">
                  View Manifesto →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateList;
