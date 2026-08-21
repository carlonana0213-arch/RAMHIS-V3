import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = [
  "#1e3a8a",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

function DashboardPieCard({
  title,
  subtitle,
  data = [],
  labelKey,
  valueKey,
}) {
  const sortedData = [...data]
    .filter((item) => Number(item[valueKey]) > 0)
    .sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));

  const topThree = sortedData.slice(0, 3);

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
          marginBottom: "8px",
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
            {title}
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            {subtitle}
          </p>
        </div>

        <span
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            background: "#eff6ff",
            color: "#2563eb",
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Overview
        </span>
      </div>

      {sortedData.length === 0 ? (
        <div
          style={{
            minHeight: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          No data available
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(140px, 0.9fr) minmax(180px, 1.1fr)",
            alignItems: "center",
            gap: "10px",
            minHeight: "250px",
          }}
        >
          <div>
            {topThree.map((item, index) => (
              <div
                key={`${item[labelKey]}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    marginTop: "5px",
                    borderRadius: "50%",
                    background: COLORS[index % COLORS.length],
                    flexShrink: 0,
                  }}
                />

                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item[labelKey]}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "3px",
                      fontSize: "11px",
                      color: "#94a3b8",
                    }}
                  >
                    {Number(item[valueKey]).toLocaleString()} records
                  </span>
                </div>
              </div>
            ))}

            {sortedData.length > 3 && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "2px",
                  color: "#2563eb",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                +{sortedData.length - 3} more
              </span>
            )}
          </div>

          <div style={{ width: "100%", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={245}>
              <PieChart>
                <Pie
                  data={sortedData}
                  dataKey={valueKey}
                  nameKey={labelKey}
                  innerRadius={62}
                  outerRadius={91}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                  formatter={(value, name, props) => [
                    Number(value).toLocaleString(),
                    props.payload[labelKey],
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPieCard;