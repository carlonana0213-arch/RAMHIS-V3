import { useState } from "react";
import { registerUser } from "../../Services/authService";
import Modal from "../ui/modal";
import ConfirmModal from "../ui/ConfirmModal";
import AlertModal from "../ui/AlertModal";

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    email: "",
    role: "Doctor",
    volunteerType: "",
    specialization: "",
    licenseNumber: "",
    proofOfLicense: "",
    proofOfDoctorate: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName) {
      return "First name is required.";
    }

    if (!lastName) {
      return "Last name is required.";
    }

    if (!form.birthday) {
      return "Birthday is required.";
    }

    if (!email) {
      return "Email address is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (
      form.role === "Volunteer" &&
      !form.volunteerType.trim()
    ) {
      return "Volunteer type is required.";
    }

    if (form.role === "Doctor") {
      if (!form.specialization.trim()) {
        return "Specialization is required for doctors.";
      }

      if (!form.licenseNumber.trim()) {
        return "License number is required for doctors.";
      }

      if (!form.proofOfLicense.trim()) {
        return "Proof of license is required for doctors.";
      }

      if (!form.proofOfDoctorate.trim()) {
        return "Proof of doctorate is required for doctors.";
      }
    }

    return null;
  };

  const handleCreateClick = () => {
    const validationError = validateForm();

    if (validationError) {
      setAlertMessage(validationError);
      return;
    }

    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fullName = [
        form.firstName.trim(),
        form.middleName.trim(),
        form.lastName.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const dataToSend = {
        name: fullName,
        email: form.email.trim(),
        birthdate: form.birthday,
        role: form.role,
      };

      if (form.role === "Volunteer") {
        dataToSend.volunteerType =
          form.volunteerType.trim();
      }

      if (form.role === "Doctor") {
        dataToSend.doctorInfo = {
          specialization:
            form.specialization.trim(),

          licenseNumber:
            form.licenseNumber.trim(),

          proofOfLicense:
            form.proofOfLicense.trim(),

          proofOfDoctorate:
            form.proofOfDoctorate.trim(),
        };
      }

      await registerUser(dataToSend);

      setAlertMessage(
        "User created successfully."
      );
    } catch (err) {
      console.error(err);

      setAlertMessage(
        err.message ||
          "User creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="Create User"
        subtitle="Add a new authorized RAMHIS system user."
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
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
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateClick}
              disabled={loading}
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
              {loading
                ? "Creating..."
                : "Create User"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* FIRST NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              First Name
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="text"
              name="firstName"
              value={form.firstName}
              placeholder="Enter first name"
              onChange={handleChange}
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
              "
            />
          </div>

          {/* MIDDLE NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Middle Name
              <span className="ml-1 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <input
              type="text"
              name="middleName"
              value={form.middleName}
              placeholder="Enter middle name"
              onChange={handleChange}
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
              "
            />
          </div>

          {/* LAST NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Last Name
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="text"
              name="lastName"
              value={form.lastName}
              placeholder="Enter last name"
              onChange={handleChange}
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
              "
            />
          </div>

          {/* BIRTHDAY */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Birthday
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="date"
              name="birthday"
              value={form.birthday}
              max={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
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
              "
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter email address"
              onChange={handleChange}
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
              "
            />
          </div>

          {/* ROLE */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
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
              "
            >
              <option value="Doctor">
                Doctor
              </option>

              <option value="Volunteer">
                Volunteer
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          {/* VOLUNTEER */}
          {form.role === "Volunteer" && (
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Volunteer Type
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                name="volunteerType"
                value={form.volunteerType}
                placeholder="Enter volunteer type"
                onChange={handleChange}
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
                "
              />
            </div>
          )}

          {/* DOCTOR */}
          {form.role === "Doctor" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Specialization
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  placeholder="Enter specialization"
                  onChange={handleChange}
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
                  "
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  License Number
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  placeholder="Enter license number"
                  onChange={handleChange}
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
                  "
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Proof of License
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="url"
                  name="proofOfLicense"
                  value={form.proofOfLicense}
                  placeholder="Paste proof link"
                  onChange={handleChange}
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
                  "
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Proof of Doctorate
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="url"
                  name="proofOfDoctorate"
                  value={form.proofOfDoctorate}
                  placeholder="Paste proof link"
                  onChange={handleChange}
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
                  "
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* CONFIRM CREATE */}
      {showConfirm && (
        <ConfirmModal
          title="Create User"
          message="Are you sure you want to create this user?"
          onConfirm={async () => {
            setShowConfirm(false);
            await handleSubmit();
          }}
          onCancel={() =>
            setShowConfirm(false)
          }
        />
      )}

      {/* ALERT */}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => {
            const isSuccess =
              alertMessage ===
              "User created successfully.";

            setAlertMessage("");

            if (isSuccess) {
              onSuccess?.();
              onClose?.();
            }
          }}
        />
      )}
    </>
  );
}

export default AddUserModal;