import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
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
      style={{
        position: "sticky",
        top: 0,
        zIndex: 900,
        height: 76,
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 30px",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          USER AREA
      ====================================================== */}

      <div
        style={{
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "6px 8px",
            border: "none",
            borderRadius: 12,
            background: open ? "#f8fafc" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          {/* AVATAR */}

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #2563eb, #1e40af)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.18)",
            }}
          >
            {firstLetter}
          </div>

          {/* USER INFO */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 100,
              maxWidth: 180,
            }}
          >
            <span
              style={{
                color: "#0f172a",
                fontSize: 13,
                fontWeight: 650,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
            >
              {displayName}
            </span>

            <span
              style={{
                marginTop: 3,
                color: "#64748b",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {role}
            </span>
          </div>

          {/* CHEVRON */}

          <FaChevronDown
            style={{
              color: "#64748b",
              fontSize: 11,
              transform: open
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {/* =====================================================
            DROPDOWN
        ====================================================== */}

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 9px)",
              right: 0,
              width: 220,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 7,
              boxShadow:
                "0 18px 45px rgba(15, 23, 42, 0.12)",
              boxSizing: "border-box",
            }}
          >
            {/* ACCOUNT HEADER */}

            <div
              style={{
                padding: "10px 11px 12px",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                }}
              >
                Signed in as
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: 4,
                  color: "#0f172a",
                  fontSize: 13,
                  fontWeight: 650,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </strong>
            </div>

            {/* ACCOUNT SETTINGS */}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/account");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                height: 42,
                padding: "0 11px",
                border: "none",
                borderRadius: 9,
                background: "transparent",
                color: "#334155",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <FaUserCog
                style={{
                  color: "#2563eb",
                  fontSize: 15,
                }}
              />

              <span>Account Settings</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}