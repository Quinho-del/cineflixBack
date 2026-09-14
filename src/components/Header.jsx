import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  FaFilm,
  FaHome,
  FaVideo,
  FaInfoCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaHeart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
  FaPlus,
  FaTags,
  FaUser,
} from "react-icons/fa"
import useAuthStore from "../store/authStore"
import useFavoritesStore from "../store/favoritesStore"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
  const favoritesCount = useFavoritesStore((s) => s.ids.length)

  const handleLogout = () => {
    logout()
    useFavoritesStore.getState().clear()
    setMenuOpen(false)
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/filmes", label: "Filmes", icon: FaVideo },
    ...(isAuthenticated()
      ? [{ path: "/favoritos", label: "Favoritos", icon: FaHeart }]
      : []),
    { path: "/sobre", label: "Sobre", icon: FaInfoCircle },
    { path: "/contato", label: "Contato", icon: FaEnvelope },
  ]

  if (isAdmin()) {
    navItems.push(
      { path: "/admin/filmes", label: "Gerenciar", icon: FaUserShield },
      { path: "/admin/categorias", label: "Categorias", icon: FaTags }
    )
  }

  const NavButton = ({ path, label, icon: Icon }) => (
    <Link
      to={path}
      onClick={() => setMenuOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(path)
          ? "bg-[#3b82f6] text-white"
          : "text-zinc-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon />
      {label}
      {path === "/favoritos" && favoritesCount > 0 && (
        <span className="ml-1 bg-[#38bdf8] text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
          {favoritesCount}
        </span>
      )}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#3b82f6] font-bold text-xl hover:opacity-90 transition"
          >
            <FaFilm className="text-2xl" />
            <span>
              Cine<span className="text-white">Flix</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavButton key={item.path} {...item} />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FaUser className="text-[#3b82f6]" />
                  {user?.name}
                  {isAdmin() && (
                    <span className="text-xs bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition"
                >
                  <FaSignOutAlt /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
                >
                  <FaSignInAlt /> Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#3b82f6] text-white hover:bg-blue-600 transition"
                >
                  <FaPlus /> Cadastrar
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0f1a]">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  isActive(path)
                    ? "bg-[#3b82f6] text-white"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                <Icon />
                {label}
                {path === "/favoritos" && favoritesCount > 0 && (
                  <span className="ml-auto bg-[#38bdf8] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            ))}
            <div className="border-t border-zinc-800 mt-2 pt-2">
              {isAuthenticated() ? (
                <>
                  <p className="px-4 py-2 text-sm text-zinc-400">
                    {user?.name} {isAdmin() && "(Admin)"}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-white/10 w-full"
                  >
                    <FaSignOutAlt /> Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-white/10"
                  >
                    <FaSignInAlt /> Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-white/10"
                  >
                    <FaPlus /> Cadastrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
