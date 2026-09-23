const express = require('express');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const crypto = require('crypto');
const File = require('../models/File');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/files/upload
// @desc    Stream file upload to disk and save metadata
router.post('/upload', authMiddleware, (req, res) => {
  const bb = busboy({ headers: req.headers });
  const uploadPromises = [];

  bb.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    const uniqueFilename = crypto.randomUUID() + '-' + filename;
    const saveTo = path.join(__dirname, '..', 'uploads', uniqueFilename);
    let fileSize = 0;
    
    const writeStream = fs.createWriteStream(saveTo);
    
    file.on('data', (data) => {
      fileSize += data.length;
    });

    // Pipe the readable file stream to the writable disk stream directly
    file.pipe(writeStream);
    
    const p = new Promise((resolve, reject) => {
      writeStream.on('finish', async () => {
        try {
          const fileDoc = new File({
            originalName: filename,
            filename: uniqueFilename,
            mimeType: mimeType,
            size: fileSize,
            storagePath: saveTo,
            owner: req.user.id
          });
          await fileDoc.save();
          resolve(fileDoc);
        } catch (err) {
          reject(err);
        }
      });
      writeStream.on('error', reject);
    });
    
    uploadPromises.push(p);
  });

  bb.on('finish', async () => {
    try {
      const savedFiles = await Promise.all(uploadPromises);
      res.status(200).json({ message: 'Upload successful', files: savedFiles });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error processing upload' });
    }
  });

  bb.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: 'Stream error' });
  });

  req.pipe(bb);
});

// @route   GET /api/files/download/:fileId
// @desc    Stream file download to client
router.get('/download/:fileId', authMiddleware, async (req, res) => {
  try {
    const fileDoc = await File.findOne({ _id: req.params.fileId, owner: req.user.id });
    if (!fileDoc) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    if (!fs.existsSync(fileDoc.storagePath)) {
      return res.status(404).json({ message: 'File physically missing on server' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.originalName}"`);
    res.setHeader('Content-Type', fileDoc.mimeType);

    const readStream = fs.createReadStream(fileDoc.storagePath);
    readStream.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Server error during download' });
  }
});

module.exports = router;
