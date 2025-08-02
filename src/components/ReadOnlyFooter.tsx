import React, { useEffect, useState } from "react";
import { loadForm } from "../lib/db";
import type { FooterDocControl } from "../lib/types";

type Props = {
  moduleKey: "shiftHandover" | "nonConformance" | "maintenance" | "complaint";
};

const keyFor = (m: string) => `footer-doc-control-${m}-v1`;

export const ReadOnlyFooter: React.FC<Props> = ({ moduleKey }) => {
  const [ctrl, setCtrl] = useState<FooterDocControl | null>(null);
  useEffect(() => {
    loadForm(keyFor(moduleKey)).then((existing: any) => {
      if (existing) setCtrl(existing as FooterDocControl);
    });
  }, [moduleKey]);
  if (!ctrl) return null;
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        borderTop: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        fontSize: 12
      }}
    >
      <div>
        <div className="label">Document#</div>
        <div>{ctrl.documentNumber}</div>
      </div>
      <div>
        <div className="label">Name</div>
        <div>{ctrl.documentName}</div>
      </div>
      <div>
        <div className="label">Revision</div>
        <div>{ctrl.revision}</div>
      </div>
      <div>
        <div className="label">Rev Date</div>
        <div>{new Date(ctrl.revisionDate).toLocaleString()}</div>
      </div>
      <div>
        <div className="label">Status</div>
        <div>{ctrl.controlled ? "Controlled" : "Uncontrolled"}</div>
      </div>
    </div>
  );
};
