import db from "./localDB";
import { API_BASE_URL } from "./apiConfig";
import {
  getOwnerKey,
  saveOfflinePatient,
  cacheDoctorQueue,
  createOfflineConflict,
} from "./offlineRepository";

import { apiFetch } from "./api";
let syncInProgress = false;

const isNetworkError = (error) => {
  return (
    error instanceof TypeError ||
    error?.message === "Failed to fetch" ||
    error?.message?.toLowerCase().includes("networkerror")
  );
};

export async function syncOfflineOutbox() {
  if (syncInProgress) {
    return;
  }

  if (!navigator.onLine) {
    return;
  }

  syncInProgress = true;

  try {
    const ownerKey = getOwnerKey();

    const operations = await db.offlineOutbox
      .where("ownerKey")
      .equals(ownerKey)
      .and((operation) => operation.status === "pending")
      .sortBy("createdAt");

    if (!operations.length) {
      console.info("[Offline Sync] No pending operations.");
      return;
    }

    console.info(
      `[Offline Sync] Found ${operations.length} pending operation(s).`,
    );

    for (const operation of operations) {
      await processOperation(operation);
    }
  } finally {
    syncInProgress = false;
  }
}

async function fetchCurrentServerPatient(patientId) {
  return apiFetch(`${API_BASE_URL}/api/patients/${patientId}`);
}

function hasChangedSinceBaseline(baseline, current) {
  return JSON.stringify(baseline) !== JSON.stringify(current);
}

function hasServerChangedSinceBaseline(baseline, server) {
  return JSON.stringify(baseline) !== JSON.stringify(server);
}

function normalizeForComparison(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeForComparison);
  }

  if (typeof value === "object") {
    const result = {};

    Object.keys(value)
      .sort()
      .forEach((key) => {
        // Ignore local-only synchronization fields.
        if (
          key === "key" ||
          key === "serverSnapshot" ||
          key === "_offline" ||
          key === "_syncStatus" ||
          key === "updatedAt"
        ) {
          return;
        }

        result[key] = normalizeForComparison(value[key]);
      });

    return result;
  }

  return value;
}

function recordsAreDifferent(a, b) {
  return (
    JSON.stringify(normalizeForComparison(a)) !==
    JSON.stringify(normalizeForComparison(b))
  );
}

async function processOperation(operation) {
  try {
    await db.offlineOutbox.update(operation.operationId, {
      status: "syncing",
      attempts: (operation.attempts || 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    console.info(
      `[Offline Sync] Sending ${operation.method} ${operation.entityType}:${operation.entityKey}`,
    );

    let requestPayload = operation.payload;

    if (operation.entityType === "doctorRecord" && requestPayload) {
      requestPayload = {
        ...requestPayload,
      };

      delete requestPayload._offlineRecordId;
    }

    // -------------------------------------------------
    // CONFLICT DETECTION
    // -------------------------------------------------

    if (operation.entityType === "doctorRecord" && operation.baseSnapshot) {
      const serverPatient = await fetchCurrentServerPatient(
        operation.entityKey,
      );

      const baseline = operation.baseSnapshot;

      const serverChanged = recordsAreDifferent(baseline, serverPatient);

      if (serverChanged) {
        await createOfflineConflict({
          entityType: "doctorRecord",
          entityKey: operation.entityKey,
          operationId: operation.operationId,

          localData: {
            ...operation.payload,

            _baseSnapshot: baseline,
          },

          serverData: serverPatient,
        });

        await db.offlineOutbox.update(operation.operationId, {
          status: "conflict",
          updatedAt: new Date().toISOString(),
        });

        console.warn(
          `[Offline Sync] Conflict detected for doctor record on patient ${operation.entityKey}.`,
        );

        return;
      }
    }

    if (
      operation.entityType === "patient" &&
      operation.method === "PUT" &&
      operation.baseSnapshot
    ) {
      const serverPatient = await fetchCurrentServerPatient(
        operation.entityKey,
      );

      const baseline = operation.baseSnapshot;

      const serverChanged = recordsAreDifferent(baseline, serverPatient);

      if (serverChanged) {
        await createOfflineConflict({
          entityType: "patient",
          entityKey: operation.entityKey,
          operationId: operation.operationId,

          localData: {
            ...operation.payload,

            _baseSnapshot: baseline,
          },

          serverData: serverPatient,
        });

        await db.offlineOutbox.update(operation.operationId, {
          status: "conflict",
          updatedAt: new Date().toISOString(),
        });

        console.warn(
          `[Offline Sync] Conflict detected for patient ${operation.entityKey}.`,
        );

        return;
      }
    }

    const response = await apiFetch(operation.url, {
      method: operation.method,
      body:
        requestPayload !== undefined
          ? JSON.stringify(requestPayload)
          : undefined,
    });

    await handleSuccessfulOperation(operation, response);
  } catch (error) {
    console.error(
      `[Offline Sync] Failed operation ${operation.operationId}:`,
      error,
    );

    const networkFailure = isNetworkError(error);

    await db.offlineOutbox.update(operation.operationId, {
      status: networkFailure ? "pending" : "failed",
      error: error?.message || "Synchronization failed.",
      updatedAt: new Date().toISOString(),
    });

    if (networkFailure) {
      // Stop here so later operations don't run while
      // connectivity is unstable.
      throw error;
    }
  }
}

async function handleSuccessfulOperation(operation, response) {
  if (operation.entityType === "patient") {
    await handlePatientOperation(operation, response);
  }

  if (operation.entityType === "prescription") {
    await handlePrescriptionOperation(operation, response);
  }

  if (operation.entityType === "doctorRecord") {
    await handleDoctorRecordOperation(operation, response);
  }

  await db.offlineOutbox.delete(operation.operationId);

  console.info(
    `[Offline Sync] Synchronized ${operation.entityType}:${operation.entityKey}`,
  );
}

async function handlePatientOperation(operation, response) {
  const ownerKey = getOwnerKey();

  if (operation.method === "POST") {
    // POST /api/patients returns the complete patient document.
    const serverPatient = response;

    if (!serverPatient?._id) {
      throw new Error(
        "Patient sync succeeded but the server returned no patient ID.",
      );
    }

    const oldKey = `${ownerKey}:patient:${operation.entityKey}`;

    const newKey = `${ownerKey}:patient:${serverPatient._id}`;

    await db.transaction(
      "rw",
      db.offlinePatients,
      db.offlineDoctorQueue,
      async () => {
        const existing = await db.offlinePatients.get(oldKey);

        await db.offlinePatients.delete(oldKey);

        await db.offlinePatients.put({
          ...(existing || {}),
          ...serverPatient,

          key: newKey,
          ownerKey,
          serverId: serverPatient._id,

          _offline: false,
          _syncStatus: "synced",

          updatedAt: new Date().toISOString(),
        });

        // The patient should also become available to the
        // Doctor module after synchronization.
        await db.offlineDoctorQueue.put({
          ...serverPatient,

          key: `${ownerKey}:doctor-queue:${serverPatient._id}`,

          ownerKey,
          serverId: serverPatient._id,

          updatedAt: new Date().toISOString(),
        });
      },
    );

    return;
  }

  if (operation.method === "PUT") {
    const serverPatient = response;

    if (!serverPatient?._id) {
      throw new Error(
        "Patient update succeeded but the server returned no patient ID.",
      );
    }

    const key = `${ownerKey}:patient:${serverPatient._id}`;

    await db.offlinePatients.put({
      ...serverPatient,

      key,
      ownerKey,
      serverId: serverPatient._id,

      _offline: false,
      _syncStatus: "synced",

      updatedAt: new Date().toISOString(),
    });

    await db.offlineDoctorQueue.put({
      ...serverPatient,

      key: `${ownerKey}:doctor-queue:${serverPatient._id}`,

      ownerKey,
      serverId: serverPatient._id,

      updatedAt: new Date().toISOString(),
    });
  }
}

async function handlePrescriptionOperation(operation, response) {
  const ownerKey = getOwnerKey();

  if (operation.method !== "POST") {
    return;
  }

  const serverPrescription = response;

  if (!serverPrescription?._id) {
    throw new Error(
      "Prescription sync succeeded but the server returned no prescription ID.",
    );
  }

  const oldKey = `${ownerKey}:prescription:${operation.entityKey}`;

  const newKey = `${ownerKey}:prescription:${serverPrescription._id}`;

  const patientId =
    serverPrescription.patientId ||
    serverPrescription.patient?._id ||
    operation.payload?.patientId ||
    operation.payload?.patient;

  await db.transaction("rw", db.offlinePrescriptions, async () => {
    // Find the temporary offline prescription.
    const existing = await db.offlinePrescriptions.get(oldKey);

    // Remove the temporary offline record.
    await db.offlinePrescriptions.delete(oldKey);

    // Save the server version using the real MongoDB ID.
    await db.offlinePrescriptions.put({
      ...(existing || {}),
      ...serverPrescription,

      key: newKey,
      ownerKey,

      patientId,

      serverId: serverPrescription._id,

      _offline: false,
      _syncStatus: "synced",

      updatedAt: new Date().toISOString(),
    });
  });
}

async function handleDoctorRecordOperation(operation, response) {
  const ownerKey = getOwnerKey();

  if (operation.method !== "POST") {
    return;
  }

  const serverRecord = response;

  if (!serverRecord?._id) {
    throw new Error(
      "Doctor record sync succeeded but the server returned no record ID.",
    );
  }

  const patientId = operation.entityKey;

  const offlineRecordId = operation.payload?._offlineRecordId;

  if (!offlineRecordId) {
    throw new Error("Doctor record sync is missing the offline record ID.");
  }

  const patientKey = `${ownerKey}:patient:${patientId}`;

  const doctorQueueKey = `${ownerKey}:doctor-queue:${patientId}`;

  await db.transaction(
    "rw",
    db.offlinePatients,
    db.offlineDoctorQueue,
    async () => {
      const cachedPatient = await db.offlinePatients.get(patientKey);

      if (!cachedPatient) {
        console.warn(
          `[Offline Sync] Patient ${patientId} was not found in offlinePatients.`,
        );

        return;
      }

      const doctorSheets = Array.isArray(cachedPatient.doctorSheets)
        ? cachedPatient.doctorSheets
        : [];

      const updatedDoctorSheets = doctorSheets.map((record) => {
        if (String(record?._id) === String(offlineRecordId)) {
          return {
            ...serverRecord,
            _offline: false,
            _syncStatus: "synced",
          };
        }

        return record;
      });

      const recordWasFound = doctorSheets.some(
        (record) => String(record?._id) === String(offlineRecordId),
      );

      if (!recordWasFound) {
        updatedDoctorSheets.push({
          ...serverRecord,
          _offline: false,
          _syncStatus: "synced",
        });
      }

      const updatedPatient = {
        ...cachedPatient,

        doctorSheets: updatedDoctorSheets,

        updatedAt: new Date().toISOString(),
      };

      await saveOfflinePatient(updatedPatient);

      await db.offlineDoctorQueue.put({
        ...updatedPatient,

        key: doctorQueueKey,

        ownerKey,

        serverId: updatedPatient._id,

        updatedAt: new Date().toISOString(),
      });
    },
  );

  console.info(
    `[Offline Sync] Doctor consultation ${offlineRecordId} was replaced with server record ${serverRecord._id}.`,
  );
}
