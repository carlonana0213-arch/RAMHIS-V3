import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-7xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={() => closeOnOverlay && onClose?.()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200",
          sizes[size],
        )}
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">{children}</div>

        {/* Footer */}

        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
