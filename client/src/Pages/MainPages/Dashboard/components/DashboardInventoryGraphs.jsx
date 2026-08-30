import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  FaCapsules,
  FaExclamationTriangle,
  FaBan,
} from "react-icons/fa";

import {
  dashboardCardVariants,
  statusDotVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

function DashboardInventoryGraphs({
  summary = {},
  topMedicines = [],
}) {
  const totalMedicines = Number(
    summary.totalMedicines || 0
  );

  const lowStock = Number(
    summary.lowStock || 0
  );

  const outOfStock = Number(
    summary.outOfStock || 0
  );

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 2xl:grid-cols-[2.2fr_0.8fr]">

      {/* =====================================================
          MEDICINE ACTIVITY MONITOR
      ====================================================== */}
      <div
        className={`${dashboardCardVariants.base} flex min-h-[420px] min-w-0 flex-col`}
      >
        {/* HEADER */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Pharmacy Monitor
            </span>

            <h3 className="text-lg font-bold tracking-tight text-primary-900 sm:text-xl">
              Medicine Usage
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              Most frequently prescribed medicines.
            </p>
          </div>

          <span
            className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview} self-start`}
          >
            Usage Metrics
          </span>

        </div>

        {/* CHART */}
        {topMedicines.length === 0 ? (
          <div className="flex min-h-[280px] flex-1 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-muted px-4 text-center text-sm text-text-muted">
            No medicine usage data available
          </div>
        ) : (
          <div className="h-[280px] w-full flex-1 sm:h-[320px] lg:h-[360px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={topMedicines}
                margin={{
                  top: 12,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="3 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="medicine"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(102, 124, 235, 0.06)",
                  }}
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    boxShadow:
                      "0 10px 30px rgba(15, 23, 42, 0.10)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Prescriptions"
                  fill="#1E2A5E"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={54}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        )}
      </div>

      {/* =====================================================
          INVENTORY HEALTH
      ====================================================== */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 2xl:grid-cols-1">

        {/* TOTAL MEDICINES */}
        <div className="flex min-w-0 items-center justify-between rounded-[20px] border border-border-soft bg-surface p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">

          <div className="min-w-0">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Inventory
            </span>

            <div className="mb-2 flex items-center gap-2">
              <span className={statusDotVariants.stable} />

              <span className="text-xs font-bold text-text-primary">
                Total Medicines
              </span>
            </div>

            <strong className="block text-3xl font-bold leading-none tracking-tight text-text-primary">
              {totalMedicines.toLocaleString()}
            </strong>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-status-stable-bg text-lg text-status-stable-text">
            <FaCapsules />
          </div>

        </div>

        {/* LOW STOCK */}
        <div className="flex min-w-0 items-center justify-between rounded-[20px] bg-[#F4C95D] p-5 shadow-[0_8px_24px_rgba(244,201,93,0.22)]">

          <div className="min-w-0">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B4E00]">
              Attention Needed
            </span>

            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#A56A00]" />

              <span className="text-xs font-bold text-[#3F2A00]">
                Low Stock
              </span>
            </div>

            <strong className="block text-3xl font-bold leading-none tracking-tight text-[#1E2A5E]">
              {lowStock.toLocaleString()}
            </strong>
          </div>

          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/35 text-lg text-primary-900"
          >
            <FaExclamationTriangle />
          </div>

        </div>

        {/* OUT OF STOCK */}
        <div className="flex min-w-0 items-center justify-between rounded-[20px] border border-status-critical-border bg-status-critical-bg p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

          <div className="min-w-0">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.12em] text-status-critical-text">
              Critical
            </span>

            <div className="mb-2 flex items-center gap-2">
              <span className={statusDotVariants.critical} />

              <span className="text-xs font-bold text-text-primary">
                Out of Stock
              </span>
            </div>

            <strong className="block text-3xl font-bold leading-none tracking-tight text-text-primary">
              {outOfStock.toLocaleString()}
            </strong>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-lg text-status-critical-text">
            <FaBan />
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardInventoryGraphs;