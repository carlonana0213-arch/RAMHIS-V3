import { apiFetch } from "./api";

import { API_BASE_URL } from "./apiConfig";
import db from "./localDB";
import {
  getOwnerKey,
  cacheDoctorQueue,
  getCachedDoctorQueue,
  getCachedPatientQueue,
  matchesPatientSearch,
  saveOfflinePatient,
  cacheOfflinePrescriptions,
  getCachedPrescriptions,
  queueOfflineOperation,
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

  try {
    const response = await apiFetch(
      `${API}/patients/${patientId}/doctor-record`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // Cache the latest server version for offline use.
    if (response?._id) {
      await saveOfflinePatient(response);
      await cacheDoctorQueue([response]);
    }

    return response;
  } catch (error) {
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    console.info(
      `[Offline] Saving doctor consultation for patient ${patientId}.`,
    );

    const existingPatients = await getCachedPatientQueue();

    const existingPatient = existingPatients.find(
      (patient) => String(patient._id) === String(patientId),
    );

    if (!existingPatient) {
      throw new Error("Patient is not available in offline storage.");
    }

    /*
     * Create a temporary ID for the new
     * consultation record.
     */
    const offlineRecordId = `offline-${crypto.randomUUID()}`;

    const offlineRecord = {
      ...data,

      _id: offlineRecordId,

      _offline: true,

      _syncStatus: "pending",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    /*
     * Add the consultation to the
     * patient's cached doctorSheets.
     */
    const updatedPatient = {
      ...existingPatient,

      doctorSheets: [
        ...(Array.isArray(existingPatient.doctorSheets)
          ? existingPatient.doctorSheets
          : []),

        offlineRecord,
      ],

      updatedAt: new Date().toISOString(),
    };

    /*
     * Save the updated patient locally.
     */
    await saveOfflinePatient(updatedPatient);

    /*
     * Keep the Doctor queue synchronized
     * with the locally updated patient.
     */
    await cacheDoctorQueue([updatedPatient]);

    /*
     * Queue the actual server operation.
     */
    await queueOfflineOperation({
      entityType: "doctorRecord",
      entityKey: patientId,
      method: "POST",
      url: `${API}/patients/${patientId}/doctor-record`,
      payload: {
        ...data,
        _offlineRecordId: offlineRecordId,
      },
    });

    console.info(
      `[Offline] Doctor consultation saved locally for patient ${patientId}.`,
    );

    /*
     * Return the locally updated patient
     * so PatientDoctorView can continue
     * normally.
     */
    return updatedPatient;
  }
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

  const payload = {
    patient: patientId,
    doctor: data.doctorId,
    items: [
      {
        medicine: data.medicine,
        quantity: data.quantity,
        directions: data.directions,
      },
    ],
  };

  try {
    const response = await apiFetch(`${API}/prescriptions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Cache the server version immediately.
    if (response?._id) {
      const existing = await getCachedPrescriptions(patientId);

      await cacheOfflinePrescriptions(patientId, [
        ...existing.filter(
          (prescription) => String(prescription._id) !== String(response._id),
        ),
        response,
      ]);
    }

    return response;
  } catch (error) {
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    // ---------------------------------------------
    // OFFLINE PRESCRIPTION
    // ---------------------------------------------

    const offlineId = `offline-${crypto.randomUUID()}`;

    const offlinePrescription = {
      _id: offlineId,

      patient: patientId,

      doctor: data.doctorId,

      items: [
        {
          // Keep the medicine ID exactly as the
          // server expects it.
          medicine: data.medicine,

          quantity: data.quantity,

          directions: data.directions,

          status: "pending",
        },
      ],

      ownerKey: getOwnerKey(),

      patientId,

      serverId: null,

      _offline: true,

      _syncStatus: "pending",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    const ownerKey = getOwnerKey();

    offlinePrescription.key = `${ownerKey}:prescription:${offlineId}`;

    await db.offlinePrescriptions.put(offlinePrescription);

    await queueOfflineOperation({
      entityType: "prescription",
      entityKey: offlineId,
      method: "POST",
      url: `${API}/prescriptions`,
      payload,
    });

    console.info(
      `[Offline] Saved prescription ${offlineId} locally and queued it for synchronization.`,
    );

    return offlinePrescription;
  }
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
