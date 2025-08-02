import React, { useEffect, useState } from "react";
import { getAppConfig, subscribe, updateCompanyProfile, updateTabLabels, updateFooterControl, savePreset, listPresets, applyPreset, exportPreset, importPreset } from "@/state/legacySettingsStoreWrapper";
import type { AppConfig } from "../lib/types";

const presetNamesKey = "app-preset-names-v1";

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(getAppConfig());
  const [presetName, setPresetName] = useState("");
  const [availablePresets, setAvailablePresets] = useState<string[]>([]);

  useEffect(() => {
    const unsub = subscribe(c => {
      setConfig(c);
    });
    refreshPresetList();
    return () => unsub();
  }, []);

  function refreshPresetList() {
    const presets = listPresets();
    setAvailablePresets(Object.keys(presets));
  }

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

  const handlePresetSave = () => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim());
    refreshPresetList();
    setPresetName("");
  };

  const handleExport = (name: string) => {
    const json = exportPreset(name);
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const name = prompt("Preset name to save as", "ImportedPreset");
      if (!name) return;
      importPreset(name, reader.result);
      refreshPresetList();
    };
    reader.readAsText(file);
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Settings</h2>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr" }}>
        {/* Branding */}
        <div className="card">
          <h3>Branding</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Company Name</div>
              <input
                value={config.companyProfile.name}
                onChange={e => updateCompanyProfile({ name: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Company Logo (1:1 up to 512px)</div>
              <input type="file" accept="image/*" onChange={onLogoChange} />
            </div>
          </div>
        </div>

        {/* Tab Labels */}
        <div className="card">
          <h3>Module Tab Labels</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(config.tabLabels)
              .filter(([k]) => k !== "settings")
              .map(([key, label]) => (
                <div key={key}>
                  <div style={{ fontWeight: 600 }}>{key}</div>
                  <input
                    value={label}
                    onChange={e => updateTabLabels({ [key]: e.target.value } as any)}
                    placeholder={label}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Document Control */}
        <div className="card">
          <h3>Document Control Metadata</h3>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Document Number</div>
              <input
                value={config.footer.documentNumber}
                onChange={e => updateFooterControl({ documentNumber: e.target.value })}
                placeholder="Doc #"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Document Name</div>
              <input
                value={config.footer.documentName}
                onChange={e => updateFooterControl({ documentName: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Revision</div>
              <input
                value={config.footer.revision}
                onChange={e => updateFooterControl({ revision: e.target.value })}
                placeholder="Rev"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Revision Date</div>
              <div>{config.footer.revisionDate ? new Date(config.footer.revisionDate).toLocaleString() : "-"}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Controlled?</div>
              <label>
                <input
                  type="checkbox"
                  checked={config.footer.controlled}
                  onChange={e => updateFooterControl({ controlled: e.target.checked })}
                />{" "}
                {config.footer.controlled ? "Controlled" : "Uncontrolled"}
              </label>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="card">
          <h3>Presets</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontWeight: 600 }}>Save Current as Preset</div>
              <input
                placeholder="Preset name"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
              />
              <div style={{ marginTop: 6 }}>
                <button onClick={handlePresetSave} style={{ marginRight: 8 }}>
                  Save
                </button>
              </div>
            </div>
            <div style={{ flex: "2 1 300px" }}>
              <div style={{ fontWeight: 600 }}>Available Presets</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {availablePresets.map(p => (
                  <div key={p} style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 6, padding: 8 }}>
                    <div style={{ fontWeight: 600 }}>{p}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <button onClick={() => applyPreset(p)}>Apply</button>
                      <button className="secondary-2" onClick={() => handleExport(p)}>Export</button>
                    </div>
                  </div>
                ))}
                {availablePresets.length === 0 && <div>No presets saved yet.</div>}
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600 }}>Import Preset</div>
                <input type="file" accept="application/json" onChange={handleImport} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

