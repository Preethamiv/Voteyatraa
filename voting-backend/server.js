// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from frontend
  credentials: true
}));

const authRoutes = require('./routes/auth'); // ✅ import router properly
const voteRoutes = require('./routes/vote');
app.use('/vote', voteRoutes);




app.use('/auth', authRoutes); // ✅ works
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 Server started on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
