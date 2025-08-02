import React, { useEffect, useState, useRef } from "react";

type Attachment = {
  id: string;
  type: "photo" | "voice";
  label: string;
};

type ComplaintForm = {
  customerName: string;
  complaintDetails: string;
  resolutionSuggestion: string;
  attachments: Attachment[];
  lastSaved: string;
};

const STORAGE_KEY = "wizard-complaint";

const defaultForm: ComplaintForm = {
  customerName: "",
  complaintDetails: "",
  resolutionSuggestion: "",
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

export const ComplaintWizard: React.FC = () => {
  const [form, setForm] = useState<ComplaintForm>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultForm, ...JSON.parse(stored) };
    } catch {}
    return defaultForm;
  });
  const [errors, setErrors] = useState<{
    customerName?: string;
    complaintDetails?: string;
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
    if (!form.customerName.trim()) newErrors.customerName = "Customer name required.";
    if (!form.complaintDetails.trim()) newErrors.complaintDetails = "Complaint details required.";
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
      <h3>Complaint Handling</h3>
      <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Customer Name *</label>
          <input
            aria-label="Customer Name"
            value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
          />
          {errors.customerName && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.customerName}</div>
          )}
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Complaint Details *</label>
          <textarea
            aria-label="Complaint Details"
            value={form.complaintDetails}
            onChange={e => setForm(f => ({ ...f, complaintDetails: e.target.value }))}
            rows={3}
            style={{ width: "100%" }}
          />
          {errors.complaintDetails && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.complaintDetails}</div>
          )}
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Resolution Suggestion</label>
          <textarea
            aria-label="Resolution Suggestion"
            value={form.resolutionSuggestion}
            onChange={e => setForm(f => ({ ...f, resolutionSuggestion: e.target.value }))}
            rows={2}
            style={{ width: "100%" }}
          />
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


export default ComplaintWizard;


