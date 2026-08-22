import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../navigation/sidebar";
import Topbar from "../navigation/topbar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 76 : 250;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed((prev) => !prev)}
      />

      {/* MAIN AREA */}
      <div
        style={{
          minHeight: "100vh",
          marginLeft: sidebarWidth,
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main
          style={{
            width: "100%",
            minHeight: "calc(100vh - 76px)",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}