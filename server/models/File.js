const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // random UUID used as the name on disk
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  iv: { type: String, required: true }, // hex
  authTag: { type: String, required: true }, // hex
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

// Crypto details and the disk path never leave the server
fileSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.iv;
    delete ret.authTag;
    delete ret.storagePath;
    return ret;
  },
});

module.exports = mongoose.model('File', fileSchema);
