import type { FooterDocControl } from "../lib/types";
/* src/components/FooterDocControl.tsx */
import React, { useEffect, useState } from "react";
import { AppConfig, loadConfig } from "@/state/legacySettingsStoreWrapper";

export const FooterDocControl: React.FC<{ editable?: boolean; onChange?: (doc: AppConfig["docControl"]) => void }> = ({ editable = false, onChange }) => {
  const [doc, setDoc] = useState<AppConfig["docControl"] | null>(null);

  useEffect(() => {
    loadConfig().then(c => setDoc(c.docControl));
  }, []);

  if (!doc) return null;

  const handleChange = (field: string, value: any) => {
    if (!editable) return;
    setDoc(d => {
      if (!d) return d;
      const updated = { ...d, [field]: value };
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="footer-readonly" aria-label="Document control metadata">
      <div>
        <div className="label">Document Number</div>
        <div>{doc.documentNumber || "-"}</div>
      </div>
      <div>
        <div className="label">Document Name</div>
        <div>{doc.documentName || "-"}</div>
      </div>
      <div>
        <div className="label">Revision</div>
        <div>{doc.revision || "-"}</div>
      </div>
      <div>
        <div className="label">Revision Date</div>
        <div>{doc.revisionDate || "-"}</div>
      </div>
      <div>
        <div className="label">Controlled?</div>
        <div>{doc.controlled ? "Controlled" : "Uncontrolled"}</div>
      </div>
    </div>
  );
};


