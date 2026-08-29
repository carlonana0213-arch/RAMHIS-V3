import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";
import {
  cacheDoctorQueue,
  getCachedDoctorQueue,
  getCachedPatientQueue,
  matchesPatientSearch,
  saveOfflinePatient,
  cacheOfflinePrescriptions,
  getCachedPrescriptions,
} from "./offlineRepository";

const API = `${API_BASE_URL}/api`;

const isNetworkError = (error) => {
  return (
    error instanceof TypeError ||
    error?.message === "Failed to fetch" ||
    error?.message?.toLowerCase().includes("networkerror")
  );
};
/**
 * ============================================================
 * GET DOCTOR QUEUE
 * Backend:
 * GET /api/patients/doctor-queue
 * ============================================================
 */
export const getDoctorQueue = async ({
  page = 1,
  limit = 1000,
  search = "",
  queueFilter = "all",
  department = "General",
  role = "doctor",
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      queueFilter,
      department,
      role,
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    const response = await apiFetch(
      `${API}/patients/doctor-queue?${params.toString()}`,
    );

    const patients = Array.isArray(response)
      ? response
      : Array.isArray(response?.patients)
        ? response.patients
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.patients)
            ? response.data.patients
            : [];

    await cacheDoctorQueue(patients);

    console.info(
      `[Offline] Cached ${patients.length} doctor queue record(s) for offline use.`,
    );

    return {
      ...(Array.isArray(response) ? {} : response),
      patients,
    };
  } catch (error) {
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    let patients;

    // When searching offline, use the shared patient cache.
    // This allows Doctor to search patients cached by the Patients module.
    if (search?.trim()) {
      patients = await getCachedPatientQueue();
    } else {
      // No search: preserve the existing doctor-specific queue.
      patients = await getCachedDoctorQueue();
    }

    if (department && department !== "all") {
      patients = patients.filter(
        (patient) => patient.department === department,
      );
    }

    patients = patients.filter((patient) =>
      matchesPatientSearch(patient, search),
    );

    // DoctorQueue currently exposes only “All” and “Priority”.
    if (queueFilter === "priority") {
      patients = patients.filter((patient) => patient.isPriority);
    }

    return {
      patients,
      total: patients.length,
      totalPages: 1,
      currentPage: 1,
    };
  }
};

/**
 * ============================================================
 * LOAD PATIENT PRESCRIPTIONS
 * Backend:
 * GET /api/prescriptions/patient/:patientId
 * ============================================================
 */
export const loadPatientPrescriptions = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  try {
    const response = await apiFetch(
      `${API}/prescriptions/patient/${patientId}`,
    );

    const prescriptions = Array.isArray(response)
      ? response
      : response?.prescriptions || [];

    // Cache the latest server version for offline use.
    await cacheOfflinePrescriptions(patientId, prescriptions);

    console.info(
      `[Offline] Cached ${prescriptions.length} prescription(s) for patient ${patientId}.`,
    );

    return prescriptions;
  } catch (error) {
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    console.info(
      `[Offline] Loading cached prescriptions for patient ${patientId}.`,
    );

    return getCachedPrescriptions(patientId);
  }
};

/**
 * ============================================================
 * SAVE DOCTOR CONSULTATION RECORD
 * Backend:
 * POST /api/patients/:id/doctor-record
 * ============================================================
 */
export const saveDoctorRecord = async (patientId, data) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  const response = await apiFetch(
    `${API}/patients/${patientId}/doctor-record`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  // Keep the latest server version available offline.
  if (response?._id) {
    await saveOfflinePatient(response);
    await cacheDoctorQueue([response]);
  }

  return response;
};

/**
 * ============================================================
 * DELETE DOCTOR CONSULTATION RECORD
 * Backend:
 * DELETE /api/patients/:id/doctor-record/:recordId
 * ============================================================
 */
export const deleteDoctorRecord = async (patientId, recordId, deletedBy) => {
  if (!patientId || !recordId) {
    throw new Error("Patient ID and record ID are required.");
  }

  return apiFetch(`${API}/patients/${patientId}/doctor-record/${recordId}`, {
    method: "DELETE",
    body: JSON.stringify({
      deletedBy: deletedBy || "Unknown User",
      deletedAt: new Date().toISOString(),
    }),
  });
};

/**
 * ============================================================
 * CREATE PRESCRIPTION
 * Backend:
 * POST /api/prescriptions
 * ============================================================
 */
export const savePrescription = async (patientId, data) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  return apiFetch(`${API}/prescriptions`, {
    method: "POST",
    body: JSON.stringify({
      patient: patientId,
      doctor: data.doctorId,
      items: [
        {
          medicine: data.medicine,
          quantity: data.quantity,
          directions: data.directions,
        },
      ],
    }),
  });
};

/**
 * ============================================================
 * MARK MEDICINE AS GIVEN
 * Backend:
 * PATCH /api/prescriptions/:prescriptionId/:itemId
 * ============================================================
 */
export const markMedicineGiven = async (prescriptionId, itemId) => {
  if (!prescriptionId || !itemId) {
    throw new Error("Prescription ID and item ID are required.");
  }

  return apiFetch(`${API}/prescriptions/${prescriptionId}/${itemId}`, {
    method: "PATCH",
  });
};

/**
 * ============================================================
 * UPDATE PATIENT STATUS
 *
 * Backend:
 * PUT /api/patients/:id
 * ============================================================
 */
export const updatePatientStatus = async (patientId, data = {}) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("Patient update data is required.");
  }

  const payload = { ...data };

  console.log("========================================");
  console.log("UPDATING PATIENT STATUS");
  console.log("Patient ID:", patientId);
  console.log("Payload:", payload);
  console.log("========================================");

  const response = await apiFetch(`${API}/patients/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  console.log("PATIENT STATUS UPDATE RESPONSE:", response);

  return response;
};

/**
 * ============================================================
 * SEND PATIENT TO PHARMACY
 *
 * This is the function PatientDoctorView should use.
 * ============================================================
 */
export const sendPatientToPharmacy = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  return updatePatientStatus(patientId, {
    status: "forPharmacy",
  });
};

/**
 * ============================================================
 * RELEASE PATIENT
 *
 * This is the function PatientDoctorView should use.
 * ============================================================
 */
export const releasePatient = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  return updatePatientStatus(patientId, {
    status: "released",
  });
};
