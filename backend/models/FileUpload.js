const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  headers: [{
    type: String,
    required: true
  }],
  rowCount: {
    type: Number,
    default: 0
  },
  fileType: {
    type: String,
    enum: ['xlsx', 'xls'],
    default: 'xlsx'
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'error'],
    default: 'processing'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
fileUploadSchema.index({ userId: 1, uploadedAt: -1 });

module.exports = mongoose.model('FileUpload', fileUploadSchema);