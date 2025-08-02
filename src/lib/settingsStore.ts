/**
 * Central application configuration used across modules.
 * Exporting AppConfig so imports like { AppConfig } succeed.
 */
export type AppConfig = {
  companyName: string;
  logoBase64?: string;
  tabLabels: {
    shiftHandover: string;
    nonConformance: string;
    maintenance: string;
    complaint: string;
  };
  footerDocControl: {
    documentNumber: string;
    documentName: string;
    revision: string;
    revisionDate: string; // ISO timestamp updated when revision changes
    controlled: boolean;
  };
  theme: {
    primary: string; // #0056A3
    secondary1: string; // #00722D
    secondary2: string; // #FFB81C
    secondary3: string; // #D62718
    textColor: string; // #0056A3
  };
};

const STORAGE_KEY = "app-config-v1";

/**
 * Load the current app config from localStorage.
 */
export async function loadAppConfig(): Promise<AppConfig | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppConfig;
  } catch {
    return null;
  }
}

/**
 * Save and broadcast the app config.
 */
export function saveAppConfig(config: AppConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  try {
    const bc = new BroadcastChannel("app-config");
    bc.postMessage(config);
    bc.close();
  } catch {
    // ignore if BroadcastChannel unsupported
  }
}

/**
 * Subscribe to live updates of the config (returns unsubscribe).
 */
export function subscribeAppConfig(callback: (cfg: AppConfig) => void) {
  try {
    const bc = new BroadcastChannel("app-config");
    bc.onmessage = (e) => {
      callback(e.data as AppConfig);
    };
    return () => bc.close();
  } catch {
    return () => {};
  }
}
