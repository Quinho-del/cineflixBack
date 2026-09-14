import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import Button from "../components/Button"
import api from "../services/api"

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: "", description: "" })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const startCreate = () => {
    setEditing("new")
    setForm({ name: "", description: "" })
    setErrors({})
  }

  const startEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, description: cat.description || "" })
    setErrors({})
  }

  const cancel = () => {
    setEditing(null)
    setForm({ name: "", description: "" })
    setErrors({})
  }

  const handleSave = async () => {
    setErrors({})
    if (!form.name || form.name.length < 2) {
      setErrors({ name: "Nome deve ter pelo menos 2 caracteres" })
      return
    }
    setSaving(true)
    try {
      if (editing === "new") {
        await api.post("/categories", form)
      } else {
        await api.put(`/categories/${editing}`, form)
      }
      cancel()
      load()
    } catch (err) {
      const msg = err.response?.data?.message
      const errs = err.response?.data?.errors
      if (errs) setErrors(errs)
      else setErrors({ name: msg || "Erro ao salvar" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir categoria "${name}"?`)) return
    try {
      await api.delete(`/categories/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao excluir")
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Categorias</h1>
          <p className="text-zinc-400">Recurso relacionado aos filmes</p>
        </div>
        {editing === null && (
          <Button variant="primary" icon={FaPlus} onClick={startCreate}>
            Nova categoria
          </Button>
        )}
      </div>

      {editing !== null && (
        <div className="bg-[#111827] border border-zinc-800 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="font-bold">{editing === "new" ? "Nova categoria" : "Editar categoria"}</h2>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Nome *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#0a0f1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#3b82f6]"
            />
            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Descrição</label>
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-[#0a0f1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#3b82f6]"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" icon={FaSave} onClick={handleSave} loading={saving}>
              Salvar
            </Button>
            <Button variant="ghost" icon={FaTimes} onClick={cancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-[#111827] border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-zinc-500 text-sm">
                  {c.description || "Sem descrição"} · {c.movie_count || 0} filme(s)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-[#3b82f6] hover:bg-white/10"
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/10"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminCategories
