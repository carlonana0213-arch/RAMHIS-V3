import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaChevronDown,
  FaUserCog,
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const displayName =
    user?.name ||
    user?.firstName ||
    user?.firstname ||
    user?.username ||
    user?.email ||
    "User";

  const role = user?.role || "User";

  const firstLetter = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <header
      className="
        sticky top-0 z-[900]
        flex h-[76px] items-center justify-end
        border-b border-border-soft
        bg-white/80 px-5
        backdrop-blur-xl
        md:px-6 lg:px-8
      "
    >
      {/* USER AREA */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={`
            flex items-center gap-3
            rounded-2xl px-2 py-1.5
            transition-all duration-200
            ${
              open
                ? "border border-border-soft bg-surface shadow-sm"
                : "border border-transparent bg-transparent hover:bg-surface"
            }
          `}
        >
          {/* AVATAR */}
          <div
            className="
              flex h-11 w-11
              shrink-0 items-center justify-center
              rounded-2xl
              bg-gradient-to-br
              from-primary-600 to-primary-900
              text-sm font-bold
              text-text-inverse
              shadow-[0_6px_18px_rgba(30,42,94,0.22)]
            "
          >
            {firstLetter}
          </div>

          {/* USER INFO */}
          <div
            className="
              hidden min-w-[100px] max-w-[180px]
              flex-col items-start
              sm:flex
            "
          >
            <span
              className="
                max-w-[180px]
                truncate
                text-[13px]
                font-bold
                text-primary-900
              "
            >
              {displayName}
            </span>

            <span
              className="
                mt-0.5
                text-[11px]
                font-medium
                capitalize
                text-text-muted
              "
            >
              {role}
            </span>
          </div>

          {/* CHEVRON */}
          <FaChevronDown
            className={`
              hidden text-[11px]
              text-text-muted
              transition-transform duration-200
              sm:block
              ${
                open
                  ? "rotate-180"
                  : "rotate-0"
              }
            `}
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
              absolute right-0 top-[calc(100%+10px)]
              w-[230px]
              overflow-hidden
              rounded-2xl
              border border-border-soft
              bg-surface
              p-2
              shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            "
          >
            {/* ACCOUNT HEADER */}
            <div
              className="
                mb-2
                border-b border-border-soft
                px-3 py-3
              "
            >
              <span
                className="
                  block
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-text-muted
                "
              >
                Signed in as
              </span>

              <strong
                className="
                  mt-1 block
                  truncate
                  text-[13px]
                  font-bold
                  text-primary-900
                "
              >
                {displayName}
              </strong>

              <span
                className="
                  mt-0.5 block
                  text-[11px]
                  capitalize
                  text-text-muted
                "
              >
                {role}
              </span>
            </div>

            {/* ACCOUNT SETTINGS */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/account");
              }}
              className="
                flex h-11 w-full
                items-center gap-3
                rounded-xl px-3
                text-left text-[13px]
                font-semibold
                text-text-secondary
                transition-all duration-200
                hover:bg-primary-50
                hover:text-primary-900
              "
            >
              <FaUserCog
                className="
                  text-[16px]
                  text-primary-700
                "
              />

              <span>
                Account Settings
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}