const mongoose = require('mongoose');

const messageReadReceiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'system', 'code'],
      default: 'text',
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    readBy: [messageReadReceiptSchema],
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Compound index: crucial for pagination. Chat logs are loaded per-room, sorted by creation date (newest first).
// This compound index satisfies both the filter (room) and the sort (createdAt) with zero memory overhead.
messageSchema.index({ room: 1, createdAt: -1 });

// Index for counting unread receipts and checking specific sender activity
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
