import {
  FaBaby,
  FaBone,
  FaEye,
  FaTooth,
  FaHeartbeat,
  FaStethoscope,
} from "react-icons/fa";

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
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },

  Ortho: {
    icon: FaBone,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },

  Opta: {
    icon: FaEye,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },

  Dental: {
    icon: FaTooth,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },

  Cardio: {
    icon: FaHeartbeat,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },

  General: {
    icon: FaStethoscope,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
};

function DepartmentSkeleton() {
  return (
    <section>

      <div className="mb-3">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-3 w-52 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {departments.map(
          (department) => (
            <div
              key={department}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-200" />

              <div className="mt-4 h-3 w-20 rounded bg-slate-200" />

              <div className="mt-2 h-7 w-10 rounded bg-slate-200" />
            </div>
          )
        )}
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

  const getCount = (
    department
  ) => {
    return Number(
      summary?.[department]
    ) || 0;
  };

  const totalActive =
    departments.reduce(
      (total, department) =>
        total +
        getCount(department),
      0
    );

  return (
    <section>

      <div className="mb-3 flex items-center justify-between">

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Department Overview
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Active patients by department
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {totalActive} active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {departments.map(
          (department) => {
            const config =
              departmentConfig[
                department
              ];

            const Icon =
              config.icon;

            const count =
              getCount(
                department
              );

            return (
              <div
                key={department}
                className={[
                  "group rounded-2xl border border-slate-200 bg-white p-4",
                  "shadow-sm transition duration-200",
                  "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md",
                ].join(" ")}
              >

                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    config.iconBg,
                    config.iconColor,
                  ].join(" ")}
                >
                  <Icon size={17} />
                </div>

                <div className="mt-4">

                  <p className="text-xs font-semibold text-slate-500">
                    {department}
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    {count}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {count === 1
                      ? "patient"
                      : "patients"}
                  </p>

                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}