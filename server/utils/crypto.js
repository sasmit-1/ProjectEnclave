const crypto = require('crypto');

/**
 * Generates a standard 12-byte initialization vector for AES-GCM.
 * @returns {Buffer} A 12-byte random IV.
 */
function generateIV() {
    return crypto.randomBytes(12);
}

/**
 * Retrieves and formats the master encryption key from environment variables.
 * Assumes the MASTER_KEY is stored as a 64-character hex string (32 bytes).
 * @returns {Buffer} The 32-byte master key as a Buffer.
 * @throws {Error} If MASTER_KEY is not set or is not the correct length.
 */
function getMasterKey() {
    const keyString = process.env.MASTER_KEY;
    if (!keyString) {
        throw new Error('MASTER_KEY is not defined in environment variables.');
    }
    const keyBuffer = Buffer.from(keyString, 'hex');
    if (keyBuffer.length !== 32) {
        throw new Error('MASTER_KEY must be exactly 32 bytes (64 hex characters).');
    }
    return keyBuffer;
}

module.exports = {
    generateIV,
    getMasterKey
};
