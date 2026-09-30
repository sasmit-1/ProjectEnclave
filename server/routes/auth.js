const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Never includes the password hash
const publicUser = (user) => ({ id: user._id, username: user.username, email: user.email });

// Only plain strings are accepted, so objects like {"$ne": ""} can't reach a query
const isString = (value) => typeof value === 'string';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!isString(username) || !isString(email) || !isString(password)) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanUsername) {
    return res.status(400).json({ message: 'Username is required' });
  }
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const exists = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({ username: cleanUsername, email: cleanEmail, password });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    // Two identical sign-ups at the same moment: the unique index rejects the second
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isString(email) || !isString(password)) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  // Same message for a wrong email or a wrong password
  if (!user || !(await user.checkPassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  res.json(publicUser(user));
});

module.exports = router;
