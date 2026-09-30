const crypto = require('crypto');

// The AES-256 key: 64 hex characters in MASTER_KEY = 32 bytes
function getMasterKey() {
  const key = Buffer.from(process.env.MASTER_KEY || '', 'hex');
  if (key.length !== 32) {
    throw new Error(
      `MASTER_KEY must be exactly 64 hex characters (32 bytes), got ${key.length} bytes`,
    );
  }
  return key;
}

// A fresh 12-byte IV for every file, never reused
function generateIV() {
  return crypto.randomBytes(12);
}

module.exports = { getMasterKey, generateIV };
