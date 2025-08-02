import React, { useEffect, useState, useRef } from "react";

type Attachment = {
  id: string;
  type: "photo" | "voice";
  label: string;
};

type ShiftHandoverForm = {
  summary: string;
  handoverDetails: string;
  attachments: Attachment[];
  lastSaved: string;
};

const STORAGE_KEY = "wizard-shift-handover";

const defaultForm: ShiftHandoverForm = {
  summary: "",
  handoverDetails: "",
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

export const ShiftHandoverWizard: React.FC = () => {
  const [form, setForm] = useState<ShiftHandoverForm>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultForm, ...JSON.parse(stored) };
    } catch {}
    return defaultForm;
  });
  const [errors, setErrors] = useState<{ summary?: string; handoverDetails?: string }>({});
  const saveRef = useRef<() => void>();

  // Debounced save
  useEffect(() => {
    saveRef.current = debounce(() => {
      const updated = { ...form, lastSaved: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setForm(updated);
    }, 500);
  }, [form]);

  // Trigger validation + save on change
  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!form.summary.trim()) newErrors.summary = "Summary is required.";
    if (!form.handoverDetails.trim()) newErrors.handoverDetails = "Handover details are required.";
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
      <h3>Shift-Change Handover Report</h3>
      <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Summary *</label>
          <textarea
            aria-label="Summary"
            value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            rows={3}
            style={{ width: "100%" }}
          />
          {errors.summary && <div style={{ color: "red", fontSize: 12 }}>{errors.summary}</div>}
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Handover Details *</label>
          <textarea
            aria-label="Handover details"
            value={form.handoverDetails}
            onChange={e => setForm(f => ({ ...f, handoverDetails: e.target.value }))}
            rows={4}
            style={{ width: "100%" }}
          />
          {errors.handoverDetails && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.handoverDetails}</div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Attachments</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {form.attachments.map(a => (
              <div
                key={a.id}
                style={{
                  padding: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  background: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
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

