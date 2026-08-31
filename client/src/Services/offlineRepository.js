import db from "./localDB";

export function getOwnerKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  if (!userId) {
    throw new Error("Offline storage requires a signed-in user.");
  }

  return String(userId);
}

function patientKey(ownerKey, serverId) {
  return `${ownerKey}:patient:${serverId}`;
}

export function getPatientName(patient) {
  const generalInfo = patient?.generalInfo || {};

  return String(
    generalInfo.name ||
      [generalInfo.firstName, generalInfo.middleName, generalInfo.lastName]
        .filter(Boolean)
        .join(" ") ||
      [patient?.firstName, patient?.lastName].filter(Boolean).join(" "),
  )
    .trim()
    .toLowerCase();
}

export function matchesPatientSearch(patient, search) {
  if (!search?.trim()) return true;

  return getPatientName(patient).includes(search.trim().toLowerCase());
}

export function summarizePatients(patients) {
  const summary = {
    Pediatrics: 0,
    Ortho: 0,
    Opta: 0,
    Dental: 0,
    Cardio: 0,
    General: 0,
  };

  for (const patient of patients) {
    if (summary[patient.department] !== undefined) {
      summary[patient.department] += 1;
    }
  }

  return summary;
}

export async function cachePatientQueue(patients) {
  const ownerKey = getOwnerKey();

  await db.transaction("rw", db.offlinePatients, async () => {
    for (const patient of patients) {
      if (!patient?._id) continue;

      await db.offlinePatients.put({
        ...patient,

        key: patientKey(ownerKey, patient._id),

        ownerKey,

        serverId: patient._id,

        serverSnapshot: structuredClone(patient),

        _offline: false,

        _syncStatus: "synced",

        updatedAt: new Date().toISOString(),
      });
    }
  });
}

export async function getCachedPatientQueue() {
  const ownerKey = getOwnerKey();

  return db.offlinePatients.where("ownerKey").equals(ownerKey).toArray();
}

export async function cacheDoctorQueue(patients) {
  const ownerKey = getOwnerKey();

  await db.transaction("rw", db.offlineDoctorQueue, async () => {
    for (const patient of patients) {
      if (!patient?._id) continue;

      await db.offlineDoctorQueue.put({
        ...patient,
        key: `${ownerKey}:doctor-queue:${patient._id}`,
        ownerKey,
        serverId: patient._id,
        updatedAt: new Date().toISOString(),
      });
    }
  });
}

export async function getCachedDoctorQueue() {
  const ownerKey = getOwnerKey();

  return db.offlineDoctorQueue.where("ownerKey").equals(ownerKey).toArray();
}

export async function setOfflineMeta(name, value) {
  const ownerKey = getOwnerKey();

  await db.offlineMeta.put({
    key: `${ownerKey}:meta:${name}`,
    ownerKey,
    name,
    value,
    updatedAt: new Date().toISOString(),
  });
}

export async function getOfflineMeta(name) {
  const ownerKey = getOwnerKey();

  return db.offlineMeta.get(`${ownerKey}:meta:${name}`);
}

export async function saveOfflinePatient(patient) {
  const ownerKey = getOwnerKey();

  if (!patient?._id) {
    throw new Error("Offline patient requires an ID.");
  }

  await db.offlinePatients.put({
    ...patient,
    key: patientKey(ownerKey, patient._id),
    ownerKey,
    serverId: patient._id,
    updatedAt: new Date().toISOString(),
  });

  return patient;
}

export async function queueOfflineOperation({
  entityType,
  entityKey,
  method,
  url,
  payload,
  baseSnapshot = null,
}) {
  const ownerKey = getOwnerKey();

  const operationId = crypto.randomUUID();

  await db.offlineOutbox.put({
    operationId,
    ownerKey,
    entityType,
    entityKey,
    method,
    url,
    payload,

    // The server version that existed when
    // the user made the offline change.
    baseSnapshot: baseSnapshot ? structuredClone(baseSnapshot) : null,

    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attempts: 0,
  });

  return operationId;
}

export async function getPendingOfflineOperations() {
  const ownerKey = getOwnerKey();

  return db.offlineOutbox
    .where("ownerKey")
    .equals(ownerKey)
    .and((operation) => operation.status === "pending")
    .sortBy("createdAt");
}

export async function updateOfflineOperation(operationId, changes) {
  await db.offlineOutbox.update(operationId, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function removeOfflineOperation(operationId) {
  await db.offlineOutbox.delete(operationId);
}

export async function searchCachedPatients(name = "", birthdate = "") {
  const patients = await getCachedPatientQueue();

  const normalizedName = name.trim().toLowerCase();

  return patients.filter((patient) => {
    const patientName = getPatientName(patient);

    const patientBirthdate = patient?.generalInfo?.birthdate || "";

    const nameMatches = !normalizedName || patientName.includes(normalizedName);

    const birthdateMatches =
      !birthdate ||
      String(patientBirthdate).slice(0, 10) === String(birthdate).slice(0, 10);

    return nameMatches && birthdateMatches;
  });
}

export async function cacheOfflinePrescriptions(patientId, prescriptions) {
  const ownerKey = getOwnerKey();

  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  if (!Array.isArray(prescriptions)) {
    return;
  }

  await db.transaction("rw", db.offlinePrescriptions, async () => {
    // Remove the previous cached version for this patient.
    await db.offlinePrescriptions
      .where("[ownerKey+patientId]")
      .equals([ownerKey, patientId])
      .delete();

    for (const prescription of prescriptions) {
      if (!prescription?._id) continue;

      await db.offlinePrescriptions.put({
        ...prescription,

        key: `${ownerKey}:prescription:${prescription._id}`,
        ownerKey,
        patientId,
        serverId: prescription._id,

        updatedAt: new Date().toISOString(),
      });
    }
  });
}

export async function getCachedPrescriptions(patientId) {
  const ownerKey = getOwnerKey();

  if (!patientId) {
    return [];
  }

  return db.offlinePrescriptions
    .where("[ownerKey+patientId]")
    .equals([ownerKey, patientId])
    .toArray();
}

export async function createOfflineConflict({
  entityType,
  entityKey,
  operationId,
  localData,
  serverData,
}) {
  const ownerKey = getOwnerKey();

  const conflictId = crypto.randomUUID();

  await db.offlineConflicts.put({
    conflictId,

    ownerKey,

    entityType,

    entityKey,

    operationId,

    localData,

    serverData,

    status: "pending",

    resolution: null,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  });

  return conflictId;
}

export async function getPendingOfflineConflicts() {
  const ownerKey = getOwnerKey();

  return db.offlineConflicts
    .where("ownerKey")
    .equals(ownerKey)
    .and((conflict) => conflict.status === "pending")
    .sortBy("createdAt");
}

export async function resolveOfflineConflict(conflictId, resolution) {
  await db.offlineConflicts.update(conflictId, {
    status: resolution,
    resolvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
