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
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-text-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-100 border-t-primary-700" />

        <p className="text-sm">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
<div className="h-[calc(100vh-64px)] w-full overflow-y-auto overflow-x-hidden bg-background-soft p-3 text-text-primary lg:p-4">
  <div className="mx-auto grid min-h-full max-w-[1900px] grid-rows-[auto_auto_minmax(0,1fr)] gap-3">

        {/* HEADER */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-status-stable-dot" />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                System Operational
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Dashboard
            </h1>
          </div>

          <div className="rounded-lg border border-border bg-surface px-4 py-2 shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-text-muted">
              Today
            </span>

            <strong className="text-xs text-text-primary">
              {currentDate}
            </strong>
          </div>
        </header>

        {/* METRIC CARDS */}
        <DashboardCards summary={summary} />

        {/* MAIN DASHBOARD GRID */}
{/* MAIN DASHBOARD GRID */}
{/* MAIN DASHBOARD GRID */}
<main className="grid min-h-0 h-full grid-cols-1 gap-3 xl:grid-cols-[1.45fr_1fr]">

  {/* LEFT */}
  <div className="grid min-h-0 h-full grid-rows-[1.15fr_0.85fr] gap-3">

    <div className="min-h-0">
      <DashboardPatientGraphs
        patientTrends={patientTrends}
      />
    </div>

    <div className="grid min-h-0 h-full grid-cols-1 gap-3 md:grid-cols-2">
      <DashboardPieCard
        title="Diagnosis Distribution"
        subtitle="Top diagnoses"
        data={diagnosisData}
        labelKey="name"
        valueKey="value"
      />

      <DashboardPieCard
        title="Medicine Distribution"
        subtitle="Most prescribed"
        data={topMedicines}
        labelKey="medicine"
        valueKey="count"
      />
    </div>

  </div>

  {/* RIGHT */}
  <div className="min-h-0 h-full">
    <DashboardInventoryGraphs
      summary={summary}
      topMedicines={topMedicines}
    />
  </div>

</main>
      </div>
    </div>
  );
}

export default Dashboard;