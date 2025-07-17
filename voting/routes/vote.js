const express = require('express');
const jwt = require('jsonwebtoken');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const router = express.Router();
const nodemailer = require('nodemailer');
const Candidate = require('../models/Candidate');

// Reuse your existing transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// 🔐 JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader||!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 🛡️ Admin Check Middleware
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// vote.js or middleware.js
const blockAdmins = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Admins are not allowed to perform this action' });
  }

  next();
};

const parseTime = (str) => {
  const [time, modifier] = str.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

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
  10: '12:00 AM - 1:00AM'
};

router.post('/book-slot', authenticate, async (req, res) => {
  const { slot } = req.body;

  if (!slotMap[slot]) {
    return res.status(400).json({ message: 'Invalid slot number. Choose between 1-9.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.slot) {
      return res.status(400).json({ message: 'You have already booked a slot.' });
    }

    user.slot = slotMap[slot];
    await user.save();

    res.json({ message: `✅ Slot booked: ${slotMap[slot]}` });
  } catch (err) {
    console.error('Slot booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🗳️ Cast a Vote
router.post('/cast-vote', authenticate, blockAdmins, async (req, res) => {
  const { choice } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.slot) {
      return res.status(403).json({ message: 'Book a slot before voting' });
    }

    if (user.hasVoted) {
      return res.status(403).json({ message: 'You have already cast your vote' });
    }

    const vote = new Vote({ userId: user._id, choice });
    await vote.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: '✅ Vote cast successfully' });
  } catch (err) {
    console.error('❌ Error casting vote:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 📋 Admin: View All Votes
router.get('/admin/all-votes', authenticate, isAdmin, async (req, res) => {
  try {
    const votes = await Vote.find().populate('userId', 'username email');
    res.json(votes);
  } catch (err) {
    console.error('❌ Error fetching votes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📊 Admin: Vote Summary (per choice)
router.get('/admin/vote-summary', authenticate, isAdmin, async (req, res) => {
  try {
    const summary = await Vote.aggregate([
      { $group: { _id: '$choice', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(summary);
  } catch (err) {
    console.error('❌ Error generating summary:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/all-users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide hashed passwords
    res.json(users);
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin Route: Delete user by Aadhaar
router.delete('/admin/delete-user/:aadhaar', authenticate, isAdmin, async (req, res) => {
  const { aadhaar } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ aadhaar });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User with this Aadhaar not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all announcements (anyone can access)
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new announcement (admin only)
router.post('/announcements', authenticate, isAdmin, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  try {
    const newAnnouncement = new Announcement({ message });
    await newAnnouncement.save();
    res.status(201).json({ message: 'Announcement posted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🗑️ Delete Announcement (admin only)
router.delete('/announcements/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting announcement:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /vote/admin/send-mail/:aadhaar
router.post('/admin/send-mail/:aadhaar', authenticate, isAdmin, async (req, res) => {
  const { message, subject } = req.body;
  const { aadhaar } = req.params;

  if (!message || !subject) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const user = await User.findOne({ aadhaar });

    if (!user) {
      return res.status(404).json({ message: 'User with given Aadhaar not found' });
    }

    await transporter.sendMail({
      from: `"Voting App Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html: `<p>${message}</p>`,
    });

    res.json({ message: `Email sent to ${user.username} (${user.email})` });
  } catch (err) {
    console.error('❌ Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// POST /vote/admin/send-mail/all
router.post('/admin/send-mail/all', authenticate, isAdmin, async (req, res) => {
  const { message, subject } = req.body;

  if (!message || !subject) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const users = await User.find();

    const emails = users.map(user => user.email);

    await transporter.sendMail({
      from: `"Voting App Admin" <${process.env.EMAIL_USER}>`,
      to: emails, // Can send up to ~100 addresses in one go (Gmail limit)
      subject,
      html: `<p>${message}</p>`,
    });

    res.json({ message: `Email sent to all ${users.length} users` });
  } catch (err) {
    console.error('❌ Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// 👤 Get all candidates (accessible to any authenticated user)
router.get('/user-slot', authenticate, blockAdmins, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      hasVoted: user.hasVoted,
      slot: user.slot || null,
    });
  } catch (err) {
    console.error('❌ Error fetching user slot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/auth/check-valid-user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ valid: false });
    res.json({ valid: true });
  } catch (err) {
    console.error('❌ Check user error:', err);
    res.status(500).json({ valid: false });
  }
});

// 📌 Admin: Get users by slot number
router.get('/admin/users-by-slot/:slot', authenticate, isAdmin, async (req, res) => {
  const { slot } = req.params;

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

  if (!slotMap[slot]) {
    return res.status(400).json({ message: 'Invalid slot number. Choose between 1-9.' });
  }

  try {
    const usersInSlot = await User.find({ slot: slotMap[slot] }).select('-password');
    res.json({
      slot: slotMap[slot],
      count: usersInSlot.length,
      users: usersInSlot,
    });
  } catch (err) {
    console.error('❌ Error fetching users by slot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
