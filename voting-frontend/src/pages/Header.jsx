import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import emblem from '../assets/candidates/emblem.jpg';

function Header() {
  const navigate = useNavigate();

  return (
    <div className="app-header" onClick={() => navigate('/')}>
      <img src={emblem} alt="Emblem" className="header-emblem" />
      <h1 className="header-title">🗳️ VoteYatra</h1>
    </div>
  );
}

export default Header;
