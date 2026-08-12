import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Home from "../Pages/LandingPages/Home";
import Organization from "../Pages/LandingPages/Organization";
import AboutSystem from "../Pages/LandingPages/AboutSystem";
/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

import Login from "../Pages/LandingPages/Login";

/*
|--------------------------------------------------------------------------
| Placeholder Pages
| Replace these imports with your real pages later.
|--------------------------------------------------------------------------
*/

const Dashboard = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Dashboard
  </div>
);

const Registry = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Registry
  </div>
);

const PatientQueue = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Patient Queue
  </div>
);

const DoctorSheet = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Doctor Sheet
  </div>
);

const Pharmacy = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Pharmacy
  </div>
);

const Analytics = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Analytics
  </div>
);

const UserManagement = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    User Management
  </div>
);

const AuditLogs = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    Audit Logs
  </div>
);

const Unauthorized = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold text-red-600">
    Unauthorized
  </div>
);

const NotFound = () => (
  <div className="flex h-screen items-center justify-center text-4xl font-bold">
    404 - Page Not Found
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* =======================================================
                    Public
                ======================================================== */}

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route path="/organization" element={<Organization />} />

        <Route path="/ramhis" element={<AboutSystem />} />
        {/* =======================================================
                    Protected
                ======================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/registry" element={<Registry />} />

          <Route path="/patient-queue" element={<PatientQueue />} />

          <Route path="/doctor-sheet" element={<DoctorSheet />} />

          <Route path="/pharmacy" element={<Pharmacy />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>

        {/* =======================================================
                    Admin Only
                ======================================================== */}

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/users" element={<UserManagement />} />
        </Route>

        {/* =======================================================
                    Error Pages
                ======================================================== */}

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
