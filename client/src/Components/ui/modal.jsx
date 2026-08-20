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

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
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
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={() => {
        if (closeOnOverlay) {
          onClose?.();
        }
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          `
            flex w-full flex-col
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-2xl
            ring-1 ring-slate-200/80
            animate-in fade-in zoom-in duration-200
          `,
          `
            max-h-[calc(100vh-2rem)]
            sm:max-h-[calc(100vh-3rem)]
          `,
          sizes[size]
        )}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-4">
            {title && (
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl
              border border-slate-200
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
            "
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-white
            p-5
            sm:p-6
          "
        >
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div
            className="
              flex shrink-0 flex-wrap justify-end gap-3
              border-t border-slate-200
              bg-white
              px-5 py-4
              sm:px-6 sm:py-5
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}