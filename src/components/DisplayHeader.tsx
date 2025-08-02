import React, { useEffect, useState } from "react";
import type { CompanyProfile } from "../lib/types";

const CHANNEL = "company-profile";

export const DisplayHeader: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  const load = async () => {
    const dbReq = await import("../lib/db");
    const existing = await (dbReq as any).loadForm("company-profile-v1");
    if (existing) setProfile(existing as CompanyProfile);
  };

  useEffect(() => {
    load();
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (e) => {
      if (e.data?.type === "profile-updated") {
        setProfile(e.data.profile as CompanyProfile);
      }
    };
    return () => channel.close();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {profile?.logoBase64 ? (
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
              fontSize: 14,
              color: "#666"
            }}
          >
            Logo
          </div>
        )}
        <div>
          <div className="heading">{profile?.name || "Your Company Name"}</div>
        </div>
      </div>
    </div>
  );
};
