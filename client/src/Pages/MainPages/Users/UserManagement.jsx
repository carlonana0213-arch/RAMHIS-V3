import { useEffect, useMemo, useState } from "react";

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

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Account Management
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage system users, approvals, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Add User
        </button>
      </div>

      {/* =========================
          USER STATISTICS
      ========================= */}

      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <UserDashboard users={users} />
      )}

      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search */}

          <div className="w-full">
            <label
              htmlFor="user-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search Users
            </label>

            <input
              id="user-search"
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filters */}

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Status */}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                Account Status
              </p>

              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={tab === "active"}
                  onClick={() => setTab("active")}
                >
                  Active
                </FilterButton>

                <FilterButton
                  active={tab === "pending"}
                  onClick={() => setTab("pending")}
                >
                  Pending
                </FilterButton>

                <FilterButton
                  active={tab === "deactivated"}
                  onClick={() => setTab("deactivated")}
                >
                  Deactivated
                </FilterButton>
              </div>
            </div>

            {/* Role */}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                Role
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
      </div>

      {/* =========================
          TABLE SECTION
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {/* Table Header */}

        <div className="border-b border-border px-5 py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {pageTitle}
              </h2>

              <p className="text-sm text-text-muted">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={8} columns={7} />
          </div>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */

          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              👥
            </div>

            <h3 className="text-base font-bold text-text-primary">
              No users found
            </h3>

            <p className="mt-1 max-w-md text-sm text-text-muted">
              There are no users matching the current status,
              role, or search filters.
            </p>
          </div>
        ) : (
          /* Table */

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-border">
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Date Added</TableHeader>
                  <TableHeader>License Proof</TableHeader>
                  <TableHeader>Doctorate Proof</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-soft">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Name */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="text-left"
                      >
                        <p className="font-semibold text-text-primary hover:text-primary-700">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          {user.email || "No email"}
                        </p>
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

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-text-secondary">
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
                          className="font-semibold text-primary-600 hover:text-blue-800 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-text-subtle">
                          -
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
                          className="font-semibold text-primary-600 hover:text-blue-800 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-text-subtle">
                          -
                        </span>
                      )}
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {tab === "pending" && (
                          <>
                            <ActionButton
                              variant="success"
                              onClick={() =>
                                openConfirm(
                                  "Are you sure you want to approve this user?",
                                  () =>
                                    handleApprove(user._id),
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
                                    handleReject(user._id),
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
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
  );
}

/* =====================================================
   SMALL UI COMPONENTS
===================================================== */

function FilterButton({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-primary-700 text-white shadow-sm"
          : "bg-slate-100 text-text-secondary hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function TableHeader({ children }) {
  return (
    <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-text-muted">
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
      "bg-status-stable-bg text-status-stable-text hover:bg-emerald-100",

    danger:
      "bg-status-critical-bg text-status-critical-text hover:bg-red-100",

    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-bold transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function RoleBadge({ role }) {
  const styles = {
    Admin: "bg-purple-50 text-purple-700",
    Doctor: "bg-primary-50 text-primary-700",
    Volunteer: "bg-status-stable-bg text-status-stable-text",
    Pharmacist: "bg-status-watch-bg text-status-watch-text",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[role] || "bg-slate-100 text-text-secondary"
      }`}
    >
      {role || "Unknown"}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-status-stable-bg text-status-stable-text",
    Pending: "bg-status-watch-bg text-status-watch-text",
    Rejected: "bg-status-critical-bg text-status-critical-text",
    Deactivated: "bg-status-critical-bg text-status-critical-text",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-text-secondary"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default UserManagement;