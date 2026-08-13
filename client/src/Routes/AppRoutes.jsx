import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

/*
|--------------------------------------------------------------------------
| Layout
|--------------------------------------------------------------------------
*/

import MainLayout from "../Components/layout/MainLayout";

/*
|--------------------------------------------------------------------------
| Landing / Public Pages
|--------------------------------------------------------------------------
*/

import Home from "../Pages/LandingPages/Home";
import Organization from "../Pages/LandingPages/Organization";
import AboutSystem from "../Pages/LandingPages/AboutSystem";
import Login from "../Pages/LandingPages/Login";

/*
|--------------------------------------------------------------------------
| Main Pages
|--------------------------------------------------------------------------
*/

import Dashboard from "../Pages/MainPages/Dashboard/Dashboard";
import Analytics from "../Pages/MainPages/Analytics/Analytics";

/*
|--------------------------------------------------------------------------
| Placeholder Pages
| Replace these with the real pages when they are ready.
|--------------------------------------------------------------------------
*/

const Registry = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    Registry
  </div>
);

const PatientQueue = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    Patient Queue
  </div>
);

const DoctorSheet = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    Doctor Sheet
  </div>
);

const Pharmacy = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    Pharmacy
  </div>
);

const UserManagement = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    User Management
  </div>
);

const AuditLogs = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    Audit Logs
  </div>
);

/*
|--------------------------------------------------------------------------
| Error Pages
|--------------------------------------------------------------------------
*/

const Unauthorized = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold text-red-600">
    Unauthorized
  </div>
);

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
    404 - Page Not Found
  </div>
);

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

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
              - Outlet for the current page
          ========================================================= */}

          <Route element={<MainLayout />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Analytics */}
            <Route
              path="/analytics"
              element={<Analytics />}
            />

            {/* Registry */}
            <Route
              path="/registry"
              element={<Registry />}
            />

            {/* Patient Queue */}
            <Route
              path="/patient-queue"
              element={<PatientQueue />}
            />

            {/* Doctor */}
            <Route
              path="/doctor-sheet"
              element={<DoctorSheet />}
            />

            {/* Pharmacy */}
            <Route
              path="/pharmacy"
              element={<Pharmacy />}
            />

            {/* Audit Logs */}
            <Route
              path="/audit-logs"
              element={<AuditLogs />}
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

          </Route>

        </Route>


        {/* ==========================================================
            ERROR ROUTES
        =========================================================== */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}