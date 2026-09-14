import { Link } from "react-router-dom"
import { FaStar, FaClock, FaHeart, FaRegHeart, FaPlay } from "react-icons/fa"
import Button from "./Button"

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const { id, title, year, genre, rating, duration, poster, director } = movie

  return (
    <article className="group bg-[#111827] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#3b82f6]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#3b82f6]/10 flex flex-col">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <img
          src={poster}
          alt={`Poster de ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450/111827/3b82f6?text=CineFlix"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <Link to={`/filmes/${id}`}>
            <Button variant="primary" className="text-sm px-3 py-2" icon={FaPlay}>
              Detalhes
            </Button>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-[#3b82f6] transition-colors text-white"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {isFavorite ? (
            <FaHeart className="text-[#3b82f6] text-lg" />
          ) : (
            <FaRegHeart className="text-lg" />
          )}
        </button>
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-[#38bdf8] text-sm font-bold">
          <FaStar className="text-xs" />
          {rating}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#3b82f6] transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm">
          {year} · {genre}
        </p>
        <p className="text-zinc-500 text-xs flex items-center gap-1">
          <FaClock /> {duration}
        </p>
        <p className="text-zinc-500 text-xs mt-auto">Dir. {director}</p>
      </div>
    </article>
  )
}

export default MovieCard
