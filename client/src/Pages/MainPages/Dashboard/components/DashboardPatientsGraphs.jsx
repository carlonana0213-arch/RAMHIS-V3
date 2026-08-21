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

function DashboardPatientGraphs({ patientTrends = [] }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5eaf2",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Patients Over Time
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            Monthly comparison of patients, volunteers, and prescriptions.
          </p>
        </div>

        <span
          style={{
            padding: "7px 11px",
            borderRadius: "9px",
            background: "#f8fafc",
            border: "1px solid #e5eaf2",
            color: "#64748b",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Monthly Activity
        </span>
      </div>

      {patientTrends.length === 0 ? (
        <div
          style={{
            height: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          No trend data available
        </div>
      ) : (
        <div style={{ width: "100%", height: "360px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={patientTrends}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
              barGap={5}
            >
              <CartesianGrid
                stroke="#e8edf5"
                strokeDasharray="4 4"
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

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                  paddingTop: "14px",
                }}
              />

              <Bar
                dataKey="patients"
                name="Patients"
                fill="#1e3a8a"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />

              <Bar
                dataKey="volunteers"
                name="Volunteers"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />

              <Bar
                dataKey="prescriptions"
                name="Prescriptions"
                fill="#93c5fd"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DashboardPatientGraphs;