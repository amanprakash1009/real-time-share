const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT access token.
 * @param {string} id - The MongoDB user ID to embed in the token payload.
 * @returns {string} - The signed JWT string.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { generateToken };
