import { create } from "zustand"
import api from "../services/api"

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("cineflix_user") || "null")
  } catch {
    return null
  }
})()

const useAuthStore = create((set, get) => ({
  user: savedUser,
  token: localStorage.getItem("cineflix_token") || null,
  loading: false,
  error: null,

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === "admin",

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post("/auth/login", { email, password })
      localStorage.setItem("cineflix_token", data.token)
      localStorage.setItem("cineflix_user", JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return { success: true }
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao fazer login"
      set({ loading: false, error: message })
      return { success: false, message }
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      })
      localStorage.setItem("cineflix_token", data.token)
      localStorage.setItem("cineflix_user", JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return { success: true }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors
          ? Object.values(err.response.data.errors || {}).join(", ")
          : "Erro ao cadastrar"
      set({ loading: false, error: message })
      return { success: false, message, errors: err.response?.data?.errors }
    }
  },

  logout: () => {
    localStorage.removeItem("cineflix_token")
    localStorage.removeItem("cineflix_user")
    set({ user: null, token: null, error: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
