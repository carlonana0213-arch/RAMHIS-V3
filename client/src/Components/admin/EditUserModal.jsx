import { useState } from "react";
import { updateUser } from "../../Services/adminService";
import ConfirmModal from "../ui/ConfirmModal";
import AlertModal from "../ui/AlertModal";
import { API_BASE_URL } from "../../Services/apiConfig";

function EditUserModal({ user, onClose, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);

  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] =
    useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleDoctorChange = (field, value) => {
    setForm({
      ...form,
      doctorInfo: {
        ...form.doctorInfo,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    try {
      await updateUser({
        _id: form._id,
        name: form.name,
        email: form.email,
        role: form.role,
        age: form.age,
        birthday: form.birthday,
        verificationStatus:
          form.verificationStatus,
        volunteerType: form.volunteerType,
        doctorInfo: form.doctorInfo,
      });

      setAlertMessage(
        "User updated successfully"
      );

      setIsEditing(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setAlertMessage("Update failed");
    }
  };

  const handleResetPassword = async () => {
    try {
      await fetch(
        `${API_BASE_URL}/api/admin/reset-password/${form._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setAlertMessage(
        "Password reset successful. Email sent to user."
      );
    } catch (err) {
      console.error(err);
      setAlertMessage(
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h3>Edit User</h3>

        {/* NAME */}

        <input
          value={form.name || ""}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange(
              "name",
              e.target.value
            )
          }
        />

        {/* EMAIL */}

        <input
          value={form.email || ""}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange(
              "email",
              e.target.value
            )
          }
        />

        {/* ROLE */}

        <select
          disabled={!isEditing}
          value={form.role || ""}
          onChange={(e) =>
            handleChange(
              "role",
              e.target.value
            )
          }
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

        {/* AGE */}

        <input
          placeholder="Age"
          value={form.age || ""}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange(
              "age",
              e.target.value
            )
          }
        />

        {/* BIRTHDAY */}

        <input
          placeholder="Birthday"
          value={form.birthday || ""}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange(
              "birthday",
              e.target.value
            )
          }
        />

        {/* VOLUNTEER */}

        {form.role === "Volunteer" && (
          <input
            placeholder="Volunteer Type"
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
          />
        )}

        {/* DOCTOR */}

        {form.role === "Doctor" && (
          <>
            <input
              placeholder="Specialization"
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
            />

            <input
              placeholder="License Number"
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
            />
          </>
        )}

        {/* ACTIONS */}

        <div className="modal-actions">

          {!isEditing ? (
            <button
              onClick={() =>
                setIsEditing(true)
              }
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() =>
                setShowConfirm(true)
              }
            >
              Save
            </button>
          )}

          <button
            onClick={() =>
              setShowResetConfirm(true)
            }
          >
            Reset Password
          </button>

          <button onClick={onClose}>
            Close
          </button>

        </div>
      </div>

      {/* SAVE CONFIRMATION */}

      {showConfirm && (
        <ConfirmModal
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
          message="Are you sure you want to reset this user's password? A temporary password will be emailed."
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
          onClose={() => {
            setAlertMessage("");
            setIsEditing(false);
            onSuccess();
          }}
        />
      )}
    </div>
  );
}

export default EditUserModal;