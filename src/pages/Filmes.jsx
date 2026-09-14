import { useState, useEffect, useMemo } from "react"
import { FaFilter, FaSortAmountDown } from "react-icons/fa"
import MovieCard from "../components/MovieCard"
import SearchBar from "../components/SearchBar"
import api from "../services/api"
import useAuthStore from "../store/authStore"
import useFavoritesStore from "../store/favoritesStore"

const Filmes = ({ onlyFavorites = false }) => {
  const [movies, setMovies] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("Todos")
  const [sortBy, setSortBy] = useState("rating")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { ids, toggle, fetchIds } = useFavoritesStore()

  useEffect(() => {
    if (isAuthenticated()) fetchIds()
  }, [isAuthenticated, fetchIds])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        if (onlyFavorites) {
          const { data } = await api.get("/movies/favorites")
          setMovies(data.movies || [])
        } else {
          const params = new URLSearchParams()
          if (search.trim()) params.set("search", search.trim())
          if (genre !== "Todos") params.set("category", genre)
          params.set("sort", sortBy)
          const { data } = await api.get(`/movies?${params}`)
          setMovies(data.movies || [])
        }
      } catch (err) {
        setError(err.response?.data?.message || "Erro ao carregar filmes")
        setMovies([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [onlyFavorites, search, genre, sortBy])

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  const genreOptions = useMemo(
    () => ["Todos", ...categories.map((c) => c.name)],
    [categories]
  )

  const handleToggleFavorite = async (id) => {
    if (!isAuthenticated()) {
      alert("Faça login para favoritar filmes")
      return
    }
    try {
      await toggle(id)
      if (onlyFavorites) {
        setMovies((prev) => prev.filter((m) => m.id !== id))
      }
    } catch {
      alert("Erro ao atualizar favorito")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {onlyFavorites ? "Meus Favoritos" : "Catálogo de Filmes"}
        </h1>
        <p className="text-zinc-400">
          {onlyFavorites
            ? "Filmes que você marcou como favoritos."
            : "Busque, filtre e explore nossa seleção."}
        </p>
      </div>

      {!onlyFavorites && (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center">
          <SearchBar value={search} onChange={setSearch} />

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-[#111827] border border-zinc-700 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer"
              >
                {genreOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#111827] border border-zinc-700 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer"
              >
                <option value="rating">Nota</option>
                <option value="year">Ano</option>
                <option value="title">Título A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-xl">Carregando...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">
          <p className="text-xl mb-2">{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-xl mb-2">Nenhum filme encontrado</p>
          <p className="text-sm">
            {onlyFavorites
              ? "Adicione filmes aos favoritos clicando no coração."
              : "Tente alterar a busca ou o filtro de gênero."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-zinc-500 text-sm mb-4">
            {movies.length} filme{movies.length !== 1 ? "s" : ""} encontrado
            {movies.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,
                  genre: movie.category_name || movie.genre,
                }}
                isFavorite={ids.includes(movie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Filmes
