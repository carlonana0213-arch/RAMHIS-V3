import { useEffect, useState } from "react";

import {
  getDashboardSummary,
  getPatientTrends,
  getDiagnosisDistribution,
  getTopMedicines,
} from "../../../Services/dashboardService";

import DashboardCards from "./components/DashboardCards";
import DashboardPatientGraphs from "./components/DashboardPatientsGraphs";
import DashboardInventoryGraphs from "./components/DashboardInventoryGraphs";
import DashboardPieCard from "./components/DashboardPieCard";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [patientTrends, setPatientTrends] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          summaryData,
          trendsData,
          diagnosisResult,
          medicinesResult,
        ] = await Promise.all([
          getDashboardSummary(),
          getPatientTrends(),
          getDiagnosisDistribution(),
          getTopMedicines(),
        ]);

        setSummary(summaryData || {});
        setPatientTrends(trendsData || []);
        setDiagnosisData(diagnosisResult || []);
        setTopMedicines(medicinesResult || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily: "Poppins, sans-serif",
          color: "#64748b",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            border: "3px solid #dbeafe",
            borderTop: "3px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          Loading dashboard...
        </p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "28px 32px",
        boxSizing: "border-box",
        background: "#f8fafc",
        fontFamily: "Poppins, sans-serif",
        color: "#0f172a",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "#2563eb",
            }}
          >
            RAMHIS OVERVIEW
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#0f172a",
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Monitor patient activity, healthcare services, and pharmacy
            resources.
          </p>
        </div>

        <div
          style={{
            padding: "12px 18px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "3px",
            }}
          >
            Today
          </span>

          <strong
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            {currentDate}
          </strong>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <DashboardCards summary={summary} />

      {/* HEALTH OVERVIEW */}
      <section style={{ marginTop: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Health Overview
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Current distribution of patient and prescription data.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <DashboardPieCard
            title="Diagnosis Distribution"
            subtitle="Top recorded diagnoses"
            data={diagnosisData}
            labelKey="name"
            valueKey="value"
          />

          <DashboardPieCard
            title="Prescribed Medicines"
            subtitle="Most frequently prescribed"
            data={topMedicines}
            labelKey="medicine"
            valueKey="count"
          />
        </div>
      </section>

      {/* PATIENT ACTIVITY */}
      <section style={{ marginTop: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Patient Activity
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Patient visits, volunteers, and prescriptions over time.
          </p>
        </div>

        <DashboardPatientGraphs
          patientTrends={patientTrends}
        />
      </section>

      {/* PHARMACY */}
      <section style={{ marginTop: "32px", paddingBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Pharmacy Overview
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Monitor medicine usage and current inventory levels.
          </p>
        </div>

        <DashboardInventoryGraphs
          summary={summary}
          topMedicines={topMedicines}
        />
      </section>
    </div>
  );
}

export default Dashboard;