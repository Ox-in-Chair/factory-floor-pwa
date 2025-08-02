import React, { useEffect, useState } from "react";
import { PRESET_THEMES } from "../lib/themes";
import { loadForm, saveForm } from "../lib/db";
import type { CompanyProfile, ThemeConfig } from "../lib/types";

const PROFILE_KEY = "company-profile-v1";
const CHANNEL = "company-profile";

export const ThemeCustomizer: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [draft, setDraft] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    loadForm(PROFILE_KEY).then((existing: any) => {
      if (existing) {
        const p = existing as CompanyProfile;
        setProfile(p);
        setDraft(p.theme);
        if (p.theme?.palette) {
          Object.entries(p.theme.palette).forEach(([k, v]: any) => {
            document.documentElement.style.setProperty(`--color-${k}`, v);
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!draft || !profile) return;
    Object.entries(draft.palette).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--color-${k}`, v);
    });
    const updated: CompanyProfile = { ...profile, theme: draft };
    setProfile(updated);
    saveForm(PROFILE_KEY, updated);
    const bc = new BroadcastChannel(CHANNEL);
    bc.postMessage({ type: "profile-updated", profile: updated });
    bc.close();
  }, [draft]);

  if (!draft) return null;

  const updateColor = (key: keyof typeof draft.palette, value: string) => {
    setDraft(t => t ? { ...t, palette: { ...t.palette, [key]: value } } : null);
  };

  return (
    <div className="card">
      <div className="subheading">Theme Customization</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        <div style={{ flex: "1 1 180px" }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Presets</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PRESET_THEMES.map(t => (
              <div
                key={t.name}
                style={{
                  border: "1px solid #ccc",
                  padding: 8,
                  borderRadius: 6,
                  cursor: "pointer",
                  width: 120
                }}
                onClick={() => setDraft(t)}
              >
                <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "2 1 300px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
            <div>
              <div className="label">Primary</div>
              <input
                className="input"
                type="color"
                value={draft.palette.primary}
                onChange={e => updateColor("primary", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Accent</div>
              <input
                className="input"
                type="color"
                value={draft.palette.accent}
                onChange={e => updateColor("accent", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Warning</div>
              <input
                className="input"
                type="color"
                value={draft.palette.warning}
                onChange={e => updateColor("warning", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Critical</div>
              <input
                className="input"
                type="color"
                value={draft.palette.critical}
                onChange={e => updateColor("critical", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Heading Text</div>
              <input
                className="input"
                type="color"
                value={draft.palette.heading}
                onChange={e => updateColor("heading", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Body Text</div>
              <input
                className="input"
                type="color"
                value={draft.palette.body}
                onChange={e => updateColor("body", e.target.value)}
              />
            </div>
            <div>
              <div className="label">Background</div>
              <input
                className="input"
                type="color"
                value={draft.palette.background}
                onChange={e => updateColor("background", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
