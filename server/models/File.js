const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required'],
    },
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    url: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Cloud storage key (e.g. S3 path) is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      default: 'application/octet-stream',
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Compound index: Essential for loading active files in a room (e.g., File.find({ room, isDeleted: false }))
fileSchema.index({ room: 1, isDeleted: 1 });

// Index for owner lookup (e.g. user viewing files they uploaded across the platform)
fileSchema.index({ owner: 1 });

// Composite text index for searching files by name in a workspace
fileSchema.index({ name: 'text' });

const File = mongoose.model('File', fileSchema);

module.exports = File;
