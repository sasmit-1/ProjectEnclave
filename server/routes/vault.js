const express = require('express');
const File = require('../models/File');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/vault
// @desc    Get all files for the logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
