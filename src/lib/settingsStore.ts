import { loadForm, saveForm } from "./db";
import type { CompanyProfile, FooterDocControl } from "./types";

export type AppConfig = {
  companyProfile: CompanyProfile;
  footer: FooterDocControl;
};

const PROFILE_KEY = "company-profile-v1";
const FOOTER_KEY = "footer-doc-control-v1";

type Listener = (config: AppConfig) => void;
const listeners: Listener[] = [];

// Broadcast channel for cross-tab real-time propagation
const broadcast = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel("app-config")
  : null;

if (broadcast) {
  broadcast.onmessage = (ev: any) => {
    if (ev.data?.type === "update" && ev.data?.config) {
      // notify local listeners
      listeners.forEach(fn => {
        try { fn(ev.data.config); } catch {}
      });
    }
  };
}

async function loadCurrent(): Promise<AppConfig> {
  const cp = (await loadForm(PROFILE_KEY)) as CompanyProfile | null;
  const footer = (await loadForm(FOOTER_KEY)) as FooterDocControl | null;

  // Defaults if missing
  const defaultProfile: CompanyProfile = {
    name: "",
    logoBase64: undefined,
    theme: {
      name: "Augusta Vanguard",
      alternate: "Ironstow Blue",
      palette: {
        primary: "#0056A3",
        accent: "#00722D",
        warning: "#FFB81C",
        critical: "#D62718",
        text: "#0056A3",
        background: "#FFFFFF"
      }
    },
    tabLabels: {
      shiftHandover: "Shift-Change Handover Report",
      nonConformance: "Non-conformance Advice",
      maintenance: "Maintenance Job Card",
      complaint: "Complaint Handling"
    }
  };
  const defaultFooter: FooterDocControl = {
    documentNumber: "",
    documentName: "",
    revision: "",
    revisionDate: new Date().toISOString(),
    controlled: true
  };

  return {
    companyProfile: cp || defaultProfile,
    footer: footer || defaultFooter
  };
}

export async function getConfig(): Promise<AppConfig> {
  return loadCurrent();
}

// subscribe returns an unsubscribe function
export function subscribe(fn: Listener): () => void {
  listeners.push(fn);
  // fire with current state immediately
  loadCurrent().then(cfg => {
    try { fn(cfg); } catch {}
  });
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

async function broadcastUpdate(cfg: AppConfig) {
  if (broadcast) {
    try {
      broadcast.postMessage({ type: "update", config: cfg });
    } catch {}
  }
}

// update helpers
export async function updateCompanyProfile(p: Partial<CompanyProfile>) {
  const current = await loadCurrent();
  const updatedProfile = { ...current.companyProfile, ...p };
  await saveForm(PROFILE_KEY, updatedProfile);
  const newCfg: AppConfig = { companyProfile: updatedProfile, footer: current.footer };
  listeners.forEach(fn => { try { fn(newCfg); } catch {} });
  await broadcastUpdate(newCfg);
}

export async function updateFooter(f: Partial<FooterDocControl>) {
  const current = await loadCurrent();
  const updatedFooter: FooterDocControl = { ...current.footer, ...f } as FooterDocControl;
  // if revision changed, bump revisionDate
  if (f.revision && f.revision !== current.footer.revision) {
    updatedFooter.revisionDate = new Date().toISOString();
  }
  await saveForm(FOOTER_KEY, updatedFooter);
  const newCfg: AppConfig = { companyProfile: current.companyProfile, footer: updatedFooter };
  listeners.forEach(fn => { try { fn(newCfg); } catch {} });
  await broadcastUpdate(newCfg);
}
