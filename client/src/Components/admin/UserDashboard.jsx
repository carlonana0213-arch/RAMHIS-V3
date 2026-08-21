import { useMemo } from "react";

import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
} from "react-icons/fa";

function UserDashboard({ users = [] }) {
  const stats = useMemo(() => {
    let active = 0;
    let pending = 0;
    let deactivated = 0;

    users.forEach((u) => {
      if (u.verificationStatus === "Approved") {
        active++;
      } else if (
        u.verificationStatus === "Pending"
      ) {
        pending++;
      } else if (
        u.verificationStatus === "Deactivated"
      ) {
        deactivated++;
      }
    });

    return {
      total: users.length,
      active,
      pending,
      deactivated,
    };
  }, [users]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <UserStatCard
        title="Total Users"
        value={stats.total}
        description="Registered system users"
        icon={<FaUsers />}
        iconClass="bg-blue-50 text-blue-700"
      />

      <UserStatCard
        title="Active Users"
        value={stats.active}
        description="Approved accounts"
        icon={<FaUserCheck />}
        iconClass="bg-emerald-50 text-emerald-700"
      />

      <UserStatCard
        title="Pending Users"
        value={stats.pending}
        description="Awaiting approval"
        icon={<FaUserClock />}
        iconClass="bg-amber-50 text-amber-700"
      />

      <UserStatCard
        title="Deactivated Users"
        value={stats.deactivated}
        description="Inactive accounts"
        icon={<FaUserSlash />}
        iconClass="bg-red-50 text-red-700"
      />
    </div>
  );
}

function UserStatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs font-medium text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;