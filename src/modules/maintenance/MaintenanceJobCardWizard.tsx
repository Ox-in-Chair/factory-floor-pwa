import React, { useEffect, useState, useRef } from "react";

type Attachment = {
  id: string;
  type: "photo" | "voice";
  label: string;
};

type MaintenanceForm = {
  machineId: string;
  issueDescription: string;
  requiredParts: string;
  attachments: Attachment[];
  lastSaved: string;
};

const STORAGE_KEY = "wizard-maintenance-job";

const defaultForm: MaintenanceForm = {
  machineId: "",
  issueDescription: "",
  requiredParts: "",
  attachments: [],
  lastSaved: ""
};

const debounce = (fn: () => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

export const MaintenanceJobCardWizard: React.FC = () => {
  const [form, setForm] = useState<MaintenanceForm>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultForm, ...JSON.parse(stored) };
    } catch {}
    return defaultForm;
  });
  const [errors, setErrors] = useState<{
    machineId?: string;
    issueDescription?: string;
    requiredParts?: string;
  }>({});
  const saveRef = useRef<() => void>();

  useEffect(() => {
    saveRef.current = debounce(() => {
      const updated = { ...form, lastSaved: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setForm(updated);
    }, 500);
  }, [form]);

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!form.machineId.trim()) newErrors.machineId = "Machine ID required.";
    if (!form.issueDescription.trim()) newErrors.issueDescription = "Issue description required.";
    if (!form.requiredParts.trim()) newErrors.requiredParts = "Required parts required.";
    setErrors(newErrors);
    saveRef.current && saveRef.current();
  }, [form]);

  const addAttachment = (type: "photo" | "voice") => {
    setForm(f => ({
      ...f,
      attachments: [
        ...f.attachments,
        {
          id: Math.random().toString(36).substring(2),
          type,
          label: type === "photo" ? "Photo placeholder" : "Voice note placeholder"
        }
      ]
    }));
  };

  return (
    <div className="card">
      <h3>Maintenance Job Card</h3>
      <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Machine ID *</label>
          <input
            aria-label="Machine ID"
            value={form.machineId}
            onChange={e => setForm(f => ({ ...f, machineId: e.target.value }))}
          />
          {errors.machineId && <div style={{ color: "red", fontSize: 12 }}>{errors.machineId}</div>}
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Issue Description *</label>
          <textarea
            aria-label="Issue Description"
            value={form.issueDescription}
            onChange={e => setForm(f => ({ ...f, issueDescription: e.target.value }))}
            rows={3}
            style={{ width: "100%" }}
          />
          {errors.issueDescription && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.issueDescription}</div>
          )}
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Required Parts *</label>
          <input
            aria-label="Required Parts"
            value={form.requiredParts}
            onChange={e => setForm(f => ({ ...f, requiredParts: e.target.value }))}
          />
          {errors.requiredParts && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.requiredParts}</div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Attachments</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {form.attachments.map(a => (
              <div
                key={a.id}
                style={{
                  padding: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  background: "#f9f9f9",
                  minWidth: 120
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600 }}>{a.type.toUpperCase()}</div>
                <div style={{ fontSize: 12 }}>{a.label}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => addAttachment("photo")}>
                + Add Photo
              </button>
              <button type="button" onClick={() => addAttachment("voice")}>
                + Add Voice
              </button>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, marginTop: 8 }}>
          {form.lastSaved ? (
            <span>Last saved: {new Date(form.lastSaved).toLocaleTimeString()}</span>
          ) : (
            <span>Not yet saved</span>
          )}
        </div>
      </div>
    </div>
  );
};


export default MaintenanceJobCardWizard;


