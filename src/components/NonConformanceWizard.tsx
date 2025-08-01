import React, { useEffect, useState } from 'react';
import { saveForm, loadForm } from '../lib/db';

type Data = {
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reporter: string;
  shiftCode: string;
  correctiveAction: string;
  attachments: string[];
};

const FORM_ID = 'nonconformity-advice-v1';

export const NonConformanceWizard: React.FC = () => {
  const [data, setData] = useState<Data>({
    title: '',
    description: '',
    severity: 'Low',
    reporter: '',
    shiftCode: '',
    correctiveAction: '',
    attachments: []
  });
  const [status, setStatus] = useState('Unsaved');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadForm(FORM_ID).then(existing => {
      if (existing) setData(d => ({ ...d, ...existing }));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const errs: string[] = [];
      if (!data.title.trim()) errs.push('Title required');
      if (!data.description.trim()) errs.push('Description required');
      if (!data.reporter.trim()) errs.push('Reporter required');
      if (!data.shiftCode.trim()) errs.push('Shift code required');
      setErrors(errs);
      saveForm(FORM_ID, data).then(() => setStatus('Saved locally'));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const update = (field: keyof Data, value: any) => {
    setData(d => ({ ...d, [field]: value }));
  };

  const canSubmit = errors.length === 0;

  const submit = () => {
    if (!canSubmit) return;
    alert('Submitted non-conformance: ' + JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Non-conformance Advice</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="label">Title</div>
          <input className="input" value={data.title} onChange={e => update('title', e.target.value)} />
        </div>
        <div>
          <div className="label">Description</div>
          <textarea className="input" rows={3} value={data.description} onChange={e => update('description', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="label">Severity</div>
            <select className="input" value={data.severity} onChange={e => update('severity', e.target.value as any)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">Reporter</div>
            <input className="input" value={data.reporter} onChange={e => update('reporter', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">Shift Code</div>
            <input className="input" value={data.shiftCode} onChange={e => update('shiftCode', e.target.value)} />
          </div>
        </div>
        <div>
          <div className="label">Suggested Corrective Action</div>
          <textarea className="input" rows={2} value={data.correctiveAction} onChange={e => update('correctiveAction', e.target.value)} />
        </div>
        <div>
          <div className="label">Attachments (photo / voice note)</div>
          <input type="file" multiple onChange={e => {
            const files = Array.from(e.target.files || []).map(f => f.name);
            update('attachments', [...data.attachments, ...files]);
          }} />
          {data.attachments.length > 0 && (
            <div style={{ marginTop: 4, fontSize: 12 }}>
              Attached: {data.attachments.join(', ')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {errors.length > 0 && (
              <div style={{ color: 'var(--color-red)', fontSize: 12 }}>
                {errors.join('; ')}
              </div>
            )}
            <div style={{ fontSize: 12 }}>Status: {status}</div>
          </div>
          <div>
            <button className="btn-positive" onClick={submit} disabled={!canSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
