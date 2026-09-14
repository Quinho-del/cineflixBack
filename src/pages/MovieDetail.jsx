import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FaStar, FaClock, FaHeart, FaRegHeart, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"
import Button from "../components/Button"
import api from "../services/api"
import useAuthStore from "../store/authStore"
import useFavoritesStore from "../store/favoritesStore"

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated, isAdmin } = useAuthStore()
  const { ids, toggle, fetchIds } = useFavoritesStore()

  useEffect(() => {
    if (isAuthenticated()) fetchIds()
  }, [isAuthenticated, fetchIds])

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then(({ data }) => setMovie(data.movie))
      .catch((err) => setError(err.response?.data?.message || "Filme não encontrado"))
      .finally(() => setLoading(false))
  }, [id])

  const handleToggle = async () => {
    if (!isAuthenticated()) {
      alert("Faça login para favoritar")
      return
    }
    try {
      await toggle(Number(id))
    } catch {
      alert("Erro ao atualizar favorito")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este filme?")) return
    try {
      await api.delete(`/movies/${id}`)
      navigate("/filmes")
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao excluir")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-zinc-400">
        Carregando...
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 text-xl mb-4">{error || "Filme não encontrado"}</p>
        <Link to="/filmes" className="text-[#3b82f6] hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const isFav = ids.includes(movie.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/filmes"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
      >
        <FaArrowLeft /> Voltar
      </Link>

      <div className="bg-[#111827] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-56 sm:h-80 object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400/111827/3b82f6?text=CineFlix"
            }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {movie.year} · {movie.category_name} · Dir. {movie.director}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#38bdf8] font-bold text-lg">
                <FaStar /> {movie.rating}
              </span>
              <span className="flex items-center gap-1 text-zinc-400 text-sm">
                <FaClock /> {movie.duration}
              </span>
            </div>
          </div>

          <p className="text-zinc-300 leading-relaxed">{movie.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant={isFav ? "gold" : "secondary"}
              icon={isFav ? FaHeart : FaRegHeart}
              onClick={handleToggle}
            >
              {isFav ? "Nos favoritos" : "Adicionar aos favoritos"}
            </Button>

            {isAdmin() && (
              <>
                <Link to={`/admin/filmes/${movie.id}/editar`}>
                  <Button variant="ghost" icon={FaEdit}>
                    Editar
                  </Button>
                </Link>
                <Button variant="ghost" icon={FaTrash} onClick={handleDelete}>
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail
