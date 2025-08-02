export type ModuleKey = "handover" | "nonconformance" | "maintenance" | "complaints";

export interface DocMeta {
  docNumber: string;
  docName: string;
  revision: string;
  revisionDateISO: string; // auto-updated
  controlled: boolean;
}

export interface TabLabels {
  handover: string;
  nonconformance: string;
  maintenance: string;
  complaints: string;
  settings: string;
}

export interface CompanyProfile {
  name: string;
  logoUrl: string; // 1:1, <=512x512 enforced client-side
}

export interface Preset {
  name: string;
  company: CompanyProfile;
  tabs: TabLabels;
  docMeta: Record<ModuleKey, DocMeta>;
  featureFlags?: Record<string, boolean>;
  locale?: string;
}

export interface AppConfig {
  company: CompanyProfile;
  tabs: TabLabels;
  docMeta: Record<ModuleKey, DocMeta>;
  presets: Preset[];
  roles: Record<string, string[]>;
  featureFlags: Record<string, boolean>;
  locale: string;
}
