import {
  FaBaby,
  FaBone,
  FaEye,
  FaTooth,
  FaHeartbeat,
  FaStethoscope,
  FaBrain,
  FaMicroscope,
  FaCut,
  FaSyringe,
  FaWalking,
  FaUserMd,
  FaChild,
  FaAllergies,
} from "react-icons/fa";

const departments = [
  {
    name: "Pediatrics",
    key: "Pediatrics",
  },
  {
    name: "Ortho",
    key: "Ortho",
  },
  {
    name: "Opta",
    key: "Ophthalmology",
  },
  {
    name: "Dental",
    key: "Dental",
  },
  {
    name: "Cardio",
    key: "Cardio",
  },
  {
    name: "General",
    key: "General",
  },
  {
    name: "Neurology",
    key: "Neurology",
  },
  {
    name: "Pathology",
    key: "Pathology",
  },
  {
    name: "Circumcision",
    key: "Circumcision",
  },
  {
    name: "Surgery",
    key: "Surgery",
  },
  {
    name: "PT & Rehabilitation",
    key: "PT",
  },
  {
    name: "OB-Gyn",
    key: "OBGyn",
  },
  {
    name: "Dermatology",
    key: "Dermatology",
  },
  {
    name: "Adult Medicine",
    key: "AdultMed",
  },
];

const departmentConfig = {
  Pediatrics: {
    icon: FaBaby,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
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
    iconColor: "text-text-secondary",
  },

  Neurology: {
    icon: FaBrain,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },

  Pathology: {
    icon: FaMicroscope,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },

  Circumcision: {
    icon: FaCut,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },

  Surgery: {
    icon: FaSyringe,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },

  "PT & Rehabilitation": {
    icon: FaWalking,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },

  "OB-Gyn": {
    icon: FaChild,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },

  Dermatology: {
    icon: FaAllergies,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },

  "Adult Medicine": {
    icon: FaUserMd,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
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
        {departments.map((department) => (
          <div
            key={department.name}
            className="animate-pulse rounded-2xl border border-border bg-surface p-4 shadow-sm"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-200" />

            <div className="mt-4 h-3 w-20 rounded bg-slate-200" />

            <div className="mt-2 h-7 w-10 rounded bg-slate-200" />
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

  const getCount = (departmentKey) => {
    return Number(
      summary?.[departmentKey]
    ) || 0;
  };

  const totalActive =
    departments.reduce(
      (total, department) =>
        total +
        getCount(department.key),
      0
    );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary">
            Department Overview
          </h2>

          <p className="mt-0.5 text-xs text-text-muted">
            Active patients by department
          </p>
        </div>

        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {totalActive} active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {departments.map((department) => {
          const config =
            departmentConfig[
              department.name
            ];

          const Icon =
            config.icon;

          const count =
            getCount(
              department.key
            );

          return (
            <div
              key={department.name}
              className={[
                "group rounded-2xl border border-border bg-surface p-4",
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
                <p className="text-xs font-semibold text-text-muted">
                  {department.name}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
                  {count}
                </p>

                <p className="mt-1 text-[11px] text-text-subtle">
                  {count === 1
                    ? "patient"
                    : "patients"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}