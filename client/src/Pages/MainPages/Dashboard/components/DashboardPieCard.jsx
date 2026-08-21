import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  dashboardCardVariants,
  statusPillVariants,
} from "../../../../ui/variants";

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
    .sort(
      (a, b) =>
        Number(b[valueKey]) - Number(a[valueKey])
    );

  const topThree = sortedData.slice(0, 3);

  return (
    <div
      className={`${dashboardCardVariants.base} flex h-full min-h-0 flex-col overflow-hidden`}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
          flexShrink: 0,
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
          className={`${statusPillVariants.base} ${statusPillVariants.stable} uppercase tracking-wide`}
        >
          Overview
        </span>
      </div>

      {/* EMPTY STATE */}
      {sortedData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-text-secondary">
          No data available
        </div>
      ) : (
        /* CONTENT */
        <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-2">
          
          {/* LEGEND */}
          <div className="min-w-0">
            {topThree.map((item, index) => (
              <div
                key={`${item[labelKey]}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    marginTop: "5px",
                    borderRadius: "50%",
                    background:
                      COLORS[index % COLORS.length],
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
                    {Number(
                      item[valueKey]
                    ).toLocaleString()}{" "}
                    records
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

          {/* PIE CHART */}
          <div className="h-full min-h-0 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={sortedData}
                  dataKey={valueKey}
                  nameKey={labelKey}
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow:
                      "0 8px 25px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                  formatter={(
                    value,
                    name,
                    props
                  ) => [
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