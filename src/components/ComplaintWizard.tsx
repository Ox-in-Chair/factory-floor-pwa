import React, { useEffect, useState } from 'react';
import { saveForm, loadForm } from '../lib/db';

const FORM_ID = 'complaint-handling-v1';

type Data = {
  reference: string;
  category: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  contactMethod: string;
  followUpRequired: boolean;
  followUpNote: string;
  resolutionStatus: 'open' | 'in progress' | 'resolved';
};

export const ComplaintWizard: React.FC = () => {
  const [data, setData] = useState<Data>({
    reference: '',
    category: '',
    description: '',
    impact: 'Low',
    contactMethod: '',
    followUpRequired: false,
    followUpNote: '',
    resolutionStatus: 'open'
  });
  const [status, setStatus] = useState('Unsaved');

  useEffect(() => {
    loadForm(FORM_ID).then(existing => {
      if (existing) setData(d => ({ ...d, ...existing }));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveForm(FORM_ID, data).then(() => setStatus('Saved locally'));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const update = (field: keyof Data, value: any) => {
    setData(d => ({ ...d, [field]: value }));
  };

  const submit = () => {
    alert('Submitted complaint: ' + JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
  };

  return (
    <div className="card">
      <h2>Complaint Handling</h2>
      <div>
        <div className="label">Customer / Order Reference</div>
        <input className="input" value={data.reference} onChange={e => update('reference', e.target.value)} />
      </div>
      <div>
        <div className="label">Category</div>
        <input className="input" value={data.category} onChange={e => update('category', e.target.value)} />
      </div>
      <div>
        <div className="label">Description</div>
        <textarea className="input" value={data.description} onChange={e => update('description', e.target.value)} rows={2} />
      </div>
      <div>
        <div className="label">Impact Level</div>
        <select className="input" value={data.impact} onChange={e => update('impact', e.target.value as any)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div>
        <div className="label">Contact Method</div>
        <input className="input" value={data.contactMethod} onChange={e => update('contactMethod', e.target.value)} />
      </div>
      <div>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" checked={data.followUpRequired} onChange={e => update('followUpRequired', e.target.checked)} /> Follow-up required
        </label>
        {data.followUpRequired && (
          <div>
            <div className="label">Follow-up Note</div>
            <textarea className="input" value={data.followUpNote} onChange={e => update('followUpNote', e.target.value)} rows={2} />
          </div>
        )}
      </div>
      <div>
        <div className="label">Resolution Status</div>
        <select className="input" value={data.resolutionStatus} onChange={e => update('resolutionStatus', e.target.value as any)}>
          <option>open</option>
          <option>in progress</option>
          <option>resolved</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12 }}>Status: {status}</div>
        <button className="btn-positive" onClick={submit} style={{ marginTop: 6 }}>Submit</button>
      </div>
    </div>
  );
};
