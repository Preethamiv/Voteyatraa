import React, { useEffect, useState } from 'react';
import './CastVote.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import modiImg from '../assets/candidates/narendra_modi.jpg';
import rahulImg from '../assets/candidates/Rahul_Gandhi.jpg';
import kejriwalImg from '../assets/candidates/Arvind_Kejriwal.jpg';
import owaisiImg from '../assets/candidates/Asaduddin_Owaisi.jpg';

const candidates = [
  { name: 'Narendra Modi', party: 'Bharatiya Janta Party', image: modiImg },
  { name: 'Rahul Gandhi', party: 'Indian National Congress', image: rahulImg },
  { name: 'Arvind Kejriwal', party: 'Aam Aadmi Party', image: kejriwalImg },
  { name: 'Asaduddin Owaisi', party: 'AIMIM', image: owaisiImg },
];

function CastVote() {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [message, setMessage] = useState('');
  const [slotStatus, setSlotStatus] = useState('');
  const [canVote, setCanVote] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('voteyatra_token');

  useEffect(() => {
    if (!token) {
      navigate('/login',{ replace: true });
      return;
    }

    const checkSlot = async () => {
      try {
        const res = await axios.get('http://localhost:3000/vote/user-slot', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { hasVoted, slot } = res.data;

        if (hasVoted) {
          setSlotStatus('🟢 You have already voted.');
          return;
        }

        if (!slot) {
          setSlotStatus('⚠️ Please book a slot first.');
          return;
        }

        const now = new Date();
        const [start, end] = slot.split(' - ');
        const today = now.toDateString();

        const parseTime = (timeStr) => {
          const [time, ampm] = timeStr.split(' ');
          let [h, m] = time.split(':').map(Number);
          if (ampm === 'PM' && h !== 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          return new Date(`${today} ${h}:${m}`);
        };

        const startTime = parseTime(start);
        const endTime = parseTime(end);

        if (now < startTime) {
          setSlotStatus(`⏳ Voting starts at ${start}. Please come back later.`);
          return;
        }

        if (now > endTime) {
          setSlotStatus(`⛔ Your voting slot (${slot}) has expired.`);
          return;
        }

        setSlotStatus(`✅ You can vote now. Slot: ${slot}`);
        setCanVote(true);
      } catch (err) {
        setSlotStatus('Error fetching slot info.');
      }
    };

    checkSlot();
  }, [navigate, token]);

  const handleVote = async () => {
    if (!selectedChoice) {
      alert('Please select a candidate to vote');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/vote/cast-vote',
        { choice: selectedChoice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCanVote(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error casting vote');
    }
  };

  return (
    <div className="cast-vote-wrapper">
      <h2 className="cast-vote-title">🗳️ Cast Your Vote</h2>
      <p className="cast-vote-status">{slotStatus}</p>

      {canVote && (
        <>
          <div className="cast-vote-grid">
            {candidates.map((c, idx) => (
              <div className="cast-vote-card" key={idx}>
                <img src={c.image} alt={c.name} className="cast-vote-img" />
                <div className="cast-vote-info">
                  <h3 className="cast-vote-name">{c.name}</h3>
                  <p className="cast-vote-party">{c.party}</p>
                  <label className="cast-vote-label">
                    <input
                      type="radio"
                      name="cast-vote-candidate"
                      value={c.name}
                      onChange={() => setSelectedChoice(c.name)}
                    />
                    Vote for {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button className="cast-vote-btn" onClick={handleVote}>
            Cast Vote
          </button>
        </>
      )}

      {message && <p className="cast-vote-message">{message}</p>}
    </div>
  );
}

export default CastVote;
