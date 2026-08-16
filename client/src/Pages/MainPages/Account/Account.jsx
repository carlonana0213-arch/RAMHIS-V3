import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  BriefcaseBusiness,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  KeyRound,
} from "lucide-react";

import { API_BASE_URL } from "../../../Services/apiConfig";

function Account() {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  // ============================================================
  // LOAD CURRENT USER
  // ============================================================

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const res = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            result.msg ||
            "Failed to load account.",
        );
      }

      const currentUser = result.data || result.user || result;

      setUser(currentUser);
      setOriginalUser(currentUser);
    } catch (err) {
      console.error("ACCOUNT LOAD ERROR:", err);
      setError(
        err.message || "Failed to load account information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ============================================================
  // FORM HANDLING
  // ============================================================

  const handleChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setUser(originalUser);
    setMessage("");
    setError("");
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const payload = {
        name: user.name,
        email: user.email,
        age: user.age,
        birthday: user.birthday,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            result.msg ||
            "Failed to update account.",
        );
      }

      const updatedUser =
        result.data || result.user || result;

      setUser(updatedUser);
      setOriginalUser(updatedUser);

      setMessage("Account information updated successfully.");
    } catch (err) {
      console.error("ACCOUNT UPDATE ERROR:", err);

      setError(
        err.message ||
          "Failed to update account information.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // PASSWORD HANDLING
  // ============================================================

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);

    setPasswordData({
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordUpdate = async () => {
    if (
      !passwordData.password ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill in both password fields.");
      return;
    }

    if (
      passwordData.password !==
      passwordData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: passwordData.password,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            result.msg ||
            "Failed to update password.",
        );
      }

      closePasswordModal();

      setMessage("Password updated successfully.");
    } catch (err) {
      console.error("PASSWORD UPDATE ERROR:", err);

      setError(
        err.message || "Failed to update password.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getRoleLabel = () => {
    if (!user?.role) return "User";

    return user.role === "Admin"
      ? "Administrator"
      : user.role;
  };

  const getStatusLabel = () => {
    if (user?.verificationStatus === "Approved") {
      return "Active";
    }

    if (user?.verificationStatus) {
      return user.verificationStatus;
    }

    return user?.status || "Active";
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );
    } catch {
      return date;
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8">
            <div className="h-7 w-48 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-200" />
              <div className="mx-auto mt-5 h-5 w-32 rounded bg-slate-200" />
              <div className="mx-auto mt-3 h-4 w-20 rounded bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-5 w-48 rounded bg-slate-200" />

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (!user) {
    return (
      <div className="min-h-full bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle size={24} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to load account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "Something went wrong while loading your account."}
            </p>

            <button
              onClick={loadUser}
              className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            PAGE HEADER
        ======================================================= */}

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your profile and account information.
          </p>
        </div>

        {/* ======================================================
            SUCCESS / ERROR MESSAGE
        ======================================================= */}

        {(message || error) && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              message
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            <span>{message || error}</span>
          </div>
        )}

        {/* ======================================================
            PROFILE + PERSONAL INFORMATION
        ======================================================= */}

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* PROFILE CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-700 text-3xl font-extrabold text-white shadow-lg shadow-blue-700/20">
                {getInitial()}
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {user.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {getRoleLabel()}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {getStatusLabel()}
              </div>
            </div>

            <div className="my-6 border-t border-slate-100" />

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Account Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {getStatusLabel()}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* PERSONAL INFORMATION */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Update the information associated with your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={user.name || ""}
                      onChange={(e) =>
                        handleChange(
                          "name",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={user.email || ""}
                      onChange={(e) =>
                        handleChange(
                          "email",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* AGE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Age
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      value={user.age ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "age",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                {/* BIRTHDAY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Birthday
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={
                        user.birthday
                          ? String(user.birthday).slice(
                              0,
                              10,
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "birthday",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* ROLE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Role
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={getRoleLabel()}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-500"
                    />
                  </div>
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Account Status
                  </label>

                  <div className="relative">
                    <ShieldCheck
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                    />

                    <input
                      type="text"
                      value={getStatusLabel()}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* INFO NOTE */}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Account information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Your role and account status are managed
                      by the system and cannot be changed from
                      this page.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            SECURITY CARD
        ======================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <LockKeyhole size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Account Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your account secure by regularly updating
                  your password.
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <LockKeyhole size={14} />
                  Password is securely stored
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setShowPasswordModal(true);
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <KeyRound size={17} />
              Change Password
            </button>
          </div>
        </div>

        {/* ======================================================
            ACCOUNT DETAILS
        ======================================================= */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Account Role
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {getRoleLabel()}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Assigned system role
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Account Status
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {getStatusLabel()}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Current account verification status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            FOOTER
        ======================================================= */}

        <div className="py-6 text-center text-xs text-slate-400">
          RAMHIS Account Management
        </div>
      </div>

      {/* ========================================================
          CHANGE PASSWORD MODAL
      ========================================================= */}

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={closePasswordModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <LockKeyhole size={19} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Change Password
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Update your account password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">

              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs leading-5 text-blue-700">
                  Choose a strong password that you do not use
                  for other accounts.
                </p>
              </div>

              {/* NEW PASSWORD */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordData.password}
                    onChange={(e) =>
                      handlePasswordChange(
                        "password",
                        e.target.value,
                      )
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={(e) =>
                      handlePasswordChange(
                        "confirmPassword",
                        e.target.value,
                      )
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* PASSWORD ERROR */}

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={saving}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePasswordUpdate}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound size={17} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;