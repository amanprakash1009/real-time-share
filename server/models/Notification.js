const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient reference is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null indicates a automated system notification
    },
    type: {
      type: String,
      enum: ['mention', 'comment', 'invite', 'room_update', 'system'],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Notification content is required'],
      trim: true,
      maxlength: [500, 'Content cannot exceed 500 characters'],
    },
    link: {
      type: String,
      default: '', // Frontend route (e.g. /rooms/roomId?commentId=commentId) to navigate to on-click
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Compound index: crucial for checking unread notification count/list for the current user
notificationSchema.index({ recipient: 1, isRead: 1 });

// TTL (Time-To-Live) index on createdAt:
// Automatically purges notifications older than 30 days (2,592,000 seconds) to maintain lightweight DB operations.
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
