import db from "./localDB";

export async function cachePatients(patients) {
  if (!Array.isArray(patients) || patients.length === 0) return;

  await db.patients.bulkPut(patients);
}

export async function getCachedPatients() {
  return db.patients.toArray();
}

export async function cacheDoctorRecords(records) {
  if (!Array.isArray(records) || records.length === 0) return;

  await db.doctorRecords.bulkPut(records);
}

export async function getCachedDoctorRecords(patientId) {
  return db.doctorRecords.where("patientId").equals(patientId).toArray();
}
