import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";

import ramLogo from "../../assets/images/ramhislogo.png";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [openPharmacy, setOpenPharmacy] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const role = user?.role;

  /*
  |--------------------------------------------------------------------------
  | COLORS
  |--------------------------------------------------------------------------
  */

  const colors = {
    navy: "#0f2f6b",
    navyDark: "#0b2454",
    blue: "#2563eb",
    blueLight: "#eff6ff",
    text: "#334155",
    muted: "#64748b",
    border: "#e2e8f0",
    white: "#ffffff",
    danger: "#dc2626",
    dangerLight: "#fef2f2",
  };

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
    justifyContent: collapsed ? "center" : "flex-start",
    gap: collapsed ? 0 : 13,
    width: "100%",
    minHeight: 46,
    padding: collapsed ? "0 10px" : "0 14px",
    borderRadius: 12,
    border: "none",
    background: isActive ? colors.blueLight : "transparent",
    color: isActive ? colors.blue : colors.text,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  });

  const iconStyle = {
    width: 18,
    minWidth: 18,
    fontSize: 17,
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMENU STYLE
  |--------------------------------------------------------------------------
  */

  const submenuStyle = {
    marginTop: 4,
    marginLeft: collapsed ? 0 : 20,
    paddingLeft: collapsed ? 0 : 12,
    borderLeft: collapsed
      ? "none"
      : `1px solid ${colors.border}`,
  };

  const submenuLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: 38,
    padding: "0 12px",
    marginBottom: 3,
    borderRadius: 9,
    textDecoration: "none",
    color: isActive ? colors.blue : colors.muted,
    background: isActive
      ? colors.blueLight
      : "transparent",
    fontSize: 13,
    fontWeight: isActive ? 600 : 500,
    transition: "all 0.2s ease",
  });

  /*
  |--------------------------------------------------------------------------
  | SIDEBAR
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          width: collapsed ? 76 : 250,
          background: colors.white,
          borderRight: `1px solid ${colors.border}`,
          boxShadow:
            "4px 0 20px rgba(15, 23, 42, 0.04)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}
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
            justifyContent: collapsed
              ? "center"
              : "space-between",
            padding: collapsed
              ? "0 12px"
              : "0 16px",
            borderBottom: `1px solid ${colors.border}`,
            boxSizing: "border-box",
          }}
        >
          {!collapsed && (
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
                    color: colors.navy,
                    fontSize: 19,
                    letterSpacing: "0.5px",
                  }}
                >
                  RAMHIS
                </strong>

                <span
                  style={{
                    marginTop: 5,
                    color: colors.muted,
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
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              background: colors.white,
              color: colors.muted,
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <FaBars size={16} />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: collapsed
              ? "18px 10px"
              : "20px 14px",
            boxSizing: "border-box",
          }}
        >
          {/* MAIN MENU LABEL */}

          {!collapsed && (
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
              title={
                collapsed
                  ? "Dashboard"
                  : undefined
              }
            >
              <FaChartLine style={iconStyle} />

              {!collapsed && (
                <span>Dashboard</span>
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
              title={
                collapsed
                  ? "Analytics"
                  : undefined
              }
            >
              <FaChartLine style={iconStyle} />

              {!collapsed && (
                <span>Analytics</span>
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
              title={
                collapsed
                  ? "User Management"
                  : undefined
              }
            >
              <FaUserShield style={iconStyle} />

              {!collapsed && (
                <span>User Management</span>
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
              title={
                collapsed
                  ? "Audit Log"
                  : undefined
              }
            >
              <FaFileAlt style={iconStyle} />

              {!collapsed && (
                <span>Audit Log</span>
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
              title={
                collapsed
                  ? "Events"
                  : undefined
              }
            >
              <FaCalendarAlt style={iconStyle} />

              {!collapsed && (
                <span>Events</span>
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
              title={
                collapsed
                  ? "Patients"
                  : undefined
              }
            >
              <FaClipboardList style={iconStyle} />

              {!collapsed && (
                <span>Patients</span>
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
              title={
                collapsed
                  ? "Doctor"
                  : undefined
              }
            >
              <FaUserMd style={iconStyle} />

              {!collapsed && (
                <span>Doctor</span>
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
                  setOpenPharmacy(
                    (prev) => !prev
                  )
                }
                title={
                  collapsed
                    ? "Pharmacy"
                    : undefined
                }
                style={{
                  ...getNavStyle({
                    isActive:
                      openPharmacy ||
                      window.location.pathname.startsWith(
                        "/pharmacy"
                      ),
                  }),
                  justifyContent: collapsed
                    ? "center"
                    : "space-between",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed
                      ? 0
                      : 13,
                  }}
                >
                  <FaPills
                    style={iconStyle}
                  />

                  {!collapsed && (
                    <span>Pharmacy</span>
                  )}
                </span>

                {!collapsed &&
                  (openPharmacy ? (
                    <FaChevronDown
                      size={11}
                    />
                  ) : (
                    <FaChevronRight
                      size={11}
                    />
                  ))}
              </button>

              {!collapsed &&
                openPharmacy && (
                  <div
                    style={submenuStyle}
                  >
                    <NavLink
                      to="/pharmacy/queue"
                      style={
                        submenuLinkStyle
                      }
                    >
                      <FaClock size={13} />
                      <span>Queue</span>
                    </NavLink>

                    <NavLink
                      to="/pharmacy/inventory"
                      style={
                        submenuLinkStyle
                      }
                    >
                      <FaBoxes size={13} />
                      <span>
                        Inventory
                      </span>
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
            padding: collapsed
              ? "12px 10px"
              : "12px 14px 16px",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {!collapsed && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding:
                  "10px 10px 12px",
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    colors.blueLight,
                  color: colors.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {(user?.name ||
                  user?.email ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div
                style={{
                  minWidth: 0,
                  display: "flex",
                  flexDirection:
                    "column",
                }}
              >
                <strong
                  style={{
                    color: colors.text,
                    fontSize: 12,
                    whiteSpace:
                      "nowrap",
                    overflow:
                      "hidden",
                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {user?.name ||
                    user?.email ||
                    "User"}
                </strong>

                <span
                  style={{
                    marginTop: 3,
                    color: colors.muted,
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
            onClick={() =>
              setConfirmLogout(true)
            }
            title={
              collapsed
                ? "Logout"
                : undefined
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                collapsed
                  ? "center"
                  : "flex-start",
              gap: collapsed ? 0 : 13,
              width: "100%",
              height: 44,
              padding: collapsed
                ? "0 10px"
                : "0 14px",
              border: "none",
              borderRadius: 11,
              background:
                "transparent",
              color: colors.muted,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition:
                "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            <FaSignOutAlt
              style={iconStyle}
            />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* =====================================================
          LOGOUT MODAL
      ====================================================== */}

      {confirmLogout && (
        <div
          onClick={() =>
            setConfirmLogout(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background:
              "rgba(15, 23, 42, 0.45)",
            backdropFilter:
              "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            padding: 20,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: 400,
              background:
                colors.white,
              borderRadius: 18,
              padding: 26,
              boxShadow:
                "0 24px 60px rgba(15, 23, 42, 0.18)",
              boxSizing:
                "border-box",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background:
                  colors.dangerLight,
                color:
                  colors.danger,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                marginBottom: 18,
              }}
            >
              <FaSignOutAlt
                size={18}
              />
            </div>

            <h3
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#0f172a",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Confirm Logout
            </h3>

            <p
              style={{
                margin: 0,
                color:
                  colors.muted,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Are you sure you
              want to log out of
              your RAMHIS account?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 10,
                marginTop: 25,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setConfirmLogout(
                    false
                  )
                }
                style={{
                  height: 40,
                  padding:
                    "0 17px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 9,
                  background:
                    colors.white,
                  color:
                    colors.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    "pointer",
                  fontFamily:
                    "inherit",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={{
                  height: 40,
                  padding:
                    "0 17px",
                  border: "none",
                  borderRadius: 9,
                  background:
                    colors.danger,
                  color:
                    colors.white,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    "pointer",
                  fontFamily:
                    "inherit",
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