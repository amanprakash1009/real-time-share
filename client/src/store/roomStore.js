import { create } from 'zustand';

/**
 * roomStore — manages room data, files, chat messages, and activity.
 */
export const useRoomStore = create((set, get) => ({
  // Room state
  room: null,
  files: [],
  messages: [],
  activity: [],
  isLoading: false,
  uploadProgress: {}, // { [fileId]: 0-100 }

  setRoom: (room) => set({ room }),

  setFiles: (files) => set({ files }),

  addFile: (file) =>
    set((state) => ({ files: [file, ...state.files] })),

  removeFile: (fileId) =>
    set((state) => ({ files: state.files.filter((f) => f._id !== fileId) })),

  updateUploadProgress: (fileId, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileId]: progress },
    })),

  clearUploadProgress: (fileId) =>
    set((state) => {
      const next = { ...state.uploadProgress };
      delete next[fileId];
      return { uploadProgress: next };
    }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setMessages: (messages) => set({ messages }),

  addActivity: (event) =>
    set((state) => ({
      activity: [event, ...state.activity].slice(0, 50), // cap at 50 events
    })),

  setIsLoading: (val) => set({ isLoading: val }),

  reset: () =>
    set({ room: null, files: [], messages: [], activity: [], uploadProgress: {}, isLoading: false }),
}));
