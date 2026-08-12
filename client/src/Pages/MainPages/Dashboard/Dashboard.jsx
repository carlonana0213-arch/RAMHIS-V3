import { useEffect, useState } from "react";

import DashboardCards from "./components/DashboardCards";
import DashboardPatientsGraphs from "./components/DashboardPatientsGraphs";
import DashboardInventoryGraphs from "./components/DashboardInventoryGraphs";
import DashboardPieCard from "./components/DashboardPieCard";
import "../../../styles/dashboard.css";

import {
  getDashboardSummary,
  getPatientTrends,
  getDiagnosisDistribution,
  getTopMedicines,
} from "../../../Services/dashboardService";

import "../../../styles/dashboard.css";

export default function Dashboard() {
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

        setSummary(summaryData);
        setPatientTrends(trendsData);
        setDiagnosisData(diagnosisResult);
        setTopMedicines(medicinesResult);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
        </div>

        <button className="publish-btn">Publish</button>
      </div>

      <DashboardCards summary={summary} />

      <div className="dashboard-middle-row">
        <DashboardPieCard
          title="Diagnosis Distribution"
          data={diagnosisData}
          labelKey="name"
          valueKey="value"
        />

        <DashboardPieCard
          title="Prescribed Medicines"
          data={topMedicines}
          labelKey="medicine"
          valueKey="count"
        />
      </div>

      <DashboardPatientsGraphs
        patientTrends={patientTrends}
        diagnosisData={diagnosisData}
      />
    </div>
  );
}