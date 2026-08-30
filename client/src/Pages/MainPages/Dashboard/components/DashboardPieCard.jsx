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
  "#1E2A5E",
  "#667CEE",
  "#F4C95D",
  "#E87979",
  "#63B995",
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
      className={`${dashboardCardVariants.base} flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]`}
    >
      {/* HEADER */}
      <div className="mb-4 flex shrink-0 items-start justify-between gap-3">

        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-primary-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            {subtitle}
          </p>
        </div>

        <span
          className={`${statusPillVariants.base} ${statusPillVariants.stable} px-2.5 py-1 text-[9px] uppercase tracking-[0.1em]`}
        >
          Overview
        </span>

      </div>

      {/* EMPTY STATE */}
      {sortedData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border-strong text-sm text-text-muted">
          No data available
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-3">

          {/* LEGEND */}
          <div className="min-w-0 space-y-3">

            {topThree.map((item, index) => (
              <div
                key={`${item[labelKey]}-${index}`}
                className="flex items-start gap-2.5"
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <div className="min-w-0">

                  <strong
                    className="block truncate text-xs font-semibold text-text-primary"
                    title={item[labelKey]}
                  >
                    {item[labelKey]}
                  </strong>

                  <span className="mt-1 block text-[11px] text-text-muted">
                    {Number(item[valueKey]).toLocaleString()} records
                  </span>

                </div>
              </div>
            ))}

            {sortedData.length > 3 && (
              <span className="inline-block pt-1 text-[11px] font-bold text-primary-700">
                +{sortedData.length - 3} more
              </span>
            )}

          </div>

          {/* PIE CHART */}
          <div className="h-full min-h-[170px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={sortedData}
                  dataKey={valueKey}
                  nameKey={labelKey}
                  innerRadius="56%"
                  outerRadius="80%"
                  paddingAngle={4}
                  stroke="#FFFFFF"
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
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    boxShadow:
                      "0 10px 30px rgba(15, 23, 42, 0.10)",
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