import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaEdit, FaTrash, FaStar } from "react-icons/fa"
import Button from "../components/Button"
import api from "../services/api"

const AdminMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get("/movies?sort=title&order=asc")
      .then(({ data }) => setMovies(data.movies || []))
      .catch((err) => setError(err.response?.data?.message || "Erro ao carregar"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Excluir "${title}"?`)) return
    try {
      await api.delete(`/movies/${id}`)
      setMovies((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao excluir")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Gerenciar Filmes</h1>
          <p className="text-zinc-400">CRUD completo — apenas administradores</p>
        </div>
        <Link to="/admin/filmes/novo">
          <Button variant="primary" icon={FaPlus}>
            Novo filme
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : movies.length === 0 ? (
        <p className="text-zinc-400">Nenhum filme cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left">
            <thead className="bg-[#111827] text-zinc-400 text-sm">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3 hidden sm:table-cell">Ano</th>
                <th className="px-4 py-3 hidden md:table-cell">Categoria</th>
                <th className="px-4 py-3">Nota</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {movies.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium">{m.title}</td>
                  <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{m.year}</td>
                  <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">
                    {m.category_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-[#38bdf8]">
                      <FaStar className="text-xs" /> {m.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/filmes/${m.id}/editar`}
                        className="p-2 rounded-lg text-zinc-400 hover:text-[#3b82f6] hover:bg-white/10 transition"
                        title="Editar"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.title)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/10 transition"
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminMovies
