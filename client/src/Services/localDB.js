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

export default db;
