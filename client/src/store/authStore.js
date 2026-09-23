import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
