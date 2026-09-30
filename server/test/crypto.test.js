const { test } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const { Readable, Writable } = require('stream');
const { pipeline } = require('stream/promises');
const { getMasterKey, generateIV } = require('../utils/crypto');

// A random key just for the tests, never the real one from .env
process.env.MASTER_KEY = crypto.randomBytes(32).toString('hex');

// Streams a buffer through a cipher or decipher in 64 KB chunks
async function streamThrough(transform, input) {
  const chunks = [];
  for (let i = 0; i < input.length; i += 64 * 1024) {
    chunks.push(input.subarray(i, i + 64 * 1024));
  }
  const output = [];
  await pipeline(
    Readable.from(chunks),
    transform,
    new Writable({
      write(chunk, encoding, callback) {
        output.push(chunk);
        callback();
      },
    }),
  );
  return Buffer.concat(output);
}

async function encrypt(original) {
  const iv = generateIV();
  const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv);
  const encrypted = await streamThrough(cipher, original);
  return { iv, authTag: cipher.getAuthTag(), encrypted };
}

function createDecipher(iv, authTag) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', getMasterKey(), iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(authTag);
  return decipher;
}

test('stream-encrypts 1 MB and decrypts it back to the original', async () => {
  const original = crypto.randomBytes(1024 * 1024);
  const { iv, authTag, encrypted } = await encrypt(original);

  assert.strictEqual(encrypted.length, original.length);
  assert.ok(!encrypted.equals(original), 'ciphertext must differ from the original');

  const decrypted = await streamThrough(createDecipher(iv, authTag), encrypted);
  assert.ok(decrypted.equals(original), 'decrypted data must match the original');
});

test('one flipped bit fails the integrity check', async () => {
  const original = crypto.randomBytes(1024 * 1024);
  const { iv, authTag, encrypted } = await encrypt(original);

  const tampered = Buffer.from(encrypted);
  tampered[500000] ^= 0x01;

  await assert.rejects(
    streamThrough(createDecipher(iv, authTag), tampered),
    /unable to authenticate/,
  );
});

test('a wrong-length MASTER_KEY throws', () => {
  const realKey = process.env.MASTER_KEY;
  try {
    process.env.MASTER_KEY = 'abcd'; // 2 bytes
    assert.throws(() => getMasterKey(), /exactly 64 hex characters/);

    process.env.MASTER_KEY = realKey + 'ab'; // 33 bytes
    assert.throws(() => getMasterKey(), /exactly 64 hex characters/);
  } finally {
    process.env.MASTER_KEY = realKey;
  }
});
