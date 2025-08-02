export type ModuleKey = "shiftHandover" | "nonConformance" | "maintenance" | "complaint";

export interface TabLabels {
  shiftHandover: string;
  nonConformance: string;
  maintenance: string;
  complaint: string;
}

export interface DocControl {
  documentNumber: string;
  documentName: string;
  revision: string;
  revisionDate: string;
  controlled: boolean;
}

export interface CompanyProfile {
  name: string;
  logoBase64?: string;
}

export interface Preset {
  name: string;
  timestamp: string;
  tabLabels: TabLabels;
  docControls: Record<ModuleKey, DocControl>;
  company: CompanyProfile;
}
