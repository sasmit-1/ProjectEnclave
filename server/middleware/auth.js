const jwt = require('jsonwebtoken');

// Requires "Authorization: Bearer <token>" and sets req.userId
module.exports = function auth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
