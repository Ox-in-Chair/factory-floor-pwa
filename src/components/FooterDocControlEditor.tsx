import React, { useEffect, useState, useRef } from "react";
import { saveForm, loadForm } from "../lib/db";
import type { FooterDocControl } from "../lib/types";

type Props = {
  moduleKey: "shiftHandover" | "nonConformance" | "maintenance" | "complaint";
};

const keyFor = (m: string) => `footer-doc-control-${m}-v1`;

export const FooterDocControlEditor: React.FC<Props> = ({ moduleKey }) => {
  const [ctrl, setCtrl] = useState<FooterDocControl>({
    documentNumber: "",
    documentName: "",
    revision: "",
    revisionDate: new Date().toISOString(),
    controlled: true
  });
  const prevRevision = useRef<string>(ctrl.revision);

  useEffect(() => {
    loadForm(keyFor(moduleKey)).then((existing: any) => {
      if (existing) setCtrl(existing as FooterDocControl);
    });
  }, [moduleKey]);

  useEffect(() => {
    if (ctrl.revision !== prevRevision.current) {
      setCtrl(c => ({ ...c, revisionDate: new Date().toISOString() }));
      prevRevision.current = ctrl.revision;
    }
    const t = setTimeout(() => {
      saveForm(keyFor(moduleKey), ctrl);
    }, 200);
    return () => clearTimeout(t);
  }, [ctrl, moduleKey]);

  return (
    <div className="card">
      <div className="subheading" style={{ marginBottom: 6 }}>{`Document Control for ${moduleKey}`}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="label">Document Number</div>
          <input
            className="input"
            value={ctrl.documentNumber}
            onChange={e => setCtrl(c => ({ ...c, documentNumber: e.target.value }))}
            style={{ width: 140 }}
          />
        </div>
        <div>
          <div className="label">Document Name</div>
          <input
            className="input"
            value={ctrl.documentName}
            onChange={e => setCtrl(c => ({ ...c, documentName: e.target.value }))}
            style={{ width: 180 }}
          />
        </div>
        <div>
          <div className="label">Revision</div>
          <input
            className="input"
            value={ctrl.revision}
            onChange={e => setCtrl(c => ({ ...c, revision: e.target.value }))}
            style={{ width: 100 }}
          />
        </div>
        <div>
          <div className="label">Revision Date</div>
          <input
            className="input"
            value={new Date(ctrl.revisionDate).toLocaleString()}
            disabled
            style={{ width: 160, background: "#f5f5f5" }}
          />
        </div>
        <div>
          <div className="label">Controlled?</div>
          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="checkbox"
              checked={ctrl.controlled}
              onChange={e => setCtrl(c => ({ ...c, controlled: e.target.checked }))}
            />
            {ctrl.controlled ? "Controlled" : "Uncontrolled"}
          </label>
        </div>
      </div>
    </div>
  );
};
