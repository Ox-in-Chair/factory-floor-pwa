import React from "react";
import { settingsStore } from "@/state/settingsStore";
import type { ModuleKey } from "@/types/app";

const ReadOnlyFooterSimple: React.FC<{ moduleKey: ModuleKey }> = ({ moduleKey }) => {
  const [config, setConfig] = React.useState(settingsStore.getState());
  React.useEffect(() => {
    const unsub = settingsStore.subscribe(s => setConfig(s));
    return () => unsub();
  }, []);
  const doc = config.docMeta[moduleKey] || {
    docNumber: "",
    docName: "",
    revision: "",
    revisionDateISO: "",
    controlled: true
  };
  return (
    <div className="footer-readonly" aria-label="Document metadata" style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: 12, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {config.company.logoUrl ? (
          <img src={config.company.logoUrl} alt="logo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 32, height: 32, background: "#eee", borderRadius: 6 }} />
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{config.company.name || "Company Name"}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div>Doc#: {doc.docNumber || "—"}</div>
        <div>Name: {doc.docName || "—"}</div>
        <div>Rev: {doc.revision || "—"}</div>
        <div>Date: {doc.revisionDateISO ? new Date(doc.revisionDateISO).toLocaleString() : "—"}</div>
        <div>Status: {doc.controlled ? "Controlled" : "Uncontrolled"}</div>
      </div>
    </div>
  );
};

export default ReadOnlyFooterSimple;
