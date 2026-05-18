import api from './api';

/**
 * Service to handle all room-related API operations.
 */
const roomService = {
  /**
   * Create a new collaboration room.
   * @returns {Promise<{ success: boolean, roomId: string, roomLink: string, expiresAt: string }>}
   */
  createRoom: async () => {
    try {
      const response = await api.post('/rooms/create');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create room. Please try again.';
      throw new Error(message);
    }
  },

  /**
   * Get room details and automatically join if not already a member.
   * @param {string} roomId - The unique room ID/slug.
   * @returns {Promise<{ success: boolean, room: { roomId: string, owner: object, members: Array, createdAt: string, expiresAt: string } }>}
   */
  getRoom: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join room or room does not exist.';
      throw new Error(message);
    }
  },
};

export default roomService;
