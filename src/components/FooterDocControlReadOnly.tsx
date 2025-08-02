/* src/components/FooterDocControlReadOnly.tsx */
import React, { useEffect, useState } from "react";
import type { DocControl } from "../lib/settings-types";

const loadJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
};

export const FooterDocControlReadOnly: React.FC<{ moduleKey: string }> = ({ moduleKey }) => {
  const [doc, setDoc] = useState<DocControl>({
    documentNumber: "",
    documentName: "",
    revision: "",
    revisionDate: "",
    controlled: true
  });

  useEffect(() => {
    const reload = () => {
      const all = loadJSON("doc-controls", {} as any);
      if (all && all[moduleKey]) {
        setDoc(all[moduleKey]);
      }
    };
    reload();
    const bc = new BroadcastChannel("app-settings");
    bc.onmessage = () => {
      reload();
    };
    return () => bc.close();
  }, [moduleKey]);

  return (
    <div className="footer-readonly">
      <div>
        <div style={{ fontWeight: 600 }}>Document Number</div>
        <div>{doc.documentNumber || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Document Name</div>
        <div>{doc.documentName || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Revision</div>
        <div>{doc.revision || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Revision Date</div>
        <div>{doc.revisionDate || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Status</div>
        <div>{doc.controlled ? "Controlled" : "Uncontrolled"}</div>
      </div>
    </div>
  );
};
