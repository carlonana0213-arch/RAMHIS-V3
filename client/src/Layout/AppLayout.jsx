import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Components/navigation/sidebar";
import Topbar from "../Components/navigation/topbar";

import "../styles/layout.css";


export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const toggleSidebar = () => {
    const newState = !collapsed;

    setCollapsed(newState);

    localStorage.setItem(
      "sidebarCollapsed",
      String(newState)
    );
  };

  return (
    <div
      className={`app-layout ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className="main-area">
        <Topbar />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}