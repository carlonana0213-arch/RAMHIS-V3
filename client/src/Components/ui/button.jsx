import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",

    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",

    danger: "bg-red-600 text-white hover:bg-red-700",

    outline:
      "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100",

    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",

    auth: "bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold shadow-xl shadow-sky-500/30",

    glass:
      "bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-5 py-3 text-sm",

    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",

        "focus:outline-none focus:ring-2 focus:ring-sky-400",

        "disabled:cursor-not-allowed disabled:opacity-60",

        variants[variant],

        sizes[size],

        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>
      )}
    </button>
  );
}
