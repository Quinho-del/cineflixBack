import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa"
import Button from "../components/Button"
import useAuthStore from "../store/authStore"

const schema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(80),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

const Cadastro = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

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

    const res = await register(form.name, form.email, form.password)
    if (res.success) {
      navigate("/")
    } else if (res.errors) {
      setErrors(res.errors)
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
        <h1 className="text-3xl font-bold mb-2">Criar conta</h1>
        <p className="text-zinc-400">Cadastre-se no CineFlix</p>
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
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Nome *
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className={inputClass("name")}
            />
          </div>
          {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
            E-mail *
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
            />
          </div>
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Senha *
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={inputClass("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-zinc-300 mb-1.5"
          >
            Confirmar senha *
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repita a senha"
              className={inputClass("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full" icon={FaUserPlus} loading={loading}>
          {loading ? "Cadastrando..." : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-zinc-400">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#3b82f6] hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Cadastro
