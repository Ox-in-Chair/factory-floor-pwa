import { AppConfig, ModuleKey } from "../types/app";
import { idbGet, idbSet } from "../utils/indexeddb";
import { debounce } from "../utils/debounce";

const CHANNEL = "settings-bus";
const KEY = "app-config";

const initial: AppConfig = {
  company: { name: "Company", logoUrl: "" },
  tabs: {
    handover: "Shift-Change Handover Report",
    nonconformance: "Non-conformance Advice",
    maintenance: "Maintenance Job Card",
    complaints: "Complaint Handling",
    settings: "Settings"
  },
  docMeta: {
    handover: { docNumber: "", docName: "", revision: "0", revisionDateISO: new Date().toISOString(), controlled: true },
    nonconformance: { docNumber: "", docName: "", revision: "0", revisionDateISO: new Date().toISOString(), controlled: true },
    maintenance: { docNumber: "", docName: "", revision: "0", revisionDateISO: new Date().toISOString(), controlled: true },
    complaints: { docNumber: "", docName: "", revision: "0", revisionDateISO: new Date().toISOString(), controlled: true }
  },
  presets: [],
  roles: {},
  featureFlags: {},
  locale: "en"
};

type Listener = (s: AppConfig) => void;

let state: AppConfig = initial;
const listeners = new Set<Listener>();
const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;

const persist = debounce(async (s: AppConfig) => {
  try {
    await idbSet(KEY, s);
  } catch {}
}, 250);

async function hydrate() {
  try {
    const saved = await idbGet<AppConfig>(KEY);
    if (saved) {
      state = saved;
    }
  } catch {}
  // notify
  listeners.forEach(l => l(state));
  if (bc) {
    bc.onmessage = (e: any) => {
      if (e?.data) {
        state = e.data as AppConfig;
        listeners.forEach(l => l(state));
      }
    };
  }
}

hydrate();

function applyRevisionDateUpdate(next: AppConfig, prev: AppConfig) {
  (Object.keys(next.docMeta) as ModuleKey[]).forEach(k => {
    if (next.docMeta[k].revision !== prev.docMeta[k].revision) {
      next.docMeta[k].revisionDateISO = new Date().toISOString();
    }
  });
}

export const settingsStore = {
  getState() {
    return state;
  },
  async init() {
    await hydrate();
    return state;
  },
  setState(mutator: (prev: AppConfig) => AppConfig) {
    const prev = state;
    const next = mutator(state);
    applyRevisionDateUpdate(next, prev);
    state = next;
    listeners.forEach(l => l(state));
    if (bc) {
      bc.postMessage(state);
    }
    persist(state);
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
  }
};
