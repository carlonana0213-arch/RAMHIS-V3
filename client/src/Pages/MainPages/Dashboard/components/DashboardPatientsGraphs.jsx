import { useState } from "react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  statCardVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

function DashboardPatientGraphs({ patientTrends = [] }) {
  const [showAllMonths, setShowAllMonths] = useState(false);

  const activeTrends = patientTrends.filter((item) => {
    const patients = Number(item.patients || 0);
    const volunteers = Number(item.volunteers || 0);
    const prescriptions = Number(item.prescriptions || 0);

    return patients > 0 || volunteers > 0 || prescriptions > 0;
  });

  const chartData = showAllMonths
    ? patientTrends
    : activeTrends;

  const hasHiddenMonths =
    activeTrends.length < patientTrends.length;

  return (
    <div className={`${statCardVariants.base} flex h-full min-h-0 flex-col`}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.9px",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            Activity Monitor
          </span>

          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Patient Activity
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            Monthly patient visits, volunteer activity, and prescriptions.
          </p>
        </div>

        <span
          className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
        >
          Live Metrics
        </span>
      </div>

      {/* CHART */}
      {activeTrends.length === 0 ? (
        <div className="flex min-h-[240px] flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-text-secondary">
  No activity data available
</div>
            ) : (
        <>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.04)",
                  }}
                />

                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "18px",
                    color: "#64748b",
                  }}
                />

                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill="#1e3a8a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />

                <Bar
                  dataKey="volunteers"
                  name="Volunteers"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />

                <Bar
                  dataKey="prescriptions"
                  name="Prescriptions"
                  fill="#93c5fd"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {hasHiddenMonths && (
            <button
              type="button"
              onClick={() => setShowAllMonths(!showAllMonths)}
              className="mt-2 self-center text-xs font-semibold text-primary-700 hover:text-primary-900"
            >
              {showAllMonths
                ? "Hide Empty Months"
                : "Show All Months"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPatientGraphs;