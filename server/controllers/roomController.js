const crypto = require('crypto');
const Room = require('../models/Room');

/**
 * @desc    Create a new collaboration room
 * @route   POST /api/rooms/create
 * @access  Private (Authenticated users only)
 */
const createRoom = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    // Generate a unique 8-character alphanumeric room ID
    let roomId;
    let roomExists = true;
    
    // Safety check against collisions (extremely rare but good practice)
    while (roomExists) {
      roomId = crypto.randomBytes(4).toString('hex');
      const existing = await Room.findOne({ roomId });
      if (!existing) {
        roomExists = false;
      }
    }

    // Set expiration time to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create the room
    const room = await Room.create({
      roomId,
      owner: ownerId,
      members: [ownerId], // Owner is automatically a member
      expiresAt,
    });

    // Construct the frontend room link
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const roomLink = `${clientUrl}/room/${roomId}`;

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      roomId: room.roomId,
      roomLink,
      expiresAt: room.expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get room details and join room
 * @route   GET /api/rooms/:id
 * @access  Private (Authenticated users only)
 */
const joinRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user._id;

    // Find the room
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or invalid room ID',
      });
    }

    // Verify room has not expired (manual check in addition to TTL index)
    if (room.expiresAt && room.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'This room has expired and is no longer active',
      });
    }

    // If valid, add user to members array if not already present
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    // Fetch full room details with populated owner & members info (excluding password/sensitive data)
    const populatedRoom = await Room.findOne({ roomId })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      room: {
        roomId: populatedRoom.roomId,
        owner: populatedRoom.owner,
        members: populatedRoom.members,
        createdAt: populatedRoom.createdAt,
        expiresAt: populatedRoom.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  joinRoom,
};
