import React, { useEffect, useState } from "react";
import { settingsStore } from "@/state/settingsStore";

export const CompanyHeader: React.FC = () => {
  const [company, setCompany] = useState({ name: "Your Company", logoUrl: "" });

  useEffect(() => {
    const unsubscribe = settingsStore.subscribe(cfg => {
      setCompany(cfg.company);
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt="logo"
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              borderRadius: 8,
              border: "2px solid var(--accent-1)"
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontSize: 12,
              color: "#666"
            }}
          >
            Logo
          </div>
        )}
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)" }}>
            {company.name || "Your Company Name"}
          </div>
        </div>
      </div>
    </div>
  );
};
