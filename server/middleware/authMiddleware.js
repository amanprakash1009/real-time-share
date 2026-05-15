const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware: Verifies the JWT token in the Authorization header.
 * On success, attaches the user object to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (excluding password) to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
    }

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token has expired',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

module.exports = { protect };
