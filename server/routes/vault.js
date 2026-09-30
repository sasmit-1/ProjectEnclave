const express = require('express');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// List the logged-in user's files, newest first
router.get('/', auth, async (req, res) => {
  const files = await File.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json(files);
});

module.exports = router;
