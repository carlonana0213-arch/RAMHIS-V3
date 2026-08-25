import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { NavLink, useNavigate } from "react-router-dom";
import { colors } from "../../Theme/colors";
import {
  FaChartLine,
  FaSignOutAlt,
  FaUserShield,
  FaClipboardList,
  FaUserMd,
  FaPills,
  FaClock,
  FaBoxes,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";

import ramLogo from "../../assets/images/ramhislogo.png";

export default function Sidebar({
  collapsed,
  toggleSidebar,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {

  const isCollapsed = isMobile ? false : collapsed;

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [openPharmacy, setOpenPharmacy] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const role = user?.role;
  const location = useLocation();
  const isPharmacyActive = location.pathname.startsWith("/pharmacy");

  // Close the drawer automatically whenever the route changes
  useEffect(() => {
    if (isMobile) setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll + Escape-to-close while the mobile drawer is open
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => e.key === "Escape" && setMobileMenuOpen(false);
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isMobile, mobileMenuOpen, setMobileMenuOpen]);

  /*
  |--------------------------------------------------------------------------
  | ACCESS CONTROL
  |--------------------------------------------------------------------------
  |
  | Volunteer:
  | Dashboard, Patients, Events, Pharmacy
  |
  | Doctor:
  | Dashboard, Patients, Doctor, Events, Pharmacy
  |
  | Admin:
  | Dashboard, Analytics, User Management, Audit Log,
  | Events, Patients, Doctor, Pharmacy
  |
  */

  const canAccess = (section) => {
    if (role === "Admin") {
      return [
        "dashboard",
        "analytics",
        "admin",
        "auditLog",
        "event",
        "patient",
        "doctorSheet",
        "pharmacy",
      ].includes(section);
    }

    if (role === "Doctor") {
      return [
        "dashboard",
        "patient",
        "doctorSheet",
        "event",
        "pharmacy",
      ].includes(section);
    }

    if (role === "Volunteer") {
      return [
        "dashboard",
        "patient",
        "event",
        "pharmacy",
      ].includes(section);
    }

    return false;
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    logout();
    setConfirmLogout(false);

    navigate("/login", {
      replace: true,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION STYLE
  |--------------------------------------------------------------------------
  */

  const getNavStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: isCollapsed ? 0 : 12,
    width: "100%",
    minHeight: isMobile ? 52 : 48,
    padding: isCollapsed ? "0 10px" : "0 12px",
    justifyContent: isCollapsed ? "center" : "flex-start",

    border: "none",
    borderRadius: isMobile ? 12 : 16,

    background: isActive ? "#F4C542" : "transparent",

    color: isActive
      ? colors.primary[900]
      : "rgba(255, 255, 255, 0.85)",

    cursor: "pointer",
    transition: "all 0.2s ease",

    fontSize: isMobile ? 15 : 13,
    fontWeight: isActive ? 700 : 500,
    fontFamily: "inherit",

    textDecoration: "none",
  });

  /*
  |--------------------------------------------------------------------------
  | SUBMENU STYLE
  |--------------------------------------------------------------------------
  */

  const submenuStyle = {
    marginTop: 4,
    marginLeft: isCollapsed ? 0 : 20,
    paddingLeft: isCollapsed ? 0 : 12,
    borderLeft: isCollapsed
      ? "none"
      : `1px solid ${colors.border.DEFAULT}`,
  };

  const submenuLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: isMobile ? 44 : 38,
    padding: "0 12px",
    marginBottom: 3,
    borderRadius: 9,
    textDecoration: "none",

    color: isActive ? colors.primary[600] : colors.text.muted,

    background: isActive ? colors.primary[50] : "transparent",

    fontSize: isMobile ? 14 : 13,
    fontWeight: isActive ? 600 : 500,
    transition: "all 0.2s ease",
  });

  /*
  |--------------------------------------------------------------------------
  | SIDEBAR
  |--------------------------------------------------------------------------
  */

  const iconStyle = {
    fontSize: isMobile ? 17 : 16,
    flexShrink: 0,
  };

  return (
    <>
      {/* =====================================================
          MOBILE HAMBURGER TRIGGER (visible only when drawer closed)
      ====================================================== */}

      {isMobile && !mobileMenuOpen && (
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            width: 46,
            height: 46,
            border: "none",
            borderRadius: 14,
            background: colors.primary[900],
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.25)",
            zIndex: 1500,
            cursor: "pointer",
          }}
        >
          <FaBars size={18} />
        </button>
      )}

      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      {isMobile && mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 1900,
          }}
        />
      )}

      {/* =====================================================
          SIDEBAR (desktop: always visible / mobile: drawer)
      ====================================================== */}

      {(!isMobile || mobileMenuOpen) && (
        <aside
          style={
            isMobile
              ? {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  maxWidth: 320,
                  background: colors.primary[900],
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                  zIndex: 2000,
                  boxSizing: "border-box",
                  boxShadow: "0 0 40px rgba(15, 23, 42, 0.35)",
                  transform: mobileMenuOpen
                    ? "translateX(0)"
                    : "translateX(-100%)",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }
              : {
                  position: "fixed",
                  top: 12,
                  left: 12,
                  bottom: 12,

                  width: collapsed ? 76 : 250,

                  background: colors.primary[900],

                  borderRadius: 28,

                  border: "1px solid rgba(255, 255, 255, 0.10)",

                  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",

                  display: "flex",
                  flexDirection: "column",

                  padding: 12,

                  zIndex: 1000,

                  transition:
                    "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                  boxSizing: "border-box",
                }
          }
        >
          {/* =====================================================
              HEADER
          ====================================================== */}

          <div
            style={{
              height: 76,
              minHeight: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed
                ? "center"
                : "space-between",
              padding: isCollapsed ? "0 12px" : "0 16px",
              borderBottom: `1px solid ${colors.border.DEFAULT}`,
              boxSizing: "border-box",
            }}
          >
            {!isCollapsed && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <img
                  src={ramLogo}
                  alt="RAMHIS"
                  style={{
                    width: 38,
                    height: 38,
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1,
                  }}
                >
                  <strong
                    style={{
                      color: "#FFFFFF",
                      fontSize: 19,
                      letterSpacing: "0.5px",
                    }}
                  >
                    RAMHIS
                  </strong>

                  <span
                    style={{
                      marginTop: 5,
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.7px",
                    }}
                  >
                    HEALTH INFORMATION SYSTEM
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={isMobile ? closeMobileMenu : toggleSidebar}
              aria-label={isMobile ? "Close menu" : "Toggle sidebar"}
              style={{
                width: 38,
                height: 38,
                border: "none",
                borderRadius: "50%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                flexShrink: 0,

                background: "rgba(255, 255, 255, 0.08)",

                color: "rgba(255, 255, 255, 0.82)",

                cursor: "pointer",

                transition: "all 0.2s ease",
              }}
            >
              {isMobile ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>

          {/* =====================================================
              NAVIGATION
          ====================================================== */}

          <nav
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isCollapsed ? "18px 10px" : "20px 14px",
              boxSizing: "border-box",
            }}
          >
            {!isCollapsed && (
              <div
                style={{
                  padding: "0 10px 9px",
                  color: "#94a3b8",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Main Menu
              </div>
            )}

            {/* =====================================================
                DASHBOARD
            ====================================================== */}

            {canAccess("dashboard") && (
              <NavLink
                to="/dashboard"
                style={getNavStyle}
                title={isCollapsed ? "Dashboard" : undefined}
              >
                <FaChartLine style={iconStyle} />

                {!isCollapsed && <span>Dashboard</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                ANALYTICS - ADMIN ONLY
            ====================================================== */}

            {canAccess("analytics") && (
              <NavLink
                to="/analytics"
                style={getNavStyle}
                title={isCollapsed ? "Analytics" : undefined}
              >
                <FaChartLine style={iconStyle} />

                {!isCollapsed && <span>Analytics</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                USER MANAGEMENT - ADMIN ONLY
            ====================================================== */}

            {canAccess("admin") && (
              <NavLink
                to="/users"
                style={getNavStyle}
                title={isCollapsed ? "User Management" : undefined}
              >
                <FaUserShield style={iconStyle} />

                {!isCollapsed && <span>User Management</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                AUDIT LOG - ADMIN ONLY
            ====================================================== */}

            {canAccess("auditLog") && (
              <NavLink
                to="/audit-log"
                style={getNavStyle}
                title={isCollapsed ? "Audit Log" : undefined}
              >
                <FaFileAlt style={iconStyle} />

                {!isCollapsed && <span>Audit Log</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                EVENT
            ====================================================== */}

            {canAccess("event") && (
              <NavLink
                to="/event"
                style={getNavStyle}
                title={isCollapsed ? "Events" : undefined}
              >
                <FaCalendarAlt style={iconStyle} />

                {!isCollapsed && <span>Events</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                PATIENT
            ====================================================== */}

            {canAccess("patient") && (
              <NavLink
                to="/patient"
                style={getNavStyle}
                title={isCollapsed ? "Patients" : undefined}
              >
                <FaClipboardList style={iconStyle} />

                {!isCollapsed && <span>Patients</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                DOCTOR
            ====================================================== */}

            {canAccess("doctorSheet") && (
              <NavLink
                to="/doctor"
                style={getNavStyle}
                title={isCollapsed ? "Doctor" : undefined}
              >
                <FaUserMd style={iconStyle} />

                {!isCollapsed && <span>Doctor</span>}

                {isMobile && (
                  <FaChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.45 }}
                  />
                )}
              </NavLink>
            )}

            {/* =====================================================
                PHARMACY
            ====================================================== */}

            {canAccess("pharmacy") && (
              <div style={{ marginTop: 2 }}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenPharmacy((prev) => !prev)
                  }
                  title={isCollapsed ? "Pharmacy" : undefined}
                  style={{
                    ...getNavStyle({
                      isActive: isPharmacyActive,
                    }),
                    justifyContent: isCollapsed
                      ? "center"
                      : "space-between",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isCollapsed ? 0 : 13,
                    }}
                  >
                    <FaPills style={iconStyle} />

                    {!isCollapsed && <span>Pharmacy</span>}
                  </span>

                  {!isCollapsed &&
                    (openPharmacy ? (
                      <FaChevronDown size={11} />
                    ) : (
                      <FaChevronRight size={11} />
                    ))}
                </button>

                {!isCollapsed && openPharmacy && (
                  <div style={submenuStyle}>
                    <NavLink
                      to="/pharmacy/queue"
                      style={submenuLinkStyle}
                    >
                      <FaClock size={13} />
                      <span>Queue</span>
                    </NavLink>

                    <NavLink
                      to="/pharmacy/inventory"
                      style={submenuLinkStyle}
                    >
                      <FaBoxes size={13} />
                      <span>Inventory</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* =====================================================
              USER / LOGOUT AREA
          ====================================================== */}

          <div
            style={{
              padding: isCollapsed ? "12px 10px" : "12px 14px 16px",
              borderTop: `1px solid ${colors.border.DEFAULT}`,
            }}
          >
            {!isCollapsed && user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px 12px",
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: colors.primary[50],
                    color: colors.primary[600],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {(user?.name || user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div
                  style={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <strong
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.name || user?.email || "User"}
                  </strong>

                  <span
                    style={{
                      marginTop: 3,
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 10,
                    }}
                  >
                    {role || "User"}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              title={isCollapsed ? "Logout" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                gap: isCollapsed ? 0 : 13,
                width: "100%",
                height: isMobile ? 50 : 44,
                padding: isCollapsed ? "0 10px" : "0 14px",
                border: "none",
                borderRadius: 11,
                background: "transparent",
                color: "rgba(255, 255, 255, 0.55)",
                fontSize: isMobile ? 15 : 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <FaSignOutAlt style={iconStyle} />

              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>
      )}

      {/* =====================================================
          LOGOUT MODAL
      ====================================================== */}

      {confirmLogout && (
        <div
          onClick={() => setConfirmLogout(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 400,
              background: colors.surface.DEFAULT,
              borderRadius: 18,
              padding: 26,
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: colors.danger[50],
                color: colors.danger[600],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <FaSignOutAlt size={18} />
            </div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#0f172a",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Confirm Logout
            </h3>

            <p
              style={{
                margin: 0,
                color: colors.text.muted,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to log out of your RAMHIS account?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 25,
              }}
            >
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                style={{
                  height: 40,
                  padding: "0 17px",
                  border: `1px solid ${colors.border.DEFAULT}`,
                  background: colors.surface.DEFAULT,
                  color: colors.text.primary,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  height: 40,
                  padding: "0 17px",
                  border: "none",
                  borderRadius: 9,
                  background: colors.danger[600],
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}