/* src/components/ModuleTabs.tsx */
import React, { useState, useEffect } from "react";
import { ShiftHandoverWizard } from "./ShiftHandoverWizard";
import { NonConformanceWizard } from "./NonConformanceWizard";
import { MaintenanceJobCardWizard } from "./MaintenanceJobCardWizard";
import { ComplaintWizard } from "./ComplaintWizard";
import { SettingsPage } from "./SettingsPage";

type TabKey = "shiftHandover" | "nonConformance" | "maintenance" | "complaint" | "settings";

const DISPLAY_NAMES: Record<TabKey, string> = {
  shiftHandover: "Shift-Change Handover Report",
  nonConformance: "Non-conformance Advice",
  maintenance: "Maintenance Job Card",
  complaint: "Complaint Handling",
  settings: "Settings"
};

export const ModuleTabs: React.FC = () => {
  const [active, setActive] = useState<TabKey>("shiftHandover");
  const [labels, setLabels] = useState<Record<string, string>>(DISPLAY_NAMES);
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    subscribe(c => {
      setConfig(c);
      setLabels({
        ...(labels as any),
        shiftHandover: c.tabLabels.shiftHandover,
        nonConformance: c.tabLabels.nonConformance,
        maintenance: c.tabLabels.maintenance,
        complaint: c.tabLabels.complaint,
      });
    });
    loadConfig().then(c => {
      setConfig(c);
      setLabels({
        ...(labels as any),
        shiftHandover: c.tabLabels.shiftHandover,
        nonConformance: c.tabLabels.nonConformance,
        maintenance: c.tabLabels.maintenance,
        complaint: c.tabLabels.complaint,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCurrent = () => {
    switch (active) {
      case "shiftHandover":
        return <ShiftHandoverWizard />;
      case "nonConformance":
        return <NonConformanceWizard />;
      case "maintenance":
        return <MaintenanceJobCardWizard />;
      case "complaint":
        return <ComplaintWizard />;
      case "settings":
        return <SettingsPage />;
    }
  };

  return (
    <>
      <nav className="nav-bar" aria-label="Main navigation">
        <ul className="tab-list">
          {(["shiftHandover", "nonConformance", "maintenance", "complaint", "settings"] as TabKey[]).map(k => (
            <li key={k}>
              <button
                className="tab"
                aria-current={active === k ? "page" : undefined}
                onClick={() => setActive(k)}
              >
                {labels[k]}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="content">{renderCurrent()}</div>
    </>
  );
};
