const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required'],
    },
    contextType: {
      type: String,
      enum: ['file', 'snippet', 'task', 'board', 'general'],
      required: [true, 'Context type is required (e.g. file, snippet, task)'],
    },
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Context object ID is required'],
      // Points to the specific File ID, Snippet ID, or Kanban Task Card ID
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // Supports multi-level threaded replies when pointing to a parent comment
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Compound Index: extremely critical. Comments are always loaded by specific context (e.g., file comments, task board comments)
commentSchema.index({ contextType: 1, contextId: 1 });

// Index on Room: to easily fetch all activity comments in a workspace
commentSchema.index({ room: 1 });

// Multikey Index on Mentions: to quickly let users find where they were mentioned in comments
commentSchema.index({ mentions: 1 });

// Index on Parent ID: to load nested replies for threading
commentSchema.index({ parentId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
