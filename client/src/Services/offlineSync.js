import db from "./localDB";
import { getOwnerKey } from "./offlineRepository";
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

    const response = await apiFetch(operation.url, {
      method: operation.method,
      body:
        operation.payload !== undefined
          ? JSON.stringify(operation.payload)
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
