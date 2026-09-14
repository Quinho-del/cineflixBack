import { FaSpinner } from "react-icons/fa"

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1a] disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-[#3b82f6] hover:bg-blue-600 text-white focus:ring-[#3b82f6]",
    secondary:
      "bg-[#111827] hover:bg-zinc-700 text-white border border-zinc-600 focus:ring-zinc-500",
    gold: "bg-[#38bdf8] hover:bg-sky-400 text-black focus:ring-[#38bdf8]",
    ghost:
      "bg-transparent hover:bg-white/10 text-white border border-white/20 focus:ring-white/30",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        Icon && <Icon className="text-lg" />
      )}
      {children}
    </button>
  )
}

export default Button
