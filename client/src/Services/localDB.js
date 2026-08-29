import Dexie from "dexie";

const db = new Dexie("RAMHIS_DB");

db.version(1).stores({
  patients: "_id, status, department",
  doctorRecords: "++id, patientId",
  prescriptions: "++id, patient",
  syncQueue: "++id, type",
});

db.version(2).stores({
  patients: "_id, status, department",
  doctorRecords: "++id, patientId",
  prescriptions: "++id, patient",
  syncQueue: "++id, type",
  pharmacyQueue: "_id, patientId",
  medicines: "_id",
});

db.version(3).stores({
  patients: "_id, status, department",
  doctorRecords: "++id, patientId",
  prescriptions: "++id, patient",
  syncQueue: "++id, type",
  pharmacyQueue: "_id, patientId",
  medicines: "_id",
  appMeta: "key",
});

db.version(4).stores({
  patients: "_id, status, department",
  doctorRecords: "++id, patientId",
  prescriptions: "++id, patient",
  syncQueue: "++id, type",
  pharmacyQueue: "_id, patientId",
  medicines: "_id",
  appMeta: "key",

  offlinePatients: "key, ownerKey, serverId, department, status, updatedAt",
  offlineDoctorQueue: "key, ownerKey, serverId, department, status, updatedAt",
  offlineDoctorRecords: "key, ownerKey, patientId, serverId, updatedAt",
  offlinePrescriptions: "key, ownerKey, patientId, serverId, updatedAt",
  offlineOutbox:
    "operationId, ownerKey, entityType, entityKey, status, createdAt",
  offlineMeta: "key, ownerKey, updatedAt",
});

db.version(5).stores({
  patients: "_id, status, department",
  doctorRecords: "++id, patientId",
  prescriptions: "++id, patient",
  syncQueue: "++id, type",
  pharmacyQueue: "_id, patientId",
  medicines: "_id",
  appMeta: "key",

  offlinePatients: "key, ownerKey, serverId, department, status, updatedAt",

  offlineDoctorQueue: "key, ownerKey, serverId, department, status, updatedAt",

  offlineDoctorRecords: "key, ownerKey, patientId, serverId, updatedAt",

  offlinePrescriptions:
    "key, ownerKey, [ownerKey+patientId], patientId, serverId, updatedAt",

  offlineOutbox:
    "operationId, ownerKey, entityType, entityKey, status, createdAt",

  offlineMeta: "key, ownerKey, updatedAt",
});

export default db;
