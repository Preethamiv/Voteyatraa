const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  symbol: String, // URL to candidate image or symbol
});

module.exports = mongoose.model('Candidate', candidateSchema);
