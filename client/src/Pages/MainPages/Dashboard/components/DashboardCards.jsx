import {
  FaUserInjured,
  FaUsers,
  FaCapsules,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  statCardVariants,
  statusPillVariants,
} from "../../../../ui/variants";

function DashboardCards({ summary = {} }) {
  const patientDiff = Number(summary.patientIncrease || 0);
  const userDiff = Number(summary.userIncrease || 0);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

      {/* TOTAL PATIENTS */}
      <div
        className={`${statCardVariants.base} rounded-2xl border-0 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]`}
      >
        <div className="flex items-start justify-between gap-4">

          <div>
            <span className="mb-3 block text-sm font-medium text-text-muted">
              Total Patients
            </span>

            <strong className="block text-[36px] font-bold leading-none tracking-tight text-primary-900">
              {(summary.totalPatients || 0).toLocaleString()}
            </strong>
          </div>

          <div
            className={`${statCardVariants.icon} flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-xl text-primary-700`}
          >
            <FaUserInjured />
          </div>

        </div>

        <div
          className={`mt-6 flex items-center gap-2 border-t border-border-soft pt-4 text-xs font-semibold ${
            patientDiff >= 0
              ? "text-status-stable-text"
              : "text-status-critical-text"
          }`}
        >
          {patientDiff >= 0 ? (
            <FaArrowUp />
          ) : (
            <FaArrowDown />
          )}

          <span>
            {Math.abs(patientDiff).toLocaleString()} patients added this month
          </span>
        </div>
      </div>

      {/* TOTAL VOLUNTEERS */}
      <div
        className={`${statCardVariants.base} rounded-2xl border-0 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]`}
      >
        <div className="flex items-start justify-between gap-4">

          <div>
            <span className="mb-3 block text-sm font-medium text-text-muted">
              Total Volunteers
            </span>

            <strong className="block text-[36px] font-bold leading-none tracking-tight text-primary-900">
              {(summary.totalUsers || 0).toLocaleString()}
            </strong>
          </div>

          <div
            className={`${statCardVariants.icon} flex h-12 w-12 items-center justify-center rounded-2xl bg-status-stable-bg text-xl text-status-stable-text`}
          >
            <FaUsers />
          </div>

        </div>

        <div
          className={`mt-6 flex items-center gap-2 border-t border-border-soft pt-4 text-xs font-semibold ${
            userDiff >= 0
              ? "text-status-stable-text"
              : "text-status-critical-text"
          }`}
        >
          {userDiff >= 0 ? (
            <FaArrowUp />
          ) : (
            <FaArrowDown />
          )}

          <span>
            {Math.abs(userDiff).toLocaleString()} compared to previous month
          </span>
        </div>
      </div>

      {/* TOTAL MEDICINES / ATTENTION CARD */}
      <div
        className={`${statCardVariants.base} rounded-2xl border-0 bg-warning-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]`}
      >
        <div className="flex items-start justify-between gap-4">

          <div>
            <span className="mb-3 block text-sm font-semibold text-warning-800">
              Total Medicines
            </span>

            <strong className="block text-[36px] font-bold leading-none tracking-tight text-warning-900">
              {(summary.totalMedicines || 0).toLocaleString()}
            </strong>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning-200 text-xl text-warning-800">
            <FaCapsules />
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-warning-200 pt-4">

          <span
            className={`${statusPillVariants.base} ${statusPillVariants.watch}`}
          >
            <FaExclamationTriangle />

            Low Stock: {summary.lowStock || 0}
          </span>

          <span
            className={`${statusPillVariants.base} ${statusPillVariants.critical}`}
          >
            Out of Stock: {summary.outOfStock || 0}
          </span>

        </div>
      </div>

    </div>
  );
}

export default DashboardCards;