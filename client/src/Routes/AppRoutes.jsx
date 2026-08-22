import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../Components/layout/MainLayout";

import Home from "../Pages/LandingPages/Home";
import Organization from "../Pages/LandingPages/Organization";
import AboutSystem from "../Pages/LandingPages/AboutSystem";
import Login from "../Pages/LandingPages/Login";

import Dashboard from "../Pages/MainPages/Dashboard/Dashboard";
import Analytics from "../Pages/MainPages/Analytics/Analytics";
import Patients from "../Pages/MainPages/Patients/Patients";
import Doctor from "../Pages/MainPages/Doctor/Doctor";
import Events from "../Pages/MainPages/Events/EventManagement";
import PharmacyQueue from "../Pages/MainPages/Pharmacy/components/PharmacyQueue";
import PharmacyInventory from "../Pages/MainPages/Pharmacy/components/PharmacyInventory";
import UserManagement from "../Pages/MainPages/Users/UserManagement";
import Account from "../Pages/MainPages/Account/Account";
import AuditLog from "../Pages/MainPages/AuditLog/AuditLog";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================================
            PUBLIC ROUTES
        =========================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/organization"
          element={<Organization />}
        />

        <Route
          path="/ramhis"
          element={<AboutSystem />}
        />


        {/* ==========================================================
            PROTECTED APPLICATION
        =========================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ========================================================
              MAIN LAYOUT

              MainLayout contains:
              - Sidebar
              - Topbar
              - Outlet
          ========================================================= */}

          <Route element={<MainLayout />}>

            {/* ======================================================
                DASHBOARD
            ====================================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ======================================================
                ANALYTICS
            ====================================================== */}

            <Route
              path="/analytics"
              element={<Analytics />}
            />


            {/* ======================================================
                PATIENTS
            ====================================================== */}

            <Route
              path="/patient"
              element={<Patients />}
            />


            {/* ======================================================
                DOCTOR
            ====================================================== */}

            <Route
              path="/doctor"
              element={<Doctor />}
            />


            {/* ======================================================
                EVENTS
            ====================================================== */}

            <Route
              path="/event"
              element={<Events />}
            />


            {/* ======================================================
                PHARMACY
            ====================================================== */}

            <Route
              path="/pharmacy"
              element={<Navigate to="/pharmacy/queue" replace />}
            />

            <Route
              path="/pharmacy/queue"
              element={<PharmacyQueue />}
            />

            <Route
              path="/pharmacy/inventory"
              element={<PharmacyInventory />}
            />


            {/* ======================================================
                ACCOUNT
            ====================================================== */}

            <Route
              path="/account"
              element={<Account />}
            />

          </Route>

        </Route>


        {/* ==========================================================
            ADMIN ONLY
        =========================================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin"]} />
          }
        >

          <Route element={<MainLayout />}>

            <Route
              path="/users"
              element={<UserManagement />}
            />

            <Route
              path="/audit-log"
              element={<AuditLog />}
            />

          </Route>
        </Route>


        {/* ==========================================================
            UNAUTHORIZED
        =========================================================== */}

        <Route
          path="/unauthorized"
          element={
            <div className="flex min-h-screen items-center justify-center text-4xl font-bold text-red-600">
              Unauthorized
            </div>
          }
        />


        {/* ==========================================================
            FALLBACK
        =========================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
              404 - Page Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}