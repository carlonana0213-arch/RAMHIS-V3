import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";

import "../../styles/topbar.css";

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

  const role = user?.role || "";

  return (
    <header className="app-topbar">
      <div className="topbar-right">
        <button
          type="button"
          className="topbar-user"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <FaUserCircle className="topbar-user-icon" />

          <div className="topbar-user-info">
            <span className="topbar-user-name">
              {displayName}
            </span>

            {role && (
              <span className="topbar-user-role">
                {role}
              </span>
            )}
          </div>

          <FaChevronDown
            className={`topbar-chevron ${open ? "open" : ""}`}
          />
        </button>

        {open && (
          <div className="topbar-dropdown">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/account");
              }}
            >
              Account Settings
            </button>
          </div>
        )}
      </div>
    </header>
  );
}