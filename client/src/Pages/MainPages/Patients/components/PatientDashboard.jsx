import {
  FaBaby,
  FaBone,
  FaEye,
  FaTooth,
  FaHeartbeat,
  FaStethoscope,
} from "react-icons/fa";

import {
  dashboardCardVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
];

const departmentConfig = {
  Pediatrics: {
    icon: FaBaby,
    iconBg: "bg-primary-50",
    iconColor: "text-primary-700",
  },

  Ortho: {
    icon: FaBone,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-700",
  },

  Opta: {
    icon: FaEye,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
  },

  Dental: {
    icon: FaTooth,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },

  Cardio: {
    icon: FaHeartbeat,
    iconBg: "bg-status-critical-bg",
    iconColor: "text-status-critical-text",
  },

  General: {
    icon: FaStethoscope,
    iconBg: "bg-slate-100",
    iconColor: "text-text-secondary",
  },
};

function DepartmentSkeleton() {
  return (
    <section>
      {/* SECTION HEADER SKELETON */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-3 w-52 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
      </div>

      {/* CARD SKELETON */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {departments.map((department) => (
          <div
            key={department}
            className="animate-pulse rounded-[20px] border border-border-soft bg-surface p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <div className="h-11 w-11 rounded-2xl bg-slate-200" />

            <div className="mt-5 h-3 w-20 rounded bg-slate-200" />

            <div className="mt-3 h-8 w-12 rounded bg-slate-200" />

            <div className="mt-2 h-3 w-14 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PatientDashboard({
  summary = {},
  loading = false,
}) {
  if (loading) {
    return <DepartmentSkeleton />;
  }

  const getCount = (department) => {
    return Number(summary?.[department]) || 0;
  };

  const totalActive = departments.reduce(
    (total, department) =>
      total + getCount(department),
    0
  );

  return (
    <section className="min-w-0">

      {/* SECTION HEADER */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">

        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Patient Overview
          </span>

          <h2 className="text-lg font-bold tracking-tight text-primary-900">
            Department Activity
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Active patients currently assigned by department.
          </p>
        </div>

        <span
          className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
        >
          {totalActive.toLocaleString()} Active
        </span>

      </div>

      {/* DEPARTMENT CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">

        {departments.map((department) => {
          const config =
            departmentConfig[department];

          const Icon = config.icon;

          const count =
            getCount(department);

          return (
            <div
              key={department}
              className={[
                dashboardCardVariants.base,
                "group min-w-0 rounded-[20px] border-0 p-4",
                "shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
              ].join(" ")}
            >

              {/* ICON */}
              <div
                className={[
                  "flex h-11 w-11 items-center justify-center",
                  "rounded-2xl transition-transform duration-200",
                  "group-hover:scale-105",
                  config.iconBg,
                  config.iconColor,
                ].join(" ")}
              >
                <Icon size={18} />
              </div>

              {/* CONTENT */}
              <div className="mt-5">

                <p className="truncate text-xs font-semibold text-text-muted">
                  {department}
                </p>

                <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-primary-900">
                  {count.toLocaleString()}
                </p>

                <div className="mt-3 flex items-center gap-1.5">

                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      count > 0
                        ? "bg-status-stable-dot"
                        : "bg-slate-300",
                    ].join(" ")}
                  />

                  <span className="text-[10px] font-medium text-text-subtle">
                    {count === 1
                      ? "1 patient"
                      : `${count.toLocaleString()} patients`}
                  </span>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}