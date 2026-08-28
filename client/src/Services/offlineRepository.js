import db from "./localDB";

function getOwnerKey() {
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
