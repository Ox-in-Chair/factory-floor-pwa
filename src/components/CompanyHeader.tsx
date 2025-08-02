import React, { useEffect, useState } from "react";
import { subscribe, getConfig, updateCompanyProfile } from "../lib/settingsStore";
import type { CompanyProfile } from "../lib/types";

export const CompanyHeader: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    // initial load
    getConfig().then(cfg => setProfile(cfg.companyProfile));
    // live subscription
    const unsubscribe = subscribe(cfg => {
      setProfile(cfg.companyProfile);
    });
    return () => unsubscribe();
  }, []);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const size = Math.min(img.width, img.height, 512);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        const base64 = canvas.toDataURL("image/png");
        updateCompanyProfile({ logoBase64: base64 });
      };
    };
    reader.readAsDataURL(file);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyProfile({ name: e.target.value });
  };

  if (!profile) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {profile.logoBase64 ? (
          <img
            src={profile.logoBase64}
            alt="Company logo"
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.1)"
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
              borderRadius: 6,
              fontSize: 12,
              color: "#666"
            }}
          >
            Logo
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 24, color: "var(--text-color)" }}>
            {profile.name || "Your Company Name"}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <input
          placeholder="Company name"
          value={profile.name}
          onChange={onNameChange}
          style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <label style={{ cursor: "pointer" }}>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={onLogoChange} />
          <span
            className="btn-secondary-1"
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: "var(--secondary-accent-1)",
              color: "#fff",
              display: "inline-block"
            }}
          >
            Upload Logo
          </span>
        </label>
      </div>
    </div>
  );
};
