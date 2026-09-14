import { FaFilm, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#111827] border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-[#3b82f6] font-bold text-xl mb-3">
              <FaFilm />
              <span>
                Cine<span className="text-white">Flix</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Seu catálogo de filmes favoritos. Descubra, filtre e salve as
              melhores produções do cinema mundial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Home</li>
              <li>Filmes</li>
              <li>Favoritos</li>
              <li>Sobre</li>
              <li>Contato</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contato</h4>
            <div className="flex gap-4 text-zinc-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#3b82f6] transition"
                aria-label="GitHub"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#3b82f6] transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href="mailto:contato@cineflix.com"
                className="hover:text-[#3b82f6] transition"
                aria-label="E-mail"
              >
                <FaEnvelope size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          © {year} CineFlix. Projeto acadêmico — Sprint React.
        </div>
      </div>
    </footer>
  )
}

export default Footer
