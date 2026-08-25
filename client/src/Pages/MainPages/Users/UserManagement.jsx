import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  UserX,
} from "lucide-react";

// Services
import {
  getAllUsers,
  approveUser,
  rejectUser,
  updateUserStatus,
} from "../../../Services/adminService";

// Components
import ConfirmModal from "../../../Components/ui/ConfirmModal";
import AlertModal from "../../../Components/ui/AlertModal";
import TableSkeleton from "../../../Components/ui/TableSkeleton";
import CardSkeleton from "../../../Components/ui/CardSkeleton";
import UserDashboard from "../../../Components/admin/UserDashboard";
import AddUserModal from "../../../Components/admin/AddUserModal";
import EditUserModal from "../../../Components/admin/EditUserModal";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("pending");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
      setAlertMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // FILTER USERS
  // =========================

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      let matchesTab = false;

      if (tab === "pending") {
        matchesTab =
          user.verificationStatus === "Pending" ||
          user.status === "pending";
      }

      if (tab === "active") {
        matchesTab =
          user.verificationStatus === "Approved" ||
          user.status === "active";
      }

      if (tab === "deactivated") {
        matchesTab =
          user.verificationStatus === "Deactivated" ||
          user.verificationStatus === "Rejected" ||
          user.status === "deactivated";
      }

      const matchesRole =
        filter === "All" || user.role === filter;

      const matchesSearch =
        !normalizedSearch ||
        user.name?.toLowerCase().includes(normalizedSearch) ||
        user.email?.toLowerCase().includes(normalizedSearch) ||
        user.role?.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesRole && matchesSearch;
    });
  }, [users, tab, filter, search]);

  // =========================
  // APPROVE USER
  // =========================

  const handleApprove = async (id) => {
    try {
      await approveUser(id);

      setAlertMessage(
        "User approved successfully. A temporary password has been sent to the user's email.",
      );

      await loadUsers();
    } catch (error) {
      console.error("Approve user error:", error);

      setAlertMessage(
        error?.message || "Failed to approve user.",
      );
    }
  };

  // =========================
  // REJECT USER
  // =========================

  const handleReject = async (id) => {
    try {
      await rejectUser(id);

      setAlertMessage("User rejected successfully.");

      await loadUsers();
    } catch (error) {
      console.error("Reject user error:", error);

      setAlertMessage(
        error?.message || "Failed to reject user.",
      );
    }
  };

  // =========================
  // DEACTIVATE USER
  // =========================

  const handleDeactivate = async (id) => {
    try {
      await updateUserStatus(id, "Deactivated");

      setAlertMessage("User deactivated successfully.");

      await loadUsers();
    } catch (error) {
      console.error("Deactivate user error:", error);

      setAlertMessage(
        error?.message || "Failed to deactivate user.",
      );
    }
  };

  // =========================
  // REACTIVATE USER
  // =========================

  const handleReactivate = async (id) => {
    try {
      await updateUserStatus(id, "Approved");

      setAlertMessage("User reactivated successfully.");

      await loadUsers();
    } catch (error) {
      console.error("Reactivate user error:", error);

      setAlertMessage(
        error?.message || "Failed to reactivate user.",
      );
    }
  };

  // =========================
  // CONFIRM ACTION
  // =========================

  const openConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
  };

  const closeConfirm = () => {
    setConfirmAction(null);
    setConfirmMessage("");
  };

  // =========================
  // TAB LABEL
  // =========================

  const pageTitle =
    tab === "pending"
      ? "Pending Users"
      : tab === "active"
        ? "Active Users"
        : "Deactivated Users";

  const pageDescription =
    tab === "pending"
      ? "Review and manage new account registration requests."
      : tab === "active"
        ? "Manage approved and currently active system accounts."
        : "Review rejected and deactivated user accounts.";

  const activeCount = users.filter(
    (user) =>
      user.verificationStatus === "Approved" ||
      user.status === "active",
  ).length;

  const pendingCount = users.filter(
    (user) =>
      user.verificationStatus === "Pending" ||
      user.status === "pending",
  ).length;

  const deactivatedCount = users.filter(
    (user) =>
      user.verificationStatus === "Deactivated" ||
      user.verificationStatus === "Rejected" ||
      user.status === "deactivated",
  ).length;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1700px] space-y-6">

{/* =========================
    PAGE HEADER
========================= */}

<header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
      <Users size={22} />
    </div>

    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
        System Administration
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
        Account Management
      </h1>

      <p className="mt-1 text-sm text-text-muted">
        Manage system users, approvals, and account status.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() => setShowCreateModal(true)}
    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:self-auto"
  >
    <span className="text-lg leading-none">+</span>
    Add User
  </button>
</header>

        {/* =========================
            USER STATISTICS
        ========================= */}

        {loading ? (
          <CardSkeleton count={4} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniStatCard
                label="Total Users"
                value={users.length}
                icon={Users}
                iconClassName="bg-primary-100 text-primary-700"
              />

              <MiniStatCard
                label="Active Accounts"
                value={activeCount}
                icon={UserCheck}
                iconClassName="bg-emerald-50 text-emerald-600"
              />

              <MiniStatCard
                label="Pending Approval"
                value={pendingCount}
                icon={CircleAlert}
                iconClassName="bg-amber-50 text-amber-600"
              />

              <MiniStatCard
                label="Inactive Accounts"
                value={deactivatedCount}
                icon={UserX}
                iconClassName="bg-rose-50 text-rose-600"
              />
            </div>

            <UserDashboard users={users} />
          </>
        )}

        {/* =========================
            FILTER SECTION
        ========================= */}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Filter size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-text-primary">
                  Search & Filters
                </h2>

                <p className="text-xs text-text-muted">
                  Find and organize user accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Search */}

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
              />

              <input
                id="user-search"
                type="text"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-slate-50 py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-100"
              />
            </div>

            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              {/* Status */}

              <div>
                <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-text-subtle">
                  Account Status
                </p>

                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={tab === "active"}
                    onClick={() => setTab("active")}
                    icon={CheckCircle2}
                  >
                    Active
                  </FilterButton>

                  <FilterButton
                    active={tab === "pending"}
                    onClick={() => setTab("pending")}
                    icon={CircleAlert}
                  >
                    Pending
                  </FilterButton>

                  <FilterButton
                    active={tab === "deactivated"}
                    onClick={() => setTab("deactivated")}
                    icon={UserX}
                  >
                    Deactivated
                  </FilterButton>
                </div>
              </div>

              {/* Role */}

              <div>
                <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-text-subtle">
                  User Role
                </p>

                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={filter === "All"}
                    onClick={() => setFilter("All")}
                  >
                    All
                  </FilterButton>

                  <FilterButton
                    active={filter === "Doctor"}
                    onClick={() => setFilter("Doctor")}
                  >
                    Doctors
                  </FilterButton>

                  <FilterButton
                    active={filter === "Volunteer"}
                    onClick={() => setFilter("Volunteer")}
                  >
                    Volunteers
                  </FilterButton>

                  <FilterButton
                    active={filter === "Admin"}
                    onClick={() => setFilter("Admin")}
                  >
                    Admins
                  </FilterButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            TABLE SECTION
        ========================= */}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {/* Table Header */}

          <div className="border-b border-border px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Users size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      {pageTitle}
                    </h2>

                    <p className="mt-0.5 text-sm text-text-muted">
                      {pageDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="inline-flex w-fit items-center rounded-lg border border-border bg-slate-50 px-3 py-2">
                <span className="text-xs font-bold text-text-muted">
                  {filteredUsers.length} user
                  {filteredUsers.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="p-4 sm:p-5">
              <TableSkeleton rows={8} columns={7} />
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */

            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                <Users size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-text-primary">
                No users found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
                There are no users matching the current status,
                role, or search filters.
              </p>
            </div>
          ) : (
            /* Table */

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="bg-slate-50/80">
                  <tr className="border-b border-border">
                    <TableHeader>User</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date Added</TableHeader>
                    <TableHeader>License Proof</TableHeader>
                    <TableHeader>Doctorate Proof</TableHeader>
                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-soft">
                  {filteredUsers.map((user) => {
                    const userName =
                      user.name || "Unnamed User";

                    const userInitial =
                      userName.charAt(0).toUpperCase();

                    return (
                      <tr
                        key={user._id}
                        className="group transition-colors hover:bg-slate-50/70"
                      >
                        {/* User */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="flex items-center gap-3 text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700 transition group-hover:bg-primary-100">
                              {userInitial}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate font-bold text-text-primary transition group-hover:text-primary-700">
                                {userName}
                              </p>

                              <p className="mt-0.5 max-w-[230px] truncate text-xs text-text-muted">
                                {user.email || "No email"}
                              </p>
                            </div>
                          </button>
                        </td>

                        {/* Role */}

                        <td className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={user.verificationStatus}
                          />
                        </td>

                        {/* Date */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-text-secondary">
                          {user.createdAt
                            ? new Date(
                                user.createdAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* License */}

                        <td className="px-5 py-4">
                          {user.role === "Doctor" &&
                          user.doctorInfo?.proofOfLicense ? (
                            <a
                              href={
                                user.doctorInfo.proofOfLicense
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition hover:text-primary-800"
                            >
                              <FileCheck2 size={15} />
                              View
                            </a>
                          ) : (
                            <span className="text-text-subtle">
                              —
                            </span>
                          )}
                        </td>

                        {/* Doctorate */}

                        <td className="px-5 py-4">
                          {user.role === "Doctor" &&
                          user.doctorInfo?.proofOfDoctorate ? (
                            <a
                              href={
                                user.doctorInfo.proofOfDoctorate
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition hover:text-primary-800"
                            >
                              <FileText size={15} />
                              View
                            </a>
                          ) : (
                            <span className="text-text-subtle">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            {tab === "pending" && (
                              <>
                                <ActionButton
                                  variant="success"
                                  onClick={() =>
                                    openConfirm(
                                      "Are you sure you want to approve this user?",
                                      () =>
                                        handleApprove(
                                          user._id,
                                        ),
                                    )
                                  }
                                >
                                  Approve
                                </ActionButton>

                                <ActionButton
                                  variant="danger"
                                  onClick={() =>
                                    openConfirm(
                                      "Are you sure you want to reject this user?",
                                      () =>
                                        handleReject(
                                          user._id,
                                        ),
                                    )
                                  }
                                >
                                  Reject
                                </ActionButton>
                              </>
                            )}

                            {tab === "active" && (
                              <ActionButton
                                variant="danger"
                                onClick={() =>
                                  openConfirm(
                                    "Are you sure you want to deactivate this user?",
                                    () =>
                                      handleDeactivate(
                                        user._id,
                                      ),
                                  )
                                }
                              >
                                Deactivate
                              </ActionButton>
                            )}

                            {tab === "deactivated" && (
                              <ActionButton
                                variant="success"
                                onClick={() =>
                                  openConfirm(
                                    "Are you sure you want to reactivate this user?",
                                    () =>
                                      handleReactivate(
                                        user._id,
                                      ),
                                  )
                                }
                              >
                                Reactivate
                              </ActionButton>
                            )}

                            <ActionButton
                              variant="secondary"
                              onClick={() =>
                                setSelectedUser(user)
                              }
                            >
                              View / Edit
                              <ChevronRight size={14} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =========================
            CONFIRM MODAL
        ========================= */}

        {confirmAction && (
          <ConfirmModal
            message={confirmMessage}
            onConfirm={async () => {
              const action = confirmAction;

              closeConfirm();

              await action();
            }}
            onCancel={closeConfirm}
          />
        )}

        {/* =========================
            EDIT USER MODAL
        ========================= */}

        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSuccess={async () => {
              setSelectedUser(null);
              await loadUsers();
            }}
          />
        )}

        {/* =========================
            ADD USER MODAL
        ========================= */}

        {showCreateModal && (
          <AddUserModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={async () => {
              setShowCreateModal(false);
              await loadUsers();
            }}
          />
        )}

        {/* =========================
            ALERT
        ========================= */}

        {alertMessage && (
          <AlertModal
            message={alertMessage}
            onClose={() => setAlertMessage("")}
          />
        )}
      </div>
    </div>
  );
}

/* =====================================================
   SMALL UI COMPONENTS
===================================================== */

function MiniStatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-subtle">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
        active
          ? "bg-blue-950 text-white shadow-sm"
          : "border border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-slate-50"
      }`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function TableHeader({
  children,
  align = "left",
}) {
  return (
    <th
      className={`whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function ActionButton({
  children,
  variant = "secondary",
  onClick,
}) {
  const styles = {
    success:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",

    danger:
      "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",

    secondary:
      "border border-border bg-surface text-slate-700 hover:border-border-strong hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-sky-400/10 active:scale-[0.98] ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function RoleBadge({ role }) {
  const styles = {
    Admin:
      "border border-purple-200 bg-purple-50 text-purple-700",

    Doctor:
      "border border-primary-200 bg-primary-50 text-primary-700",

    Volunteer:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",

    Pharmacist:
      "border border-amber-200 bg-amber-50 text-amber-700",
  };

  const icons = {
    Admin: ShieldCheck,
    Doctor: UserRound,
    Volunteer: Users,
    Pharmacist: UserCheck,
  };

  const Icon = icons[role];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[role] ||
        "border border-slate-200 bg-slate-100 text-text-secondary"
      }`}
    >
      {Icon && <Icon size={13} />}
      {role || "Unknown"}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",

    Pending:
      "border border-amber-200 bg-amber-50 text-amber-700",

    Rejected:
      "border border-rose-200 bg-rose-50 text-rose-700",

    Deactivated:
      "border border-rose-200 bg-rose-50 text-rose-700",
  };

  const icons = {
    Approved: CheckCircle2,
    Pending: CircleAlert,
    Rejected: UserX,
    Deactivated: UserX,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[status] ||
        "border border-slate-200 bg-slate-100 text-text-secondary"
      }`}
    >
      {Icon && <Icon size={13} />}
      {status || "Unknown"}
    </span>
  );
}

export default UserManagement;