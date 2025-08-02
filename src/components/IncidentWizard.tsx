import React, { useEffect, useState } from 'react';
import { saveForm, loadForm } from '../lib/db';

type IncidentData = {
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reporter: string;
  shiftCode: string;
};

const FORM_ID = 'nonconformity-incident-v1';

export const IncidentWizard: React.FC = () => {
  const [data, setData] = useState<IncidentData>({
    title: '',
    description: '',
    severity: 'Low',
    reporter: '',
    shiftCode: ''
  });
  const [status, setStatus] = useState('Unsaved');

  useEffect(() => {
    loadForm(FORM_ID).then(existing => {
      if (existing) setData((prev) => ({ ...prev, ...existing }));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveForm(FORM_ID, data).then(() => setStatus('Saved locally'));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const handleChange = (field: keyof IncidentData, value: any) => {
    setData((d) => ({ ...d, [field]: value }));
  };

  const submit = () => {
    const payload = {
      ...data,
      submittedAt: new Date().toISOString(),
      formType: 'nonconformity',
      supervisor: data.reporter,
      shiftCode: data.shiftCode,
      localId: FORM_ID
    };
    alert('Submitted: ' + JSON.stringify(payload));
  };

  const severityBorder = {
    Low: '1px solid #ccc',
    Medium: '2px solid var(--color-yellow)',
    High: '2px solid var(--color-red)'
  } as const;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="" style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: 'var(--color-blue)', marginTop: 0 }}>Non-conformity Incident</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>Title</div>
          <input
            className="input"
            value={data.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Short summary"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>Description</div>
          <textarea
            className="input"
            value={data.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Detailed description"
            rows={3}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>Severity</div>
          <select
            className="input"
            style={{ border: severityBorder[data.severity] }}
            value={data.severity}
            onChange={e => handleChange('severity', e.target.value as any)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>Reporter</div>
          <input
            className="input"
            value={data.reporter}
            onChange={e => handleChange('reporter', e.target.value)}
            placeholder="Supervisor name"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>Shift Code</div>
          <input
            className="input"
            value={data.shiftCode}
            onChange={e => handleChange('shiftCode', e.target.value)}
            placeholder="e.g., A1, Night"
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <button className="btn-positive" onClick={submit}>Submit</button>
          <div style={{ fontSize: 12 }}>
            <span className="badge" style={{ background: 'var(--color-green)', color: 'white' }}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

