const mongoose = require('mongoose');

const roomMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member', 'viewer'],
    default: 'member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, 'Room ID/slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [roomMemberSchema],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    // Expiry support: if set, MongoDB TTL index deletes the room automatically
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Enable virtual fields to serialize into JSON and objects
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexing Strategy ---
// Index roomId for O(1) query performance on routing (e.g. /rooms/:roomId)
roomSchema.index({ roomId: 1 }, { unique: true });

// Multikey index on members.user so we can instantly list all rooms a user belongs to
roomSchema.index({ 'members.user': 1 });

// TTL (Time-To-Live) index for temporary rooms.
// MongoDB polls this index and automatically deletes the room when Date.now() >= expiresAt
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- Virtual Populates ---
// To maintain scalability and avoid MongoDB's 16MB document size limit,
// we do NOT store files, snippets, or messages inside the Room document as arrays.
// Instead, we reference Room from the child collections and fetch them dynamically using Virtual Populates.

// Virtual link to Room's Files
roomSchema.virtual('files', {
  ref: 'File',
  localField: '_id',
  foreignField: 'room',
});

// Virtual link to Room's Snippets
roomSchema.virtual('snippets', {
  ref: 'Snippet',
  localField: '_id',
  foreignField: 'room',
});

// Virtual link to Room's Messages (or recent chat logs)
roomSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'room',
});

// Virtual link to Room's ActivityLogs
roomSchema.virtual('activities', {
  ref: 'ActivityLog',
  localField: '_id',
  foreignField: 'room',
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
