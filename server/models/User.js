const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '', // URL to profile picture or initial avatar generator
    },
    // --- Real-time Presence Status ---
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
      index: {
        unique: false,
        sparse: true, // Only index records that have a socketId to save memory
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexing Strategy ---
// Index email for ultra-fast unique lookups (implicitly created by unique: true)
// Index on isOnline is useful for fetching lists of active/online collaborators
userSchema.index({ isOnline: 1 });

/**
 * Pre-save middleware: Hash the password before saving if it was modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare an incoming plain-text password with the stored hash.
 * @param {string} enteredPassword - The password provided by the user during login.
 * @returns {boolean} - True if passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
