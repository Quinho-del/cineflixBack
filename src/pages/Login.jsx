import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { z } from "zod"
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa"
import Button from "../components/Button"
import useAuthStore from "../store/authStore"
import useFavoritesStore from "../store/favoritesStore"

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"

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
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((iss) => {
        if (!fieldErrors[iss.path[0]]) fieldErrors[iss.path[0]] = iss.message
      })
      setErrors(fieldErrors)
      return
    }

    const res = await login(form.email, form.password)
    if (res.success) {
      await useFavoritesStore.getState().fetchIds()
      navigate(from, { replace: true })
    }
  }

  const inputClass = (field) =>
    `w-full bg-[#0a0f1a] border rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-zinc-700 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
    }`

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Entrar</h1>
        <p className="text-zinc-400">Acesse sua conta CineFlix</p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#111827] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5"
      >
        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={inputClass("email")}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass("password")}
              autoComplete="current-password"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full" icon={FaSignInAlt} loading={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-zinc-400">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-[#3b82f6] hover:underline">
            Cadastre-se
          </Link>
        </p>

        <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4 space-y-1">
          <p>
            <strong>Admin:</strong> admin@cineflix.com / admin123
          </p>
          <p>
            <strong>User:</strong> user@cineflix.com / user123
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
