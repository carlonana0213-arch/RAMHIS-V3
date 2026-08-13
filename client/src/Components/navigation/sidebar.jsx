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
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";

import Modal from "../ui/modal";

import ramLogo from "../../assets/images/ramhislogo.png";

import "../../styles/sidebar.css";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [openPharmacy, setOpenPharmacy] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const role = user?.role;

  /*
  |--------------------------------------------------------------------------
  | Access Control
  |--------------------------------------------------------------------------
  */

  const canAccess = (section) => {
    if (role === "Admin") {
      return true;
    }

    if (role === "Doctor") {
      return [
        "dashboard",
        "patient",
        "doctorSheet",
        "pharmacy",
        "event",
      ].includes(section);
    }

    if (role === "Volunteer") {
      return [
        "dashboard",
        "patient",
        "event",
      ].includes(section);
    }

    return false;
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
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
  | Navigation Class
  |--------------------------------------------------------------------------
  */

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* =====================================================
            SIDEBAR HEADER
        ====================================================== */}

        <div className="sidebar-top">
          <button
            type="button"
            className="toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars size={20} />
          </button>

          {!collapsed && (
            <div className="logo-group">
              <img
                src={ramLogo}
                alt="RAMHIS"
                className="logo"
              />

              <span className="logo-text">
                RAMHIS
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav className="nav-links">

          {/* DASHBOARD */}

          {canAccess("dashboard") && (
            <NavLink
              to="/dashboard"
              className={linkClass}
            >
              <span className="nav-item">
                <FaChartLine className="nav-icon" />

                {!collapsed && (
                  <span>Dashboard</span>
                )}
              </span>
            </NavLink>
          )}

          {/* ANALYTICS */}

          {canAccess("analytics") && (
            <NavLink
              to="/analytics"
              className={linkClass}
            >
              <span className="nav-item">
                <FaChartLine className="nav-icon" />

                {!collapsed && (
                  <span>Analytics</span>
                )}
              </span>
            </NavLink>
          )}

          {/* USER MANAGEMENT */}

          {canAccess("admin") && (
            <NavLink
              to="/users"
              className={linkClass}
            >
              <span className="nav-item">
                <FaUserShield className="nav-icon" />

                {!collapsed && (
                  <span>User Management</span>
                )}
              </span>
            </NavLink>
          )}

          {/* PATIENTS */}

          {canAccess("patient") && (
            <NavLink
  to="/patient"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
  <span className="nav-item">
    <FaClipboardList className="nav-icon" />
    {!collapsed && " Patient"}
  </span>
</NavLink>
          )}

          {/* DOCTOR */}

          {canAccess("doctorSheet") && (
            <NavLink
              to="/doctor-sheet"
              className={linkClass}
            >
              <span className="nav-item">
                <FaUserMd className="nav-icon" />

                {!collapsed && (
                  <span>Doctor</span>
                )}
              </span>
            </NavLink>
          )}

          {/* PHARMACY */}

          {canAccess("pharmacy") && (
            <div className="nav-group">

              <button
                type="button"
                className="nav-link nav-parent"
                onClick={() =>
                  setOpenPharmacy(!openPharmacy)
                }
              >
                <span className="nav-item">
                  <FaPills className="nav-icon" />

                  {!collapsed && (
                    <span>Pharmacy</span>
                  )}
                </span>

                {!collapsed &&
                  (openPharmacy ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  ))}
              </button>

              {!collapsed && openPharmacy && (
                <div className="nav-submenu">

                  <NavLink
                    to="/pharmacy/queue"
                    className={({ isActive }) =>
                      `nav-sublink ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="nav-subitem">
                      <FaClock className="nav-subicon" />
                      Queue
                    </span>
                  </NavLink>

                  <NavLink
                    to="/pharmacy/inventory"
                    className={({ isActive }) =>
                      `nav-sublink ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="nav-subitem">
                      <FaBoxes className="nav-subicon" />
                      Inventory
                    </span>
                  </NavLink>

                </div>
              )}
            </div>
          )}

          {/* EVENT */}

          {canAccess("event") && (
            <NavLink
              to="/event"
              className={linkClass}
            >
              <span className="nav-item">
                <FaCalendarAlt className="nav-icon" />

                {!collapsed && (
                  <span>Event</span>
                )}
              </span>
            </NavLink>
          )}

          {/* LOGOUT */}

          <button
            type="button"
            className="nav-link logout-link"
            onClick={() =>
              setConfirmLogout(true)
            }
          >
            <span className="nav-item">
              <FaSignOutAlt className="nav-icon" />

              {!collapsed && (
                <span>Logout</span>
              )}
            </span>
          </button>

        </nav>
      </aside>

      {/* =====================================================
          LOGOUT CONFIRMATION
      ====================================================== */}

      <Modal
        open={confirmLogout}
        onClose={() =>
          setConfirmLogout(false)
        }
        title="Confirm Logout"
        subtitle="Are you sure you want to log out?"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() =>
                setConfirmLogout(false)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          You will be signed out of your RAMHIS account.
        </p>
      </Modal>
    </>
  );
}