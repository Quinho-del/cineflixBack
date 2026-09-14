import {
  FaReact,
  FaCode,
  FaMobileAlt,
  FaShieldAlt,
  FaUsers,
  FaUser,
} from "react-icons/fa"

const features = [
  {
    icon: FaReact,
    title: "React + Vite",
    text: "Aplicação moderna com componentização, props, estado e eventos.",
  },
  {
    icon: FaCode,
    title: "JavaScript moderno",
    text: "Arrow functions, map, filter, reduce, destructuring e template literals.",
  },
  {
    icon: FaMobileAlt,
    title: "Responsivo",
    text: "Layout adaptável para celular e desktop com Tailwind CSS.",
  },
  {
    icon: FaShieldAlt,
    title: "Validação Zod",
    text: "Formulário de contato com validação robusta e mensagens claras.",
  },
]

const membros = [
  { nome: "Alexandre", papel: "Desenvolvimento" },
  { nome: "Marcos", papel: "Desenvolvimento" },
  { nome: "Pablo", papel: "Desenvolvimento" },
  { nome: "Leide", papel: "Desenvolvimento" },
  { nome: "Giovanna", papel: "Desenvolvimento" },
]

const Sobre = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Sobre o CineFlix</h1>
      <p className="text-zinc-400 text-lg leading-relaxed mb-10">
        O <strong className="text-white">CineFlix</strong> é um catálogo de
        filmes desenvolvido como projeto da Sprint Única de React. O objetivo é
        demonstrar interface profissional, componentes reutilizáveis,
        interatividade e boas práticas de organização de código.
      </p>

      {/* The Definers */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-xl">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-2xl font-bold">The Definers</h2>
            <p className="text-zinc-400 text-sm">Equipe responsável pelo projeto</p>
          </div>
        </div>

        <p className="text-zinc-400 leading-relaxed mb-6">
          O CineFlix foi criado pelo grupo <strong className="text-white">The Definers</strong>,
          formado por estudantes unidos para transformar o conhecimento de React em
          uma aplicação web completa e profissional. Cada integrante contribuiu com
          ideias, código e atenção aos detalhes para entregar um produto que
          pareça de verdade.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membros.map(({ nome, papel }) => (
            <div
              key={nome}
              className="bg-[#111827] border border-zinc-800 rounded-xl p-5 flex items-center gap-4 hover:border-[#3b82f6]/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center text-lg shrink-0">
                <FaUser />
              </div>
              <div>
                <h3 className="font-bold text-white">{nome}</h3>
                <p className="text-zinc-500 text-sm">{papel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-[#111827] border border-zinc-800 rounded-xl p-6"
          >
            <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center mb-4 text-xl">
              <Icon />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-zinc-800 rounded-xl p-6">
        <h2 className="font-bold text-xl mb-3">Tecnologias utilizadas</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            "React",
            "Vite",
            "JavaScript",
            "Tailwind CSS",
            "Zod",
            "React Icons",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 bg-zinc-800 rounded-full text-sm text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sobre
