import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Axios instance pre-configured with the backend base URL.
 * All API calls should use this instance instead of raw axios.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Automatically attach the JWT token to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handle 401 Unauthorized responses globally.
 * Logs the user out if their token is invalid or expired.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired — force logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
