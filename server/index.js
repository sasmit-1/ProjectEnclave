require('dotenv').config({ quiet: true });

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { getMasterKey } = require('./utils/crypto');

for (const name of ['MONGO_URI', 'JWT_SECRET', 'MASTER_KEY']) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name} (see server/.env.example)`);
  }
}

// A bad key stops the server now instead of failing on the first upload
getMasterKey();

// uploads/ is gitignored, so a fresh clone won't have it
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
app.set('uploadDir', uploadDir);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/files', require('./routes/files'));

// Express 5 sends errors from async routes here automatically
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : err.message });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
    app.listen(PORT, (err) => {
      if (err) {
        console.error(`Could not start server on port ${PORT}:`, err.message);
        process.exit(1);
      }
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
