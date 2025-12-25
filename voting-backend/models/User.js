const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  hasVoted: { type: Boolean, default: false },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^\d{12}$/.test(v),
      message: props => `${props.value} is not a valid 12-digit Aadhaar number!`,
    },
  },
  slot: {
    type: String, // Just store like "9:00 AM - 10:00 AM"
    default: null,
  },
});

module.exports = mongoose.model('User', userSchema);
