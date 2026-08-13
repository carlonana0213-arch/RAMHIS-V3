import { useEffect, useState } from "react";
import { apiFetch } from "../../../../Services/api";

import "../../../../styles/queue.css";

import {
  FaBaby,
  FaBone,
  FaEye,
  FaTooth,
  FaHeartbeat,
  FaStethoscope,
} from "react-icons/fa";

const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
];

const departmentIcons = {
  Pediatrics: <FaBaby />,
  Ortho: <FaBone />,
  Opta: <FaEye />,
  Dental: <FaTooth />,
  Cardio: <FaHeartbeat />,
  General: <FaStethoscope />,
};

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiFetch(
          "http://localhost:5000/api/patients/queue"
        );

        setPatients(data);
      } catch (err) {
        console.error(
          "Error loading dashboard patients",
          err
        );
      }
    };

    fetchPatients();
  }, []);

  const activePatients = patients.filter(
    (patient) => patient.status !== "released"
  );

  const getDepartmentCount = (department) => {
    return activePatients.filter(
      (patient) => patient.department === department
    ).length;
  };

  return (
    <div className="patient-dashboard">
      {departments.map((department) => (
        <div
          className="patient-card"
          key={department}
        >
          <div className="patient-card-icon">
            {departmentIcons[department]}
          </div>

          <div className="patient-card-content">
            <h4>{department}</h4>

            <p>{getDepartmentCount(department)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}