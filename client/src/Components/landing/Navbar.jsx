import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import ramhisLogo from "../../assets/images/ramhislogo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Organization",
      path: "/organization",
    },
    {
      name: "RAMHIS",
      path: "/ramhis",
    },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-2xl border border-white/15 bg-blue-950/75 px-5 py-3 shadow-xl shadow-blue-950/20 backdrop-blur-xl">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <img
              src={ramhisLogo}
              alt="RAMHIS"
              className="h-10 w-auto object-contain"
            />

            <div className="hidden sm:block">
              <p className="text-lg font-bold leading-none text-white">
                RAMHIS
              </p>

              <p className="mt-1 text-[10px] font-medium leading-none text-blue-200">
                Remote Area Medical Health Information System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/login"
              className="ml-3 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-blue-950 shadow-lg shadow-sky-500/20 transition-all duration-200 hover:bg-sky-300 hover:shadow-sky-400/30"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 md:hidden"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/15 bg-blue-950/95 p-3 shadow-xl backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mt-2 rounded-xl bg-sky-400 px-4 py-3 text-center text-sm font-bold text-blue-950 transition hover:bg-sky-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
