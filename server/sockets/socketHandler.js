const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');
const File = require('../models/File');
const Message = require('../models/Message');

// In-memory mapping of active rooms and their users:
// activeRooms: roomId -> Array of { socketId, userId, name, email, avatar }
const activeRooms = new Map();

/**
 * Initializes and registers Socket.io event listeners.
 * @param {import('socket.io').Server} io
 */
const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach authenticated user to socket object
      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication failed:', err.message);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Connected: ${socket.user.name} (${socket.id})`);

    // Handle joining a room
    socket.on('join-room', async ({ roomId }) => {
      if (!roomId) return;

      try {
        // Verify room existence in database
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found or invalid room ID' });
          return;
        }

        socket.join(roomId);
        console.log(`👤 ${socket.user.name} joined room: ${roomId}`);

        // Update in-memory active rooms
        if (!activeRooms.has(roomId)) {
          activeRooms.set(roomId, []);
        }
        const roomUsers = activeRooms.get(roomId);

        // Check if user is already present in this room via another tab/socket
        const userExists = roomUsers.some((u) => u.userId === socket.user._id.toString());

        // Store this socket session
        roomUsers.push({
          socketId: socket.id,
          userId: socket.user._id.toString(),
          name: socket.user.name,
          email: socket.user.email,
          avatar: socket.user.avatar,
        });

        // Get list of unique users currently in the room
        const uniqueUsers = Array.from(
          new Map(
            roomUsers.map((item) => [
              item.userId,
              {
                id: item.userId,
                name: item.name,
                email: item.email,
                avatar: item.avatar,
              },
            ])
          ).values()
        );

        // Send current online users list back to the newly joined client
        socket.emit('room:users', uniqueUsers);

        // Broadcast to other room members that a new user joined
        if (!userExists) {
          socket.to(roomId).emit('user:joined', {
            id: socket.user._id.toString(),
            name: socket.user.name,
            email: socket.user.email,
            avatar: socket.user.avatar,
          });
        }

        // Retrieve and send historic data (files and messages)
        const files = await File.find({ room: room._id, isDeleted: false })
          .populate('owner', 'name email avatar')
          .sort({ createdAt: -1 });

        const mappedFiles = files.map((file) => ({
          _id: file._id,
          originalName: file.name,
          size: file.size,
          mimetype: file.mimeType,
          url: file.url,
          createdAt: file.createdAt,
          uploadedBy: file.owner
            ? {
                id: file.owner._id,
                name: file.owner.name,
                email: file.owner.email,
                avatar: file.owner.avatar,
              }
            : null,
        }));

        const messages = await Message.find({ room: room._id })
          .populate('sender', 'name email avatar')
          .sort({ createdAt: 1 })
          .limit(100);

        const mappedMessages = messages.map((msg) => ({
          _id: msg._id,
          text: msg.content,
          createdAt: msg.createdAt,
          sender: msg.sender
            ? {
                id: msg.sender._id.toString(),
                name: msg.sender.name,
                avatar: msg.sender.avatar,
              }
            : null,
        }));

        // Send room files and messages
        socket.emit('room:data', {
          files: mappedFiles,
          messages: mappedMessages,
        });
      } catch (err) {
        console.error(`Error handling join-room for ${roomId}:`, err);
        socket.emit('error', { message: 'Internal server error while joining room' });
      }
    });

    // Helper logic to clean up when leaving a room
    const leaveRoom = (roomId) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`👤 ${socket.user.name} left room: ${roomId}`);

      if (activeRooms.has(roomId)) {
        let roomUsers = activeRooms.get(roomId);
        // Filter out this specific socket
        roomUsers = roomUsers.filter((u) => u.socketId !== socket.id);
        activeRooms.set(roomId, roomUsers);

        // Check if user still has another active connection/socket in the room
        const stillConnected = roomUsers.some((u) => u.userId === socket.user._id.toString());
        
        if (!stillConnected) {
          // Send user:left event to remaining clients in the room
          socket.to(roomId).emit('user:left', socket.user._id.toString());
        }

        // Delete key if room is completely empty
        if (roomUsers.length === 0) {
          activeRooms.delete(roomId);
        }
      }
    };

    // Explicit leave room event
    socket.on('leave-room', ({ roomId }) => {
      leaveRoom(roomId);
    });

    // Handle chat message sending
    socket.on('chat:send', async ({ text, roomId }) => {
      if (!text || !roomId) return;

      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        // Persist message in database
        const newMessage = await Message.create({
          room: room._id,
          sender: socket.user._id,
          content: text,
          messageType: 'text',
        });

        const populatedMessage = {
          _id: newMessage._id,
          text: newMessage.content,
          createdAt: newMessage.createdAt,
          sender: {
            id: socket.user._id.toString(),
            name: socket.user.name,
            avatar: socket.user.avatar,
          },
        };

        // Broadcast chat:message to everyone in the room (including sender)
        io.in(roomId).emit('chat:message', populatedMessage);
      } catch (err) {
        console.error('Error saving or broadcasting chat message:', err);
      }
    });

    // Handle file deletion
    socket.on('file:delete', async ({ fileId, roomId }) => {
      if (!fileId || !roomId) return;

      try {
        const file = await File.findById(fileId);
        if (!file) return;

        // Perform soft delete
        file.isDeleted = true;
        file.deletedAt = new Date();
        await file.save();

        // Broadcast deletion event to all room members
        io.in(roomId).emit('file:deleted', fileId);
      } catch (err) {
        console.error('Error handling file:delete:', err);
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Disconnected: ${socket.user.name} (${socket.id})`);

      // Search all rooms and trigger leaveRoom for the socket
      for (const [roomId, roomUsers] of activeRooms.entries()) {
        if (roomUsers.some((u) => u.socketId === socket.id)) {
          leaveRoom(roomId);
        }
      }
    });
  });
};

module.exports = initializeSocket;
