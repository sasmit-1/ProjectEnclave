import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, isAuthenticated: true })
  },

  register: async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
  },

  // Runs on app start: restores the session from the saved token
  checkAuth: async () => {
    if (!localStorage.getItem('token')) {
      set({ isLoading: false })
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

export default useAuthStore
