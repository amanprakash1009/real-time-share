import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

/**
 * Zustand auth store with localStorage persistence.
 * Manages user authentication state, token, and async actions.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /**
       * Register a new user account.
       * @param {{ name: string, email: string, password: string }} data
       */
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);
          const { token, user } = response.data;
          set({ user, token, isLoading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message =
            error.response?.data?.message || 'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      /**
       * Log in an existing user.
       * @param {{ email: string, password: string }} data
       */
      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', data);
          const { token, user } = response.data;
          set({ user, token, isLoading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message =
            error.response?.data?.message || 'Login failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      /**
       * Fetch the currently authenticated user profile from the server.
       */
      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      /**
       * Clear auth state and remove persisted data.
       */
      logout: () => {
        set({ user: null, token: null, error: null, isLoading: false });
      },

      /**
       * Clear any lingering error messages.
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist user and token, not UI state
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
