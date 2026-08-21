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
  statCardVariants,
  statusPillVariants,
  statusDotVariants,
  inventoryPanelVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

function DashboardInventoryGraphs({
  summary = {},
  topMedicines = [],
}) {
  const totalMedicines = Number(summary.totalMedicines || 0);
  const lowStock = Number(summary.lowStock || 0);
  const outOfStock = Number(summary.outOfStock || 0);

  const statusIconBase = {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[2fr_0.9fr]">
      {/* MEDICINE ACTIVITY MONITOR */}
      <div
  className={`${statCardVariants.base} flex h-full min-h-0 flex-col`}
  style={{ minWidth: 0 }}
>
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
              Pharmacy Monitor
            </span>

            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Medicine Usage
            </h3>

            <p
              style={{
                margin: "6px 0 0",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Most frequently prescribed medicines.
            </p>
          </div>

          <span
            className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
          >
            Usage Metrics
          </span>
        </div>

        {/* CHART */}
        {topMedicines.length === 0 ? (
          <div
            style={{
              height: "100%",
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #cbd5e1",
              borderRadius: "12px",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            No medicine usage data available
          </div>
        ) : (
          <div
  style={{
    width: "100%",
    flex: 1,
    minHeight: 0,
  }}
>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topMedicines}
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
                  dataKey="medicine"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
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
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    boxShadow:
                      "0 10px 25px rgba(15, 23, 42, 0.10)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Prescriptions"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={54}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* INVENTORY HEALTH */}
      <div
  className="grid h-full min-h-0"
  style={{
    gridTemplateRows: "repeat(3, 1fr)",
    gap: "12px",
  }}
>
        {/* STABLE */}
        <div
          className={`${statCardVariants.base} ${inventoryPanelVariants.stable}`}
          style={{
            minWidth: 0,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              height: "100%",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Inventory
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  className={statusDotVariants.stable}
                />

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Total Medicines
                </span>
              </div>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                {totalMedicines.toLocaleString()}
              </strong>
            </div>

            <div
              className={inventoryPanelVariants.iconStable}
              style={statusIconBase}
            >
              <FaCapsules />
            </div>
          </div>
        </div>

        {/* WATCH */}
        <div
          className={`${statCardVariants.base} ${inventoryPanelVariants.watch}`}
          style={{
            minWidth: 0,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              height: "100%",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Attention Required
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  className={statusDotVariants.watch}
                />

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Low Stock
                </span>
              </div>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                {lowStock.toLocaleString()}
              </strong>
            </div>

            <div
              className={inventoryPanelVariants.iconWatch}
              style={statusIconBase}
            >
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        {/* CRITICAL */}
        <div
          className={`${statCardVariants.base} ${inventoryPanelVariants.critical}`}
          style={{
            minWidth: 0,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              height: "100%",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Critical
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  className={statusDotVariants.critical}
                />

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Out of Stock
                </span>
              </div>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                {outOfStock.toLocaleString()}
              </strong>
            </div>

            <div
              className={inventoryPanelVariants.iconCritical}
              style={statusIconBase}
            >
              <FaBan />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInventoryGraphs;