/* src/components/CompanyHeader.tsx */
import React, { useEffect, useState } from "react";
import type { CompanyProfile } from "../lib/types";

export const CompanyHeader: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    subscribe(c => setConfig(c));
    loadConfig().then(c => setConfig(c));
  }, []);

  if (!config) return null;

  return (
    <div className="company-header" aria-label="Company branding">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {config.logoBase64 ? (
          <img src={config.logoBase64} alt="Company logo" />
        ) : (
          <div style={{
            width: 64,
            height: 64,
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            fontSize: 12,
            color: "#666"
          }}>
            Logo
          </div>
        )}
        <div className="name">{config.companyName || "Your Company Name"}</div>
      </div>
    </div>
  );
};
