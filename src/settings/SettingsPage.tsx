import React, { useEffect, useState } from "react";
import { settingsStore } from "@/state/settingsStore";
import type { AppConfig } from "@/types/app";

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(settingsStore.getState());

  useEffect(() => {
    const unsub = settingsStore.subscribe(c => setConfig(c));
    return unsub;
  }, []);

  const updateCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    settingsStore.setState(prev => ({
      ...prev,
      company: { ...prev.company, name: e.target.value }
    }));
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      settingsStore.setState(prev => ({
        ...prev,
        company: { ...prev.company, logoUrl: data }
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateTabLabel = (key: keyof AppConfig["tabs"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    settingsStore.setState(prev => ({
      ...prev,
      tabs: { ...prev.tabs, [key]: e.target.value }
    } as any));
  };

  const updateDocMeta = (moduleKey: keyof AppConfig["docMeta"], field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    settingsStore.setState(prev => {
      const meta = { ...(prev.docMeta as any)[moduleKey] };
      meta[field] = field === "controlled" ? e.currentTarget.checked : e.target.value;
      return {
        ...prev,
        docMeta: { ...(prev.docMeta as any), [moduleKey]: meta }
      } as any;
    });
  };

  return (
    <div className="container" style={{ padding: 16, maxWidth: 1000 }}>
      <h1 style={{ marginBottom: 8 }}>Settings</h1>
      <section className="card">
        <h2>Branding</h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div>
            <label>
              Company Name
              <input value={config.company.name} onChange={updateCompanyName} style={{ marginTop: 4 }} />
            </label>
          </div>
          <div>
            <label>
              Logo (1:1, ≤512px)
              <input type="file" accept="image/*" onChange={onLogoChange} style={{ marginTop: 4 }} />
            </label>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Tab Labels</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {Object.entries(config.tabs).map(([k, v]) => (
            <div key={k}>
              <label>
                {k}
                <input value={v} onChange={updateTabLabel(k as any)} style={{ marginTop: 4 }} />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Document Control Metadata</h2>
        {Object.entries(config.docMeta).map(([moduleKey, meta]) => (
          <div key={moduleKey} style={{ marginBottom: 12 }}>
            <h3>{moduleKey}</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div>
                <label>
                  Document Number
                  <input value={(meta as any).docNumber} onChange={updateDocMeta(moduleKey as any, "docNumber")} />
                </label>
              </div>
              <div>
                <label>
                  Document Name
                  <input value={(meta as any).docName} onChange={updateDocMeta(moduleKey as any, "docName")} />
                </label>
              </div>
              <div>
                <label>
                  Revision
                  <input value={(meta as any).revision} onChange={updateDocMeta(moduleKey as any, "revision")} />
                </label>
              </div>
              <div>
                <label>
                  Controlled
                  <input
                    type="checkbox"
                    checked={(meta as any).controlled}
                    onChange={updateDocMeta(moduleKey as any, "controlled")}
                  />
                </label>
              </div>
              <div>
                <label>
                  Revision Date (auto)
                  <input value={(meta as any).revisionDateISO} readOnly />
                </label>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
