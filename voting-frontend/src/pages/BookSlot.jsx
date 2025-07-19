import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import emblem from '../assets/candidates/emblem.jpg';
import './BookSlot.css';

const slotMap = {
  1: '9:00 AM - 10:00 AM',
  2: '10:00 AM - 11:00 AM',
  3: '11:00 AM - 12:00 PM',
  4: '12:00 PM - 1:00 PM',
  5: '1:00 PM - 2:00 PM',
  6: '2:00 PM - 3:00 PM',
  7: '3:00 PM - 4:00 PM',
  8: '4:00 PM - 5:00 PM',
  9: '5:00 PM - 6:00 PM',
};

function BookSlot() {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('voteyatra_token');
    const user = localStorage.getItem('voteyatra_user');
    const role = localStorage.getItem('voteyatra_role');
    if (!token || !user) {
      sessionStorage.setItem('flashMessage', 'Please log in to access Book Slot');
      navigate('/login', { replace: true });
      return;
    }
    if (role === 'admin') {
  alert('Admins are not allowed to book slots');
  navigate('/', { replace: true }); // Redirect away
    return;
}

    setLoggedInUser(user);
  }, [navigate]);

  const handleSlotChange = (e) => {
    setSelectedSlot(Number(e.target.value)); // ✅ Convert to number
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('voteyatra_token');
    if (!token) {
      alert('You must be logged in to book a slot');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/vote/book-slot',
        { slot: selectedSlot }, // ✅ sending number like 1, 2 etc.
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to book slot');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <header className="home-header4">
        <img src={emblem} alt="Indian Emblem" className="emblem" />
        <Link to="/" className="no-underline">
          <h1 className="home-title">🗳️ VoteYatra</h1>
        </Link>

        <div className="header-buttons">
          {loggedInUser ? (
            <>
              <span className="welcome-user">Welcome, {loggedInUser}</span>
              <button className="logout-btn" onClick={handleLogout}>
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

      <div className="book-slot-container">
        <h2>📅 Book Your Voting Slot</h2>
        <form onSubmit={handleSubmit} className="slot-form">
          {Object.entries(slotMap).map(([slotNum, label]) => (
            <label key={slotNum} className="slot-option">
              <input
                type="radio"
                name="slot"
                value={slotNum}
                checked={selectedSlot === Number(slotNum)}
                onChange={handleSlotChange}
                required
              />
              {label}
            </label>
          ))}
          <button type="submit" className="book-btn">Book Slot</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
    </>
  );
}

export default BookSlot;
