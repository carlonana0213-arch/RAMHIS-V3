import { useState } from "react";

import PatientQueue from "./components/PatientQueue";
import PatientDashboard from "./components/PatientDashboard";
import AddPatientModal from "./components/AddPatientModal";
import PatientViewModal from "./components/PatientViewModal";

import "../../../styles/patient.css";

export default function Patients() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="patient-page">
      {/* HEADER */}
      <div className="patient-header">
        <h2>Patient Queue</h2>

        <button
          className="add-patient-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Patient
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="patient-content">
        <PatientDashboard />

        <PatientQueue
          onSelectPatient={setSelectedPatient}
        />
      </div>

      {/* ADD PATIENT */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* VIEW PATIENT */}
      {selectedPatient && (
        <PatientViewModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}