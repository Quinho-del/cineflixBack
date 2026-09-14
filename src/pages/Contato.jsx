import ContactForm from "../components/ContactForm"
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa"

const Contato = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Fale conosco</h1>
        <p className="text-zinc-400">
          Sugestões de filmes, dúvidas ou parcerias? Envie sua mensagem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-[#111827] border border-zinc-800 rounded-xl p-5 flex gap-4">
            <div className="text-[#3b82f6] text-xl mt-1">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="font-semibold">E-mail</h3>
              <p className="text-zinc-400 text-sm">contato@cineflix.com</p>
            </div>
          </div>
          <div className="bg-[#111827] border border-zinc-800 rounded-xl p-5 flex gap-4">
            <div className="text-[#3b82f6] text-xl mt-1">
              <FaPhone />
            </div>
            <div>
              <h3 className="font-semibold">Telefone</h3>
              <p className="text-zinc-400 text-sm">(11) 4002-8922</p>
            </div>
          </div>
          <div className="bg-[#111827] border border-zinc-800 rounded-xl p-5 flex gap-4">
            <div className="text-[#3b82f6] text-xl mt-1">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="font-semibold">Localização</h3>
              <p className="text-zinc-400 text-sm">São Paulo, Brasil</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

export default Contato
