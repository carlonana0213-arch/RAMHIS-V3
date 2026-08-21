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

function DashboardInventoryGraphs({
  summary = {},
  topMedicines = [],
}) {
  const inventoryCard = {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
  };

  const statusIcon = {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 0.9fr)",
        gap: "18px",
        alignItems: "stretch",
      }}
    >
      {/* CHART */}
      <div style={inventoryCard}>
        <div style={{ marginBottom: "18px" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Most Prescribed Medicines
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            Medicines most frequently included in prescriptions.
          </p>
        </div>

        {topMedicines.length === 0 ? (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            No medicine data available
          </div>
        ) : (
          <div style={{ width: "100%", height: "310px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topMedicines}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#e8edf5"
                  strokeDasharray="4 4"
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
                    fill: "#f8fafc",
                  }}
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Prescriptions"
                  fill="#2563eb"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={58}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* INVENTORY STATUS */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "14px",
        }}
      >
        {/* TOTAL */}
        <div style={inventoryCard}>
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
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Total Medicines
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "27px",
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {summary.totalMedicines || 0}
              </strong>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#94a3b8",
                  fontSize: "10px",
                }}
              >
                Currently in inventory
              </p>
            </div>

            <div
              style={{
                ...statusIcon,
                background: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <FaCapsules />
            </div>
          </div>
        </div>

        {/* LOW STOCK */}
        <div
          style={{
            ...inventoryCard,
            borderColor: "#f6e6b8",
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
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Low Stock
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "27px",
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {summary.lowStock || 0}
              </strong>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#a16207",
                  fontSize: "10px",
                }}
              >
                Medicines requiring attention
              </p>
            </div>

            <div
              style={{
                ...statusIcon,
                background: "#fffbeb",
                color: "#d97706",
              }}
            >
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        {/* OUT OF STOCK */}
        <div
          style={{
            ...inventoryCard,
            borderColor: "#f4d6d6",
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
                  color: "#991b1b",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Out of Stock
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "27px",
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {summary.outOfStock || 0}
              </strong>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#b91c1c",
                  fontSize: "10px",
                }}
              >
                Currently unavailable
              </p>
            </div>

            <div
              style={{
                ...statusIcon,
                background: "#fef2f2",
                color: "#dc2626",
              }}
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