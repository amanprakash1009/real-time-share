const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'Snippet title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Snippet code is required'],
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      default: 'javascript',
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Index on room: essential for listing snippets within a room
snippetSchema.index({ room: 1 });

// Index on owner: to fetch snippets authored by a specific user
snippetSchema.index({ owner: 1 });

// Multikey Index on tags: For ultra-fast tag filters (e.g. Snippet.find({ tags: 'react' }))
snippetSchema.index({ tags: 1 });

// Text index for full-text search capability on title and description
snippetSchema.index({ title: 'text', description: 'text' });

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
