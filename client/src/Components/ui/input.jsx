import clsx from "clsx";

export default function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  variant = "default",
  className = "",
  type = "text",
  disabled = false,
  required = false,
  ...props
}) {
  const variants = {
    default: {
      input:
        "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-200",
      label: "text-slate-700",
      helper: "text-slate-500",
      icon: "text-slate-400",
    },

    auth: {
      input:
        "bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-blue-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30",

      label: "text-white font-medium",

      helper: "text-blue-200",

      icon: "text-blue-200",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className="w-full">
      {label && (
        <label className={clsx("mb-2 block text-sm font-medium", style.label)}>
          {label}

          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div
            className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2",
              style.icon,
            )}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          disabled={disabled}
          className={clsx(
            "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 outline-none",

            leftIcon && "pl-12",

            rightIcon && "pr-12",

            style.input,

            error && "border-red-500 focus:border-red-500 focus:ring-red-300",

            disabled && "cursor-not-allowed opacity-60",

            className,
          )}
          {...props}
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={clsx(
              "absolute right-4 top-1/2 -translate-y-1/2 transition-colors",

              onRightIconClick
                ? "cursor-pointer hover:text-sky-300"
                : "cursor-default",

              style.icon,
            )}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {helperText && !error && (
        <p className={clsx("mt-2 text-xs", style.helper)}>{helperText}</p>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
