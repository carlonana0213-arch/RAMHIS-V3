import clsx from "clsx";

function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
  padding = true,
}) {
  const variants = {
    default: "bg-white border border-slate-200 shadow-lg",

    glass:
      "bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,.30)]",

    auth: "bg-slate-900/45 backdrop-blur-3xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,.55)]",
  };

  return (
    <div
      className={clsx(
        "rounded-3xl transition-all duration-300",
        variants[variant],
        padding && "p-8",
        hover && "hover:-translate-y-1 hover:shadow-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Header({ children, className = "" }) {
  return <div className={clsx("mb-8", className)}>{children}</div>;
}

function Body({ children, className = "" }) {
  return <div className={clsx("space-y-6", className)}>{children}</div>;
}

function Footer({ children, className = "" }) {
  return (
    <div className={clsx("mt-8 border-t border-white/10 pt-6", className)}>
      {children}
    </div>
  );
}

function Title({ children, className = "" }) {
  return (
    <h1
      className={clsx(
        "text-3xl font-bold tracking-tight text-white",
        className,
      )}
    >
      {children}
    </h1>
  );
}

function Subtitle({ children, className = "" }) {
  return <p className={clsx("mt-2 text-blue-100", className)}>{children}</p>;
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
Card.Title = Title;
Card.Subtitle = Subtitle;

export default Card;
