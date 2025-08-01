import React, { useEffect, useState } from 'react';
import { saveForm, loadForm } from '../lib/db';

const FORM_ID = 'maintenance-jobcard-v1';

type Data = {
  equipmentId: string;
  issueDescription: string;
  urgency: 'Low' | 'Medium' | 'High';
  partsRequired: string;
  assignedTo: string;
  startTime: string;
  estimatedDuration: string;
  completionNotes: string;
};

export const MaintenanceJobCardWizard: React.FC = () => {
  const [data, setData] = useState<Data>({
    equipmentId: '',
    issueDescription: '',
    urgency: 'Low',
    partsRequired: '',
    assignedTo: '',
    startTime: '',
    estimatedDuration: '',
    completionNotes: ''
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
    alert('Submitted maintenance job card: ' + JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
  };

  return (
    <div className="card">
      <h2>Maintenance Job Card</h2>
      <div>
        <div className="label">Equipment ID</div>
        <input className="input" value={data.equipmentId} onChange={e => update('equipmentId', e.target.value)} />
      </div>
      <div>
        <div className="label">Issue Description</div>
        <textarea className="input" value={data.issueDescription} onChange={e => update('issueDescription', e.target.value)} rows={2} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="label">Urgency</div>
          <select className="input" value={data.urgency} onChange={e => update('urgency', e.target.value as any)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div className="label">Assigned To</div>
          <input className="input" value={data.assignedTo} onChange={e => update('assignedTo', e.target.value)} />
        </div>
      </div>
      <div>
        <div className="label">Parts Required</div>
        <input className="input" value={data.partsRequired} onChange={e => update('partsRequired', e.target.value)} />
      </div>
      <div>
        <div className="label">Start Time</div>
        <input className="input" type="datetime-local" value={data.startTime} onChange={e => update('startTime', e.target.value)} />
      </div>
      <div>
        <div className="label">Estimated Duration</div>
        <input className="input" value={data.estimatedDuration} onChange={e => update('estimatedDuration', e.target.value)} />
      </div>
      <div>
        <div className="label">Completion Notes</div>
        <textarea className="input" value={data.completionNotes} onChange={e => update('completionNotes', e.target.value)} rows={2} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12 }}>Status: {status}</div>
        <button className="btn-positive" onClick={submit} style={{ marginTop: 6 }}>Submit</button>
      </div>
    </div>
  );
};
