import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import background from "../assets/images/ramhis-login-banner.png";
import ramhisLogo from "../assets/images/ramhis-logo-w.png";

export default function AuthLayout({ children }) {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-blue-950 bg-cover bg-center bg-no-repeat selection:bg-blue-500 selection:text-white"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Dynamic Background Overlays for Visual Depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/65 to-blue-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-blue-950/30" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Return Home Button */}
      <Link
        to="/"
        className="
          group
          absolute
          left-6
          top-6
          z-30
          flex
          items-center
          gap-2.5
          rounded-full
          border
          border-white/15
          bg-blue-950/50
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          shadow-xl
          shadow-black/20
          backdrop-blur-md
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-white/30
          hover:bg-blue-900/70
          hover:shadow-blue-900/30
          active:translate-y-0
        "
      >
        <ArrowLeft
          size={18}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        <span>Return Home</span>
      </Link>

      {/* Main Content Layout Container */}
      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          flex-col
          justify-center
          px-6
          pt-24
          pb-12

          sm:px-10
          sm:pt-28

          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:px-16
          lg:py-12

          xl:px-20
        "
      >
        {/* LEFT BRANDING */}
        <div
          className="
            w-full
            max-w-2xl
            mb-8

            lg:mb-0
            lg:w-[48%]
            lg:-translate-y-8
            xl:w-[46%]
          "
        >
          {/* Main Hero Card Glass Container */}
          <div className="rounded-3xl border border-white/10 bg-blue-950/30 p-6 backdrop-blur-md sm:p-8">
            {/* Logo + Name */}
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Logo with Glow Effect */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-lg" />
                <img
                  src={ramhisLogo}
                  alt="RAMHIS Logo"
                  className="
                    relative
                    h-auto
                    w-20
                    drop-shadow-2xl

                    sm:w-24
                    md:w-28
                    lg:w-32
                    xl:w-36
                  "
                />
              </div>

              {/* Divider */}
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent sm:h-20" />

              {/* RAMHIS Name & Subtitle */}
              <div className="min-w-0">
                <h1
                  className="
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-white
                    drop-shadow-md

                    sm:text-4xl
                    lg:text-4xl
                    xl:text-5xl
                  "
                >
                  RAMHIS
                </h1>

                <p
                  className="
                    mt-1.5
                    max-w-md
                    text-xs
                    font-medium
                    leading-snug
                    tracking-wide
                    text-blue-100/80

                    sm:text-sm
                    md:text-base
                    lg:text-sm
                    xl:text-base
                  "
                >
                  Remote Area Medical
                  <br />
                  Health Information System
                </p>
              </div>
            </div>

            {/* Tagline Badge & Description */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-300 backdrop-blur-sm">
                PORTABLE & RESILIENT
              </span>

              <h2
                className="
                  mt-3
                  max-w-xl
                  text-xl
                  font-light
                  leading-snug
                  text-white/95

                  sm:text-2xl
                  md:text-3xl
                  lg:text-2xl
                  xl:text-3xl
                "
              >
                An{" "}
                <span className="font-semibold text-white">
                  Offline First System
                </span>{" "}
                developed for extreme mobility.
              </h2>
            </div>
          </div>
        </div>

        {/* LOGIN CONTAINER */}
        <div
          className="
            flex
            w-full
            items-center
            justify-center

            lg:w-[42%]
            lg:justify-end
            xl:max-w-md
          "
        >
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
