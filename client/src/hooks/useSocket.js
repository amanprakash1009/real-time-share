import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * useSocket — manages a Socket.io connection for a specific room.
 * Automatically connects on mount, disconnects on unmount.
 *
 * @param {string|null} roomId - The room to join. Pass null to skip connection.
 * @returns {{ socket, isConnected, connectedUsers }}
 */
export const useSocket = (roomId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!roomId || !token) return;

    // Create the connection with auth token
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { roomId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room:users', (users) => {
      setConnectedUsers(users);
    });

    socket.on('user:joined', (user) => {
      setConnectedUsers((prev) => {
        if (prev.find((u) => u.id === user.id)) return prev;
        return [...prev, user];
      });
    });

    socket.on('user:left', (userId) => {
      setConnectedUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    return () => {
      socket.emit('leave-room', { roomId });
      socket.disconnect();
    };
  }, [roomId, token]);

  return {
    socket: socketRef.current,
    isConnected,
    connectedUsers,
  };
};
