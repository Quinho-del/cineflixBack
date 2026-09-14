import { FaSearch, FaTimes } from "react-icons/fa"

const SearchBar = ({ value, onChange, placeholder = "Buscar filmes..." }) => {
  return (
    <div className="relative w-full max-w-md">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111827] border border-zinc-700 rounded-xl pl-11 pr-10 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
          aria-label="Limpar busca"
        >
          <FaTimes />
        </button>
      )}
    </div>
  )
}

export default SearchBar
