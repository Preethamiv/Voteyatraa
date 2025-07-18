// src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [votes, setVotes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [users, setUsers] = useState([]);
  const [aadhaarToDelete, setAadhaarToDelete] = useState('');
  const [aadhaarToEmail, setAadhaarToEmail] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [slotToSearch, setSlotToSearch] = useState('');
const [usersBySlot, setUsersBySlot] = useState([]);
const [slotFetchStatus, setSlotFetchStatus] = useState('');
const [slotForEmail, setSlotForEmail] = useState('');
const [slotEmailSubject, setSlotEmailSubject] = useState('');
const [slotEmailMessage, setSlotEmailMessage] = useState('');
const [slotEmailStatus, setSlotEmailStatus] = useState('');



const fetchUsersBySlot = async () => {
  if (!slotToSearch) {
    alert('Please enter a slot number (1–9)');
    return;
  }

  try {
    const res = await axios.get(`http://localhost:3000/vote/admin/users-by-slot/${slotToSearch}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsersBySlot(res.data.users);
    setSlotFetchStatus(`Slot ${slotToSearch}: ${res.data.count} users found`);
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to fetch users';
    setSlotFetchStatus(msg);
    setUsersBySlot([]);
  }
};


  const token = localStorage.getItem('voteyatra_token');

  const fetchVotes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/vote/admin/all-votes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotes(res.data);
    } catch (err) {
      console.error('Error fetching votes:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:3000/vote/admin/vote-summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/vote/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/vote/admin/delete-user/${aadhaarToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteStatus(res.data.message);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
setDeleteStatus(msg);
alert(msg); // 🚨 Show popup

    }
  };

  return (
    <div className="admin-container">
      <div className="admin-slot-fetch">
  <h4>🕓 View Users by Slot</h4>
  <input
    type="number"
    min="1"
    max="9"
    placeholder="Enter slot number (1-9)"
    value={slotToSearch}
    onChange={(e) => setSlotToSearch(e.target.value)}
  />
  <button onClick={fetchUsersBySlot}>🔍 Fetch Users</button>
  {slotFetchStatus && <p className="status">{slotFetchStatus}</p>}

  {usersBySlot.length > 0 && (
    <div>
      <h5>Users in Slot {slotToSearch}</h5>
      {usersBySlot.map((user, i) => (
        <div key={i}>
          <strong>{user.username}</strong> | {user.email} | Aadhaar: {user.aadhaar}
        </div>
      ))}
    </div>
  )}
</div>

      <h2>🔐 Admin Portal</h2>

      <div className="admin-actions">
        <button onClick={fetchVotes}>📋 View All Votes</button>
        <button onClick={fetchSummary}>📊 View Vote Summary</button>
        <button onClick={fetchUsers}>👥 View All Users</button>
      </div>

      <div className="admin-delete">
        <input
  type="text"
  placeholder="Enter Aadhaar to delete user"
  value={aadhaarToDelete}
  onChange={(e) => setAadhaarToDelete(e.target.value)}
/>

        <button onClick={deleteUser}>🗑️ Delete User</button>
        {deleteStatus && <p className="status">{deleteStatus}</p>}
      </div>

      <div className="admin-section">
        {votes.length > 0 && (
          <div>
            <h3>All Votes</h3>
            {votes.map((vote, i) => (
              <div key={i}>{vote.userId?.username} → {vote.choice}</div>
            ))}
          </div>
        )}

        {summary.length > 0 && (
          <div>
            <h3>Vote Summary</h3>
            {summary.map((item, i) => (
              <div key={i}>{item._id} - {item.count} votes</div>
            ))}
          </div>
        )}

        {users.length > 0 && (
  <div>
    <h3>All Users</h3>
    {users.map((user, i) => (
      <div key={i}>
        <strong>{user.username}</strong> | {user.email} | Aadhaar: {user.aadhaar} | Role: {user.role}
      </div>
    ))}
  </div>
)}  

      </div>
      <div className="admin-email">
  <h4>📧 Send Email to Users by Slot</h4>
  <input
    type="number"
    min="1"
    max="9"
    placeholder="Enter slot number (1–9)"
    value={slotForEmail}
    onChange={(e) => setSlotForEmail(e.target.value)}
  />
  <input
    type="text"
    placeholder="Subject"
    value={slotEmailSubject}
    onChange={(e) => setSlotEmailSubject(e.target.value)}
  />
  <textarea
    placeholder="Message"
    value={slotEmailMessage}
    onChange={(e) => setSlotEmailMessage(e.target.value)}
  />
  <button
    onClick={async () => {
      try {
        const res = await axios.post(
          `http://localhost:3000/vote/admin/send-mail/slot/${slotForEmail}`,
          { subject: slotEmailSubject, message: slotEmailMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlotEmailStatus(res.data.message);
      } catch (err) {
        setSlotEmailStatus(err.response?.data?.message || 'Failed to send email');
      }
    }}
  >
    ✉️ Send Email to Slot Users
  </button>
  {slotEmailStatus && <p className="status">{slotEmailStatus}</p>}
</div>

    <div className="admin-email">
  <h4>📧 Send Email to Specific User</h4>
  <input
  type="text"
  placeholder="Enter Aadhaar"
  value={aadhaarToEmail}
  onChange={(e) => setAadhaarToEmail(e.target.value)}
/>

  <input
    type="text"
    placeholder="Subject"
    value={emailSubject}
    onChange={(e) => setEmailSubject(e.target.value)}
  />
  <textarea
    placeholder="Message"
    value={emailMessage}
    onChange={(e) => setEmailMessage(e.target.value)}
  />
  <button
    onClick={async () => {
      try {
        const res = await axios.post(
          `http://localhost:3000/vote/admin/send-mail/$${aadhaarToEmail}`,
          { subject: emailSubject, message: emailMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmailStatus(res.data.message);
      } catch (err) {
        setEmailStatus(err.response?.data?.message || 'Failed to send email');
      }
    }}
  >
    ✉️ Send Email to User
  </button>
</div>
    <div className="admin-email">
  <h4>📧 Send Email to All Users</h4>
  <input
    type="text"
    placeholder="Subject"
    value={emailSubject}
    onChange={(e) => setEmailSubject(e.target.value)}
  />
  <textarea
    placeholder="Message"
    value={emailMessage}
    onChange={(e) => setEmailMessage(e.target.value)}
  />
  <button
    onClick={async () => {
      try {
        const res = await axios.post(
          `http://localhost:3000/vote/admin/send-mail/all`,
          { subject: emailSubject, message: emailMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmailStatus(res.data.message);
      } catch (err) {
        setEmailStatus(err.response?.data?.message || 'Failed to send email');
      }
    }}
  >
    ✉️ Send Email to All Users
  </button>
  {emailStatus && <p className="status">{emailStatus}</p>}
</div>

    </div>
  );
}

export default Admin;
