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
  setError("Unable to load dashboard data.");
}finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-text-muted">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-700" />

        <p className="text-sm font-medium">
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
    <div className="min-h-full w-full px-4 py-5 pb-6 text-text-primary sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-5">

        {/* HEADER */}
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-stable-dot opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-stable-dot" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                System Operational
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-primary-900 lg:text-4xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Monitor your healthcare operations and system activity.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border-soft bg-surface px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:w-auto">
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Today
            </span>

            <strong className="mt-1 block text-sm font-semibold text-primary-900">
              {currentDate}
            </strong>
          </div>
        </header>

        <DashboardCards summary={summary} />

        <main className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[1.45fr_1fr]">

          <div className="grid min-w-0 gap-5">
            <div className="min-w-0">
              <DashboardPatientGraphs
                patientTrends={patientTrends}
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
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

          <div className="min-w-0">
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