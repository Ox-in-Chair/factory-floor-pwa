import React from "react";
import { getAppConfig, subscribe } from "@/state/legacySettingsStoreWrapper";
import type { FooterDocControl } from "../lib/types";

export const FooterDocControlReadOnly: React.FC = () => {
  const [footer, setFooter] = React.useState<FooterDocControl>({
    documentNumber: "",
    documentName: "",
    revision: "",
    revisionDate: new Date().toISOString(),
    controlled: true
  });

  React.useEffect(() => {
    const unsub = subscribe(config => {
      setFooter(config.footer);
    });
    return () => unsub();
  }, []);

  return (
    <div className="footer-readonly">
      <div>
        <div style={{ fontWeight: 600 }}>Document Number</div>
        <div>{footer.documentNumber || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Document Name</div>
        <div>{footer.documentName || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Revision</div>
        <div>{footer.revision || "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Revision Date</div>
        <div>{footer.revisionDate ? new Date(footer.revisionDate).toLocaleString() : "-"}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Controlled?</div>
        <div>{footer.controlled ? "Controlled" : "Uncontrolled"}</div>
      </div>
    </div>
  );
};

