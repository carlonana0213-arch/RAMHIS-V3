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
  dashboardCardVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

function DashboardPatientGraphs({ patientTrends = [] }) {
  const [showAllMonths, setShowAllMonths] = useState(false);

  const activeTrends = patientTrends.filter((item) => {
    const patients = Number(item.patients || 0);
    const volunteers = Number(item.volunteers || 0);
    const prescriptions = Number(item.prescriptions || 0);

    return (
      patients > 0 ||
      volunteers > 0 ||
      prescriptions > 0
    );
  });

  const chartData = showAllMonths
    ? patientTrends
    : activeTrends;

  const hasHiddenMonths =
    activeTrends.length < patientTrends.length;

  return (
    <div
      className={`${dashboardCardVariants.base} flex min-h-[420px] flex-col`}
    >
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Activity Monitor
          </span>

          <h3 className="text-lg font-bold tracking-tight text-primary-900 sm:text-xl">
            Patient Activity
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            Monthly patient visits, volunteer activity, and prescriptions.
          </p>
        </div>

        <span
          className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview} self-start`}
        >
          Live Metrics
        </span>
      </div>

      {/* EMPTY STATE */}
      {activeTrends.length === 0 ? (
        <div className="flex min-h-[280px] flex-1 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-muted px-4 text-center text-sm text-text-secondary">
          No activity data available
        </div>
      ) : (
        <>
          {/* CHART */}
          <div className="h-[280px] w-full">
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
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(79, 99, 217, 0.05)",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #EEF2F7",
                    boxShadow:
                      "0 8px 24px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "18px",
                    color: "#64748B",
                  }}
                />

                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill="#273A78"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />

                <Bar
                  dataKey="volunteers"
                  name="Volunteers"
                  fill="#667CEB"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />

                <Bar
                  dataKey="prescriptions"
                  name="Prescriptions"
                  fill="#B6C5FF"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TOGGLE */}
          {hasHiddenMonths && (
            <button
              type="button"
              onClick={() =>
                setShowAllMonths((previous) => !previous)
              }
              className="mt-4 self-center rounded-full px-4 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 hover:text-primary-900"
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