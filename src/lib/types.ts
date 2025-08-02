export type ThemePalette = {
  primary: string;
  accent: string;
  warning: string;
  critical: string;
  heading: string;
  body: string;
  background: string;
};

export type ThemeConfig = {
  name: string;
  alternate?: string;
  palette: ThemePalette;
  darkMode?: boolean;
};

export type TabLabels = {
  shiftHandover: string;
  nonConformance: string;
  maintenance: string;
  complaint: string;
};

export type CompanyProfile = {
  name: string;
  logoBase64?: string;
  theme: ThemeConfig;
  tabLabels: TabLabels;
};

export type FooterDocControl = {
  documentNumber: string;
  documentName: string;
  revision: string;
  revisionDate: string;
  controlled: boolean;
};
