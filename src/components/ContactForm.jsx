import { useState } from "react"
import { z } from "zod"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa"
import Button from "./Button"

const contactSchema = z.object({
  nome: z
    .string()
    .min(3, "Digite um nome com pelo menos 3 caracteres.")
    .max(80, "Nome muito longo."),
  email: z.string().email("Informe um e-mail válido."),
  telefone: z
    .string()
    .min(10, "Informe um telefone válido com DDD.")
    .regex(/^[\d\s()-]+$/, "Use apenas números e caracteres de telefone."),
  assunto: z.string().min(1, "Selecione um assunto válido."),
  mensagem: z
    .string()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(500, "Mensagem muito longa (máx. 500 caracteres)."),
})

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
}

const ContactForm = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(false)

    const result = contactSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors = {}
      const issues = result.error?.issues || result.error?.errors || []
      issues.forEach((err) => {
        const field = err.path[0]
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setForm(initialForm)
    }, 900)
  }

  const inputClass = (field) =>
    `w-full bg-[#0a0f1a] border rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-zinc-700 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
    }`

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#111827] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 max-w-xl mx-auto"
    >
      {success && (
        <div className="flex items-center gap-3 bg-green-900/40 border border-green-600 text-green-300 px-4 py-3 rounded-lg">
          <FaCheckCircle className="text-xl shrink-0" />
          <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Nome *
        </label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className={inputClass("nome")}
          />
        </div>
        {errors.nome && <p className="mt-1.5 text-sm text-red-400">{errors.nome}</p>}
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
        <label htmlFor="telefone" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Telefone *
        </label>
        <div className="relative">
          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="telefone"
            name="telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            className={inputClass("telefone")}
          />
        </div>
        {errors.telefone && (
          <p className="mt-1.5 text-sm text-red-400">{errors.telefone}</p>
        )}
      </div>

      <div>
        <label htmlFor="assunto" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Assunto *
        </label>
        <select
          id="assunto"
          name="assunto"
          value={form.assunto}
          onChange={handleChange}
          className={`w-full bg-[#0a0f1a] border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 transition ${
            errors.assunto
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-700 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
          }`}
        >
          <option value="">Selecione...</option>
          <option value="duvida">Dúvida</option>
          <option value="sugestao">Sugestão de filme</option>
          <option value="parceria">Parceria</option>
          <option value="outro">Outro</option>
        </select>
        {errors.assunto && (
          <p className="mt-1.5 text-sm text-red-400">{errors.assunto}</p>
        )}
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Mensagem *
        </label>
        <div className="relative">
          <FaComment className="absolute left-4 top-4 text-zinc-500" />
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            value={form.mensagem}
            onChange={handleChange}
            placeholder="Escreva sua mensagem..."
            className={`w-full bg-[#0a0f1a] border rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition resize-y ${
              errors.mensagem
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-700 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            }`}
          />
        </div>
        {errors.mensagem && (
          <p className="mt-1.5 text-sm text-red-400">{errors.mensagem}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        icon={FaPaperPlane}
        loading={loading}
      >
        {loading ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  )
}

export default ContactForm
