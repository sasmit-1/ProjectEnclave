const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/files', require('./routes/files'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running securely.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
