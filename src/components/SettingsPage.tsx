/* src/components/SettingsPage.tsx */
import React, { useEffect, useState } from "react";
import { AppConfig, loadConfig, updateConfig } from "../lib/settingsStore";

const PRESET_STORAGE = "factory-floor-presets-v1";

type Preset = {
  name: string;
  config: AppConfig;
  created: string;
};

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function savePresets(presets: Preset[]) {
  localStorage.setItem(PRESET_STORAGE, JSON.stringify(presets));
}

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [newPresetName, setNewPresetName] = useState("");
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    loadConfig().then(c => {
      setConfig(c);
    });
    setPresets(loadPresets());
  }, []);

  const applyUpdate = async (partial: Partial<AppConfig>) => {
    await updateConfig(partial);
  };

  const savePreset = () => {
    if (!config || !newPresetName) return;
    const p: Preset = { name: newPresetName, config, created: new Date().toISOString() };
    const updated = [p, ...presets.filter(x => x.name !== newPresetName)];
    setPresets(updated);
    savePresets(updated);
    setNewPresetName("");
  };

  const recallPreset = (p: Preset) => {
    updateConfig(p.config as any);
  };

  const exportPreset = (p: Preset) => {
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPresetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(txt => {
      try {
        const p: Preset = JSON.parse(txt);
        setPresets(prev => {
          const updated = [p, ...prev.filter(x => x.name !== p.name)];
          savePresets(updated);
          return updated;
        });
        recallPreset(p);
      } catch (err) {
        console.error("Invalid preset", err);
      }
    });
  };

  if (!config) return null;

  return (
    <div className="module-container" aria-label="Settings cockpit">
      <h2>Settings</h2>

      <section style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: "1 1 320px", minWidth: 320 }}>
          <h3>Branding</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontWeight: 600 }}>Company Name</label>
              <input
                aria-label="Company name"
                value={config.companyName}
                onChange={e => {
                  setConfig(c => c && { ...c, companyName: e.target.value });
                  applyUpdate({ companyName: e.target.value });
                }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Company Logo (1:1, max 512px)</label>
              <input type="file" accept="image/*" onChange={e => {
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
                    setConfig(c => c && { ...c, logoBase64: base64 });
                    applyUpdate({ logoBase64: base64 });
                  };
                };
                reader.readAsDataURL(file);
              }} />
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 320 }}>
          <h3>Tab Labels</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label>Shift Handover</label>
              <input
                value={config.tabLabels.shiftHandover}
                onChange={e => {
                  const val = e.target.value;
                  setConfig(c => c && ({ ...c, tabLabels: { ...c.tabLabels, shiftHandover: val } }));
                  applyUpdate({ tabLabels: { ...config.tabLabels, shiftHandover: val } });
                }}
              />
            </div>
            <div>
              <label>Non-conformance</label>
              <input
                value={config.tabLabels.nonConformance}
                onChange={e => {
                  const val = e.target.value;
                  setConfig(c => c && ({ ...c, tabLabels: { ...c.tabLabels, nonConformance: val } }));
                  applyUpdate({ tabLabels: { ...config.tabLabels, nonConformance: val } });
                }}
              />
            </div>
            <div>
              <label>Maintenance</label>
              <input
                value={config.tabLabels.maintenance}
                onChange={e => {
                  const val = e.target.value;
                  setConfig(c => c && ({ ...c, tabLabels: { ...c.tabLabels, maintenance: val } }));
                  applyUpdate({ tabLabels: { ...config.tabLabels, maintenance: val } });
                }}
              />
            </div>
            <div>
              <label>Complaint</label>
              <input
                value={config.tabLabels.complaint}
                onChange={e => {
                  const val = e.target.value;
                  setConfig(c => c && ({ ...c, tabLabels: { ...c.tabLabels, complaint: val } }));
                  applyUpdate({ tabLabels: { ...config.tabLabels, complaint: val } });
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 320 }}>
          <h3>Document Control</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label>Document Number</label>
              <input
                value={config.docControl.documentNumber}
                onChange={e => applyUpdate({ docControl: { ...config.docControl, documentNumber: e.target.value } })}
              />
            </div>
            <div>
              <label>Document Name</label>
              <input
                value={config.docControl.documentName}
                onChange={e => applyUpdate({ docControl: { ...config.docControl, documentName: e.target.value } })}
              />
            </div>
            <div>
              <label>Revision Number</label>
              <input
                value={config.docControl.revision}
                onChange={e => applyUpdate({ docControl: { ...config.docControl, revision: e.target.value } })}
              />
            </div>
            <div>
              <label>Revision Date (auto-updated)</label>
              <input value={config.docControl.revisionDate} readOnly />
            </div>
            <div>
              <label>Controlled?</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={config.docControl.controlled}
                  onChange={e => applyUpdate({ docControl: { ...config.docControl, controlled: e.target.checked } })}
                />
                {config.docControl.controlled ? "Controlled" : "Uncontrolled"}
              </label>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Presets</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", minWidth: 200 }}>
            <label>New Preset Name</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="Audit Ready"
                value={newPresetName}
                onChange={e => setNewPresetName(e.target.value)}
              />
              <button onClick={savePreset} className="btn">Save</button>
            </div>
          </div>
          <div style={{ flex: "1 1 200px", minWidth: 200 }}>
            <label>Import Preset</label>
            <input type="file" accept="application/json" onChange={importPresetFile} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {presets.map(p => (
            <div key={p.name} className="preset-row">
              <div className="preset-chip">{p.name}</div>
              <div style={{ flex: 1 }}>
                <small>Saved: {new Date(p.created).toLocaleString()}</small>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => recallPreset(p)}>Recall</button>
                <button onClick={() => exportPreset(p)}>Export</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
