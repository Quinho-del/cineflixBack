import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { z } from "zod"
import { FaSave, FaArrowLeft } from "react-icons/fa"
import Button from "../components/Button"
import api from "../services/api"

const schema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").max(150),
  year: z.coerce.number().int().min(1888, "Ano inválido").max(new Date().getFullYear() + 2),
  rating: z.coerce.number().min(0).max(10),
  duration: z.string().min(2, "Duração é obrigatória"),
  poster: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(2000),
  director: z.string().min(2, "Diretor é obrigatório").max(100),
  category_id: z.coerce.number().int().positive("Selecione uma categoria"),
})

const MovieForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    rating: 0,
    duration: "",
    poster: "",
    description: "",
    director: "",
    category_id: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories || []))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/movies/${id}`)
      .then(({ data }) => {
        const m = data.movie
        setForm({
          title: m.title,
          year: m.year,
          rating: m.rating,
          duration: m.duration,
          poster: m.poster || "",
          description: m.description,
          director: m.director,
          category_id: m.category_id,
        })
      })
      .catch(() => setServerError("Filme não encontrado"))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)
    const parsed = schema.safeParse({
      ...form,
      category_id: form.category_id === "" ? undefined : Number(form.category_id),
      year: Number(form.year),
      rating: Number(form.rating),
    })
    if (!parsed.success) {
      const fieldErrors = {}
      parsed.error.issues.forEach((iss) => {
        if (!fieldErrors[iss.path[0]]) fieldErrors[iss.path[0]] = iss.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/movies/${id}`, parsed.data)
      } else {
        await api.post("/movies", parsed.data)
      }
      navigate("/admin/filmes")
    } catch (err) {
      const msg = err.response?.data?.message
      const errs = err.response?.data?.errors
      if (errs) setErrors(errs)
      else setServerError(msg || "Erro ao salvar")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-[#0a0f1a] border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-zinc-700 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
    }`

  if (fetching) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-zinc-400">Carregando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/admin/filmes"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
      >
        <FaArrowLeft /> Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-6">{isEdit ? "Editar filme" : "Novo filme"}</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#111827] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5"
      >
        {serverError && (
          <div className="bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Título *</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass("title")} />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ano *</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} className={inputClass("year")} />
            {errors.year && <p className="mt-1 text-sm text-red-400">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nota (0-10) *</label>
            <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} className={inputClass("rating")} />
            {errors.rating && <p className="mt-1 text-sm text-red-400">{errors.rating}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Duração *</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="2h 30min" className={inputClass("duration")} />
            {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Diretor *</label>
          <input name="director" value={form.director} onChange={handleChange} className={inputClass("director")} />
          {errors.director && <p className="mt-1 text-sm text-red-400">{errors.director}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Categoria *</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass("category_id")}>
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-400">{errors.category_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">URL do Poster</label>
          <input name="poster" value={form.poster} onChange={handleChange} placeholder="https://..." className={inputClass("poster")} />
          {errors.poster && <p className="mt-1 text-sm text-red-400">{errors.poster}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Descrição *</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} className={inputClass("description") + " resize-y"} />
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        </div>

        <Button type="submit" variant="primary" className="w-full" icon={FaSave} loading={loading}>
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar filme"}
        </Button>
      </form>
    </div>
  )
}

export default MovieForm
