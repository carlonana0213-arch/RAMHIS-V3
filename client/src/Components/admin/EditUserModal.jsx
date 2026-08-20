import { useEffect, useState } from "react";
import { updateUser } from "../../Services/adminService";
import { API_BASE_URL } from "../../Services/apiConfig";

import Modal from "../ui/modal";
import ConfirmModal from "../ui/ConfirmModal";
import AlertModal from "../ui/AlertModal";

function EditUserModal({ user, onClose, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    ...user,
    doctorInfo: user?.doctorInfo || {},
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] =
    useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  /*
   * Update form if a different user is selected.
   */
  useEffect(() => {
    setForm({
      ...user,
      doctorInfo: user?.doctorInfo || {},
    });

    setIsEditing(false);
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDoctorChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      doctorInfo: {
        ...(prev.doctorInfo || {}),
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!form.name?.trim()) {
      return "Name is required.";
    }

    if (!form.email?.trim()) {
      return "Email address is required.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (
      form.role === "Volunteer" &&
      !form.volunteerType?.trim()
    ) {
      return "Volunteer type is required.";
    }

    if (form.role === "Doctor") {
      if (
        !form.doctorInfo?.specialization?.trim()
      ) {
        return "Specialization is required for doctors.";
      }

      if (
        !form.doctorInfo?.licenseNumber?.trim()
      ) {
        return "License number is required for doctors.";
      }
    }

    return null;
  };

  const handleSaveClick = () => {
    const validationError = validateForm();

    if (validationError) {
      setAlertMessage(validationError);
      return;
    }

    setShowConfirm(true);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const dataToSend = {
        _id: form._id,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        age: form.age || "",
        birthday: form.birthday || "",
        birthdate:
          form.birthdate ||
          form.birthday ||
          "",
        verificationStatus:
          form.verificationStatus,
      };

      /*
       * Only send Volunteer data
       * when the selected role is Volunteer.
       */
      if (form.role === "Volunteer") {
        dataToSend.volunteerType =
          form.volunteerType?.trim() || "";
      }

      /*
       * Only send Doctor data
       * when the selected role is Doctor.
       */
      if (form.role === "Doctor") {
        dataToSend.doctorInfo = {
          specialization:
            form.doctorInfo?.specialization?.trim() ||
            "",

          licenseNumber:
            form.doctorInfo?.licenseNumber?.trim() ||
            "",

          proofOfLicense:
            form.doctorInfo?.proofOfLicense?.trim() ||
            "",

          proofOfDoctorate:
            form.doctorInfo?.proofOfDoctorate?.trim() ||
            "",
        };
      }

      await updateUser(dataToSend);

      setIsEditing(false);

      setAlertMessage(
        "User updated successfully."
      );
    } catch (err) {
      console.error(err);

      setAlertMessage(
        err.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResetLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/admin/reset-password/${form._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to send reset email."
        );
      }

      setAlertMessage(
        `Password reset link sent to ${form.email}.`
      );
    } catch (err) {
      console.error(err);

      setAlertMessage(
        err.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleAlertClose = () => {
    const isUpdateSuccess =
      alertMessage ===
      "User updated successfully.";

    setAlertMessage("");

    if (isUpdateSuccess) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="User Details"
        subtitle={
          isEditing
            ? "Update the user's information below."
            : "View and manage this user's information."
        }
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={onClose}
              disabled={
                saveLoading || resetLoading
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Close
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                disabled={resetLoading}
                className="
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Edit User
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(false)
                  }
                  disabled={saveLoading}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel Edit
                </button>

                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={saveLoading}
                  className="
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {saveLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </>
            )}
          </>
        }
      >
        <div className="space-y-6">
          {/* ACCOUNT INFORMATION */}

          <section>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* FULL NAME */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                />
              </div>

              {/* EMAIL */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                />
              </div>

              {/* ROLE */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Role
                </label>

                <select
                  disabled={!isEditing}
                  value={form.role || ""}
                  onChange={(e) =>
                    handleChange(
                      "role",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                >
                  <option value="Doctor">
                    Doctor
                  </option>

                  <option value="Volunteer">
                    Volunteer
                  </option>

                  <option value="Pharmacist">
                    Pharmacist
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              {/* VERIFICATION STATUS */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Account Status
                </label>

                <select
                  disabled={!isEditing}
                  value={
                    form.verificationStatus ||
                    "Pending"
                  }
                  onChange={(e) =>
                    handleChange(
                      "verificationStatus",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Deactivated">
                    Deactivated
                  </option>
                </select>
              </div>

              {/* AGE */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Age
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.age || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange(
                      "age",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                />
              </div>

              {/* BIRTHDAY */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Birthday
                </label>

                <input
                  type="date"
                  value={
                    form.birthdate ||
                    form.birthday ||
                    ""
                  }
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange(
                      "birthdate",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                />
              </div>
            </div>
          </section>

          {/* VOLUNTEER INFORMATION */}

          {form.role === "Volunteer" && (
            <section className="border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                Volunteer Information
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Volunteer Type
                </label>

                <input
                  type="text"
                  value={
                    form.volunteerType || ""
                  }
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange(
                      "volunteerType",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500
                  "
                />
              </div>
            </section>
          )}

          {/* DOCTOR INFORMATION */}

          {form.role === "Doctor" && (
            <section className="border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                Doctor Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* SPECIALIZATION */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Specialization
                  </label>

                  <input
                    type="text"
                    value={
                      form.doctorInfo
                        ?.specialization || ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleDoctorChange(
                        "specialization",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-500
                    "
                  />
                </div>

                {/* LICENSE NUMBER */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    License Number
                  </label>

                  <input
                    type="text"
                    value={
                      form.doctorInfo
                        ?.licenseNumber || ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleDoctorChange(
                        "licenseNumber",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-500
                    "
                  />
                </div>

                {/* PROOF OF LICENSE */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Proof of License
                  </label>

                  <input
                    type="url"
                    value={
                      form.doctorInfo
                        ?.proofOfLicense || ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleDoctorChange(
                        "proofOfLicense",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-500
                    "
                  />
                </div>

                {/* PROOF OF DOCTORATE */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Proof of Doctorate
                  </label>

                  <input
                    type="url"
                    value={
                      form.doctorInfo
                        ?.proofOfDoctorate || ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleDoctorChange(
                        "proofOfDoctorate",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-500
                    "
                  />
                </div>
              </div>
            </section>
          )}

          {/* PASSWORD RESET */}

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
              Account Security
            </h3>

            <p className="mb-4 text-sm leading-6 text-slate-500">
              Send a password reset link to the user's
              registered email address.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowResetConfirm(true)
              }
              disabled={resetLoading || saveLoading}
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-2.5
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {resetLoading
                ? "Sending Reset Link..."
                : "Reset Password"}
            </button>
          </section>
        </div>
      </Modal>

      {/* SAVE CONFIRMATION */}

      {showConfirm && (
        <ConfirmModal
          title="Save Changes"
          message="Are you sure you want to save changes to this user?"
          onConfirm={async () => {
            setShowConfirm(false);
            await handleSave();
          }}
          onCancel={() =>
            setShowConfirm(false)
          }
        />
      )}

      {/* RESET PASSWORD CONFIRMATION */}

      {showResetConfirm && (
        <ConfirmModal
          title="Reset Password"
          message="Are you sure you want to send a password reset link to this user?"
          onConfirm={async () => {
            setShowResetConfirm(false);
            await handleResetPassword();
          }}
          onCancel={() =>
            setShowResetConfirm(false)
          }
        />
      )}

      {/* ALERT */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
}

export default EditUserModal;