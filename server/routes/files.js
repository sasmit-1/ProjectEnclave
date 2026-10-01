const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const express = require('express');
const mongoose = require('mongoose');
const busboy = require('busboy');
const File = require('../models/File');
const auth = require('../middleware/auth');
const { getMasterKey, generateIV } = require('../utils/crypto');

const router = express.Router();

router.post('/upload', auth, async (req, res) => {
  let bb;
  try {
    bb = busboy({ headers: req.headers, defParamCharset: 'utf8' });
  } catch {
    return res.status(400).json({ message: 'Expected a multipart/form-data upload' });
  }

  const uploadDir = req.app.get('uploadDir');
  const saves = [];
  let uploadError = null; // malformed or aborted upload (client side)
  let writeError = null; // could not write to disk (server side)

  bb.on('file', (fieldName, fileStream, { filename, mimeType }) => {
    if (!filename) {
      fileStream.resume(); // a part without a file name: skip it
      return;
    }

    // Disk name is a random UUID only, never the user's file name
    const diskName = crypto.randomUUID();
    const storagePath = path.join(uploadDir, diskName);
    const writeStream = fs.createWriteStream(storagePath);

    // Encrypt on the fly with AES-256-GCM and a fresh IV per file
    const iv = generateIV();
    const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv);

    const save = (async () => {
      try {
        await pipeline(fileStream, cipher, writeStream);
      } catch (err) {
        // If busboy is still running, the disk write failed. busboy stalls
        // when one of its file streams dies, so stop parsing.
        if (!bb.destroyed) {
          writeError = err;
          bb.destroy(err);
        }
        throw err;
      }
      return File.create({
        filename: diskName,
        originalName: filename,
        mimeType,
        size: writeStream.bytesWritten, // GCM ciphertext is exactly as long as the original
        storagePath,
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex'),
        owner: req.userId,
      });
    })().catch(async (err) => {
      // Stream or database save failed: delete the half-written file
      await fs.promises.unlink(storagePath).catch(() => {});
      throw err;
    });

    // Crash guard: the real handling happens in 'close'
    save.catch(() => {});
    saves.push(save);
  });

  bb.on('error', (err) => {
    uploadError = err;
  });

  bb.on('close', async () => {
    const results = await Promise.allSettled(saves);
    if (res.headersSent) return;

    if (writeError) {
      console.error('Upload failed:', writeError.message);
      return res.status(500).json({ message: 'Could not save the file' });
    }
    if (uploadError) {
      return res.status(400).json({ message: 'Upload was incomplete or malformed' });
    }
    const failed = results.find((result) => result.status === 'rejected');
    if (failed) {
      console.error('Upload failed:', failed.reason.message);
      return res.status(500).json({ message: 'Could not save the file' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({ files: results.map((result) => result.value) });
  });

  try {
    // pipeline (not req.pipe) so an aborted upload destroys busboy instead of hanging
    await pipeline(req, bb);
  } catch {
    // Aborted or malformed uploads are answered in 'close'
  }
});

router.get('/download/:fileId', auth, async (req, res) => {
  const { fileId } = req.params;

  // Other users' files also get 404, so the server doesn't reveal they exist
  const file = mongoose.isValidObjectId(fileId)
    ? await File.findOne({ _id: fileId, owner: req.userId })
    : null;
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Check the disk before any headers are sent
  try {
    await fs.promises.access(file.storagePath);
  } catch {
    return res.status(404).json({ message: 'File not found' });
  }

  // authTagLength blocks shortened-tag attacks
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getMasterKey(),
    Buffer.from(file.iv, 'hex'),
    { authTagLength: 16 },
  );
  decipher.setAuthTag(Buffer.from(file.authTag, 'hex'));

  res.attachment(file.originalName); // safe Content-Disposition for any characters
  res.setHeader('Content-Type', file.mimeType);

  // GCM checks the tag only at the end of the file. On failure, pipeline
  // destroys res, so the download is cut off and never completes.
  try {
    await pipeline(fs.createReadStream(file.storagePath), decipher, res);
  } catch (err) {
    if (err.message.includes('unable to authenticate')) {
      console.error('🚨 INTEGRITY CHECK FAILED / POSSIBLE TAMPERING: file', file.id);
    } else if (err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      // Premature close = the user cancelled the download
      console.error('Download error:', err.message);
    }
  }
});

module.exports = router;
