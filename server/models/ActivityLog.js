const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    action: {
      type: String,
      required: [true, 'Action identifier is required'],
      trim: true,
      // Examples: 'ROOM_CREATED', 'MEMBER_JOINED', 'FILE_UPLOADED', 'SNIPPET_UPDATED', 'BOARD_CARD_MOVED'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Dynamic schema-less container for action-specific details (e.g. card titles, old/new roles)
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: true, // Only track createdAt since logs are immutable and never updated
      updatedAt: false,
    },
  }
);

// --- Indexing Strategy ---
// Compound index: highly recommended for room-specific activity feeds (ActivityLog.find({ room }).sort({ createdAt: -1 }))
activityLogSchema.index({ room: 1, createdAt: -1 });

// Index on user: to track a single user's platform audit trail
activityLogSchema.index({ user: 1 });

// TTL (Time-To-Live) index on createdAt:
// Automatically deletes activity logs older than 90 days (7,776,000 seconds) to prevent infinite database expansion.
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
