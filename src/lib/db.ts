import { openDB } from "idb";

const DB_NAME = "factory-floor";
const STORE_LOG = "wal";
const STORE_FORMS = "forms";

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_LOG)) {
        db.createObjectStore(STORE_LOG, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_FORMS)) {
        db.createObjectStore(STORE_FORMS, { keyPath: "formId" });
      }
    }
  });
}

export async function appendLog(entry: any) {
  const db = await getDb();
  await db.add(STORE_LOG, { ...entry, timestamp: Date.now() });
}

export async function saveForm(formId: string, data: any) {
  const db = await getDb();
  await db.put(STORE_FORMS, { formId, data, updatedAt: Date.now() });
  await appendLog({ type: "form-save", formId, data });
}

export async function loadForm(formId: string) {
  const db = await getDb();
  const rec = await db.get(STORE_FORMS, formId);
  return rec?.data || null;
}
