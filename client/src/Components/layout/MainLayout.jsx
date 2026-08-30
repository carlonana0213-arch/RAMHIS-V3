import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import Sidebar from "../navigation/sidebar";
import Topbar from "../navigation/topbar";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = useIsMobile();
  const menuButtonRef = useRef(null);

  // Close drawer when returning to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Escape closes mobile drawer
  useEffect(() => {
    if (!isMobile || !mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);

        requestAnimationFrame(() => {
          menuButtonRef.current?.focus();
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobile, mobileMenuOpen]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (!isMobile || !mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, mobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((previous) => {
      const next = !previous;

      if (!next) {
        requestAnimationFrame(() => {
          menuButtonRef.current?.focus();
        });
      }

      return next;
    });
  };

  const sidebarWidth = collapsed ? 76 : 250;
  const contentGap = 16;

  return (
    <div
      style={{
        // CHANGED: lock the dashboard to viewport height
        height: "100dvh",
        overflow: "hidden",
        background: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          ref={menuButtonRef}
          type="button"
          onClick={handleMobileMenuToggle}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            width: 44,
            height: 44,
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 14,
            background: "#1e2a4a",
            color: "#ffffff",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.22)",
            cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease",
          }}
        >
          {mobileMenuOpen ? (
            <FaTimes size={18} />
          ) : (
            <FaBars size={18} />
          )}
        </button>
      )}

      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed((previous) => !previous)}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div
        style={{
          // CHANGED: fixed dashboard height
          height: "100dvh",

          // IMPORTANT: prevents this wrapper from creating body scroll
          overflow: "hidden",

          marginLeft: isMobile ? 0 : sidebarWidth + contentGap,
          transition: "margin-left 0.25s ease",

          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar />

        <main
          style={{
            width: "100%",

            // CHANGED: only the dashboard content scrolls
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",

            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}