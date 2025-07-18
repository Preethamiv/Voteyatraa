import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import emblem from '../assets/candidates/emblem.jpg';
import './Announcement.css';

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('voteyatra_token'));
  const [message, setMessage] = useState('');
  const [shuffledAnnouncements, setShuffledAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();

    const user = localStorage.getItem('voteyatra_user');
    const role = localStorage.getItem('voteyatra_role');
    const storedToken = localStorage.getItem('voteyatra_token');

    setLoggedInUser(user);
    setIsAdmin(role === 'admin' && !!user);
    setToken(storedToken);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:3000/vote/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const handlePost = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/vote/announcements',
        { message: newAnnouncement },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setNewAnnouncement('');
      fetchAnnouncements();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:3000/vote/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchAnnouncements();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete announcement';
      alert(msg);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffledAnnouncements((prev) => shuffleArray(prev));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('voteyatra_user');
    localStorage.removeItem('voteyatra_token');
    localStorage.removeItem('voteyatra_role');
    setLoggedInUser(null);
    setIsAdmin(false);
    setToken(null);
    navigate('/');
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

      <div className="announcement-container">
        <h2>📢 Announcements</h2>

        {isAdmin && token && (
          <div className="announcement-form">
            <textarea
              rows="3"
              placeholder="Type a new announcement..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
            />
            <button className="post-btn" onClick={handlePost}>
              Post Announcement
            </button>
            {message && <p className="post-status">{message}</p>}
          </div>
        )}

        <div className="announcement-list">
          {announcements.length === 0 ? (
            <p className="no-announcements">No announcements yet.</p>
          ) : (
            shuffledAnnouncements.map((item) => (
              <div key={item._id} className="announcement-card">
                <p>{item.message}</p>
                <span className="timestamp">
                  {new Date(item.createdAt).toLocaleString()}
                </span>

                {isAdmin && token && (
                  <button
                    className="delete-announcement-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Announcement;
