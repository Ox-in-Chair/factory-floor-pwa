import React, { useState, useEffect } from "react";
import ShiftHandoverWizard from "@/modules/handover/ShiftHandoverWizard";
import NonConformanceWizard from "@/modules/nonconformance/NonConformanceWizard";
import MaintenanceJobCardWizard from "@/modules/maintenance/MaintenanceJobCardWizard";
import ComplaintWizard from "@/modules/complaints/ComplaintWizard";
import SettingsPage from "@/settings/SettingsPage";
import { settingsStore } from "@/state/settingsStore";
import type { ModuleKey } from "@/types/app";
import ReadOnlyFooterSimple from "@/components/ReadOnlyFooterSimple";

type TabKey = ModuleKey | "settings";

const tabToModuleKey = {
  handover: "handover",
  nonconformance: "nonconformance",
  maintenance: "maintenance",
  complaints: "complaints"
} as const;

const AppShell: React.FC = () => {
  const [active, setActive] = useState<TabKey>("handover");
  const [tabs, setTabs] = useState<Record<string, string>>({
    handover: "Shift-Change Handover Report",
    nonconformance: "Non-conformance Advice",
    maintenance: "Maintenance Job Card",
    complaints: "Complaint Handling",
    settings: "Settings"
  });

  useEffect(() => {
    const unsub = settingsStore.subscribe(cfg => {
      setTabs({
        handover: cfg.tabs.handover,
        nonconformance: cfg.tabs.nonconformance,
        maintenance: cfg.tabs.maintenance,
        complaints: cfg.tabs.complaints,
        settings: cfg.tabs.settings
      });
    });
    return () => unsub();
  }, []);

  const renderMain = () => {
    switch (active) {
      case "handover":
        return (
          <>
            <ShiftHandoverWizard />
            <ReadOnlyFooterSimple moduleKey="handover" />
          </>
        );
      case "nonconformance":
        return (
          <>
            <NonConformanceWizard />
            <ReadOnlyFooterSimple moduleKey="nonconformance" />
          </>
        );
      case "maintenance":
        return (
          <>
            <MaintenanceJobCardWizard />
            <ReadOnlyFooterSimple moduleKey="maintenance" />
          </>
        );
      case "complaints":
        return (
          <>
            <ComplaintWizard />
            <ReadOnlyFooterSimple moduleKey="complaints" />
          </>
        );
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav aria-label="Primary" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12 }}>
        {(["handover", "nonconformance", "maintenance", "complaints", "settings"] as TabKey[]).map(k => (
          <button
            key={k}
            aria-current={active === k ? "page" : undefined}
            className="tab"
            onClick={() => setActive(k)}
            style={{
              fontSize: "1rem",
              fontWeight: active === k ? 700 : 500
            }}
          >
            {tabs[k]}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: 12 }}>{renderMain()}</main>
    </div>
  );
};

export default AppShell;
