import React, { useState } from "react";
import { settingsStore } from "@/state/settingsStore";
import { CompanyHeader } from "@/components/CompanyHeader";
import { ReadOnlyFooter } from "@/components/ReadOnlyFooter";
import { SettingsPage } from "@/settings/SettingsPage";
import { ShiftHandoverWizard } from "@/modules/handover/ShiftHandoverWizard";
import { NonConformanceWizard } from "@/modules/nonconformance/NonConformanceWizard";
import { MaintenanceJobCardWizard } from "@/modules/maintenance/MaintenanceJobCardWizard";
import { ComplaintWizard } from "@/modules/complaints/ComplaintWizard";

type ModuleKey = "handover" | "nonconformance" | "maintenance" | "complaints" | "settings";

const moduleMap: Record<ModuleKey, { label: string; element: React.ReactNode }> = {
  handover: { label: settingsStore.getState().tabs.handover, element: <ShiftHandoverWizard /> },
  nonconformance: { label: settingsStore.getState().tabs.nonconformance, element: <NonConformanceWizard /> },
  maintenance: { label: settingsStore.getState().tabs.maintenance, element: <MaintenanceJobCardWizard /> },
  complaints: { label: settingsStore.getState().tabs.complaints, element: <ComplaintWizard /> },
  settings: { label: settingsStore.getState().tabs.settings || "Settings", element: <SettingsPage /> }
};

export const App: React.FC = () => {
  const [active, setActive] = useState<ModuleKey>("handover");
  const cfg = settingsStore.getState();

  // subscribe to update labels if changed
  React.useEffect(() => {
    const unsub = settingsStore.subscribe(c => {
      // force re-render on config change by bumping active (cheap)
      setActive(a => a);
    });
    return unsub;
  }, []);

  const current = moduleMap[active] || moduleMap["handover"];

  return (
    <div style={{ padding: 12, maxWidth: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 8 }}>
      <CompanyHeader />
      <nav aria-label="Main navigation" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {(["handover", "nonconformance", "maintenance", "complaints", "settings"] as ModuleKey[]).map(k => {
          const isActive = k === active;
          return (
            <button
              key={k}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActive(k)}
              className="tab"
              style={{
                background: isActive ? "var(--accent-3)" : "var(--accent-2)",
                color: "white",
                fontSize: "1rem",
                fontWeight: 600
              }}
            >
              {moduleMap[k].label}
            </button>
          );
        })}
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>{current.element}</div>
        {active !== "settings" && <ReadOnlyFooter moduleKey={active} />}
      </div>
    </div>
  );
};

export default App;
