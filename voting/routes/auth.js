const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtp, verifyOtp,verifiedEmails, isEmailVerified } = require('../utils/sendOtp');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// 🔹 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    await sendOtp(email);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// 🔹 Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOtp(email, otp)) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // ✅ Mark email as verified (in-memory only)
  verifiedEmails.add(email);

  res.json({ message: 'OTP verified. Now you can register.' });
});

// 🔹 Register
router.post('/register', async (req, res) => {
  const { username, password, email, aadhaar } = req.body;

  // ✅ Check OTP verified
  if (!verifiedEmails.has(email)) {
    return res.status(403).json({ message: 'Email not verified' });
  }

  // ✅ Check if email already registered
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const role = email === ADMIN_EMAIL ? 'admin' : 'user';

  try {
    const user = new User({
      username,
      email,
      password: hashed,
      aadhaar,
      role
    });

    await user.save();
    res.status(201).json({ message: `Registered as ${role}` });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Registration failed. Please check Aadhaar format.' });
  }
});

// 🔐 Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});


module.exports = router;
