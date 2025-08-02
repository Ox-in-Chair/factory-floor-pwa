import React, { useEffect, useState } from "react";
import { subscribe, getAppConfig } from "@/state/legacySettingsStoreWrapper";
import { CompanyHeader } from "./CompanyHeader";
import { FooterDocControlReadOnly } from "./FooterDocControlReadOnly";
import type { TabLabels } from "../lib/types";
import { SettingsPage } from "./SettingsPage";

type TabKey = "shiftHandover" | "nonConformance" | "maintenance" | "complaint" | "settings";

const placeholderContent: Record<string, React.ReactNode> = {
  shiftHandover: <div className="card"><h3>Shift-Change Handover Report</h3><p>Wizard placeholder content.</p></div>,
  nonConformance: <div className="card"><h3>Non-conformance Advice</h3><p>Wizard placeholder content.</p></div>,
  maintenance: <div className="card"><h3>Maintenance Job Card</h3><p>Wizard placeholder content.</p></div>,
  complaint: <div className="card"><h3>Complaint Handling</h3><p>Wizard placeholder content.</p></div>
};

export const ModuleTabs: React.FC = () => {
  const [active, setActive] = useState<TabKey>("shiftHandover");
  const [labels, setLabels] = useState<TabLabels>({
    shiftHandover: "Shift-Change Handover Report",
    nonConformance: "Non-conformance Advice",
    maintenance: "Maintenance Job Card",
    complaint: "Complaint Handling",
    settings: "Settings"
  });

  useEffect(() => {
    const unsub = subscribe(config => {
      setLabels(config.tabLabels as any);
    });
    return () => unsub();
  }, []);

  const renderBody = () => {
    if (active === "settings") return <SettingsPage />;
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {placeholderContent[active]}
        <FooterDocControlReadOnly />
      </div>
    );
  };

  return (
    <div className="container">
      <CompanyHeader />
      <nav aria-label="Main modules" style={{ marginBottom: 12 }}>
        <ul className="tab-list" role="tablist">
          {(["shiftHandover", "nonConformance", "maintenance", "complaint", "settings"] as TabKey[]).map(k => (
            <li key={k}>
              <button
                role="tab"
                aria-current={active === k ? "page" : undefined}
                className="tab-button"
                onClick={() => setActive(k)}
              >
                {labels[k]}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ flex: 1 }}>{renderBody()}</div>
    </div>
  );
};

