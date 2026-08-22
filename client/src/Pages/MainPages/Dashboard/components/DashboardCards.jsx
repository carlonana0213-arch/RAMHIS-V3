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
<div className="grid grid-cols-1 gap-3 md:grid-cols-3">     
  <div className={statCardVariants.base}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="mb-2 block text-sm font-semibold text-text-secondary">
              Total Patients
            </span>

            <strong className="block text-[30px] font-bold leading-none tracking-tight text-text-primary">
              {(summary.totalPatients || 0).toLocaleString()}
            </strong>
          </div>

          <div className={statCardVariants.icon}>
            <FaUserInjured />
          </div>
        </div>

        <div
          className={`mt-3 flex items-center gap-2 border-t border-border-soft pt-4 text-xs font-semibold ${
            patientDiff >= 0
              ? "text-status-stable-text"
              : "text-status-critical-text"
          }`}
        >
          {patientDiff >= 0 ? <FaArrowUp /> : <FaArrowDown />}

          <span>
            {Math.abs(patientDiff).toLocaleString()} patients added this month
          </span>
        </div>
      </div>

      {/* VOLUNTEERS */}
      <div className={statCardVariants.base}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="mb-2 block text-sm font-semibold text-text-secondary">
              Total Volunteers
            </span>

            <strong className="block text-[34px] font-bold leading-none tracking-tight text-text-primary">
              {(summary.totalUsers || 0).toLocaleString()}
            </strong>
          </div>

          <div
            className={`${statCardVariants.icon} bg-status-stable-bg text-status-stable-text`}
          >
            <FaUsers />
          </div>
        </div>

        <div
          className={`mt-5 flex items-center gap-2 border-t border-border-soft pt-3 text-xs font-semibold ${
            userDiff >= 0
              ? "text-status-stable-text"
              : "text-status-critical-text"
          }`}
        >
          {userDiff >= 0 ? <FaArrowUp /> : <FaArrowDown />}

          <span>
            {Math.abs(userDiff).toLocaleString()} compared to previous month
          </span>
        </div>
      </div>

      {/* MEDICINES */}
      <div className={statCardVariants.base}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="mb-2.5 block text-sm font-semibold text-text-secondary">
              Total Medicines
            </span>

            <strong className="block text-[34px] font-bold leading-none tracking-tight text-text-primary">
              {(summary.totalMedicines || 0).toLocaleString()}
            </strong>
          </div>

          <div
            className={`${statCardVariants.icon} bg-status-watch-bg text-primary-700`}
          >
            <FaCapsules />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border-soft pt-4">
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