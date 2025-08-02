import React from "react";
import { settingsStore } from "@/state/settingsStore";

export const ReadOnlyFooter: React.FC<{ moduleKey: string }> = ({ moduleKey }) => {
  const cfg = settingsStore.getState();
  const meta = (cfg.docMeta as any)[moduleKey] || {};
  return (
    <div
      className="footer-readonly"
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        padding: 8,
        borderTop: "1px solid rgba(0,0,0,0.1)",
        fontSize: 12
      }}
    >
      <div>
        <strong>Doc#: </strong> {meta.docNumber || "-"}
      </div>
      <div>
        <strong>Name: </strong> {meta.docName || "-"}
      </div>
      <div>
        <strong>Rev: </strong> {meta.revision || "-"} on {meta.revisionDateISO ? new Date(meta.revisionDateISO).toLocaleDateString() : "-"}
      </div>
      <div>
        <strong>Status: </strong> {meta.controlled ? "Controlled" : "Uncontrolled"}
      </div>
    </div>
  );
};
