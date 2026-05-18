const express = require('express');
const { createRoom, joinRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All room routes require authentication
router.use(protect);

// @route   POST /api/rooms/create
// @desc    Create a new collaboration room
// @access  Private
router.post('/create', createRoom);

// @route   GET /api/rooms/:id
// @desc    Get room details and join
// @access  Private
router.get('/:id', joinRoom);

module.exports = router;
