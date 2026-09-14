import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlay, FaStar, FaFilm } from "react-icons/fa"
import Button from "../components/Button"
import MovieCard from "../components/MovieCard"
import api from "../services/api"
import useAuthStore from "../store/authStore"
import useFavoritesStore from "../store/favoritesStore"

const Home = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { ids, toggle, fetchIds } = useFavoritesStore()

  useEffect(() => {
    if (isAuthenticated()) fetchIds()
  }, [isAuthenticated, fetchIds])

  useEffect(() => {
    api
      .get("/movies?sort=rating")
      .then(({ data }) => setMovies(data.movies || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [])

  const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const avgRating =
    movies.length > 0
      ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)
      : "—"

  const handleToggleFavorite = async (id) => {
    if (!isAuthenticated()) {
      alert("Faça login para favoritar filmes")
      return
    }
    try {
      await toggle(id)
    } catch {
      alert("Erro ao atualizar favorito")
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-[#3b82f6] font-semibold mb-3 flex items-center gap-2">
              <FaFilm /> Catálogo profissional de filmes
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Descubra o cinema que{" "}
              <span className="text-[#3b82f6]">você ama</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Explore nossa seleção de clássicos e sucessos modernos. Filtre por
              gênero, busque por título e salve seus favoritos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/filmes">
                <Button variant="primary" icon={FaPlay}>
                  Ver catálogo
                </Button>
              </Link>
              <Link to="/sobre">
                <Button variant="ghost">Sobre o projeto</Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
            <div className="bg-[#111827] border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#38bdf8]">
                {loading ? "..." : movies.length}
              </p>
              <p className="text-zinc-400 text-sm">Filmes</p>
            </div>
            <div className="bg-[#111827] border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#38bdf8] flex items-center justify-center gap-1">
                <FaStar className="text-lg" /> {avgRating}
              </p>
              <p className="text-zinc-400 text-sm">Nota média</p>
            </div>
            <div className="bg-[#111827] border border-zinc-800 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold text-[#38bdf8]">{ids.length}</p>
              <p className="text-zinc-400 text-sm">Favoritos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mais bem avaliados</h2>
          <Link
            to="/filmes"
            className="text-[#3b82f6] text-sm font-medium hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map((movie) => (
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
        )}
      </section>
    </div>
  )
}

export default Home
