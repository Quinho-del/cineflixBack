import { create } from "zustand"
import api from "../services/api"

const useFavoritesStore = create((set, get) => ({
  ids: [],
  loading: false,

  fetchIds: async () => {
    try {
      const { data } = await api.get("/movies/favorites/ids")
      set({ ids: data.ids || [] })
    } catch {
      set({ ids: [] })
    }
  },

  toggle: async (movieId) => {
    try {
      const { data } = await api.post(`/movies/${movieId}/favorite`)
      const ids = get().ids
      if (data.favorited) {
        set({ ids: [...ids, movieId] })
      } else {
        set({ ids: ids.filter((id) => id !== movieId) })
      }
      return data.favorited
    } catch (err) {
      throw err
    }
  },

  isFavorite: (movieId) => get().ids.includes(movieId),

  clear: () => set({ ids: [] }),
}))

export default useFavoritesStore
