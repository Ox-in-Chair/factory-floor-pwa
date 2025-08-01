import React, { useEffect, useState } from 'react';
import { saveForm, loadForm } from '../lib/db';

const FORM_ID = 'shift-handover-v1';

type Data = {
  outgoingSummary: string;
  criticalIssues: string;
  pendingMaintenance: string;
  productionCount: number | '';
  safetyNotes: string;
  incomingAcknowledgement: string;
};

export const ShiftHandoverWizard: React.FC = () => {
  const [data, setData] = useState<Data>({
    outgoingSummary: '',
    criticalIssues: '',
    pendingMaintenance: '',
    productionCount: '',
    safetyNotes: '',
    incomingAcknowledgement: ''
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
    alert('Submitted handover: ' + JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
  };

  return (
    <div className="card">
      <h2>Shift-Change Handover Report</h2>
      <div>
        <div className="label">Outgoing Summary</div>
        <textarea className="input" value={data.outgoingSummary} onChange={e => update('outgoingSummary', e.target.value)} rows={2} />
      </div>
      <div>
        <div className="label">Critical Issues</div>
        <textarea className="input" value={data.criticalIssues} onChange={e => update('criticalIssues', e.target.value)} rows={2} />
      </div>
      <div>
        <div className="label">Pending Maintenance</div>
        <textarea className="input" value={data.pendingMaintenance} onChange={e => update('pendingMaintenance', e.target.value)} rows={2} />
      </div>
      <div>
        <div className="label">Production Count</div>
        <input type="number" className="input" value={data.productionCount as any} onChange={e => update('productionCount', e.target.value ? Number(e.target.value) : '')} />
      </div>
      <div>
        <div className="label">Safety Notes</div>
        <textarea className="input" value={data.safetyNotes} onChange={e => update('safetyNotes', e.target.value)} rows={2} />
      </div>
      <div>
        <div className="label">Incoming Acknowledgement</div>
        <input className="input" value={data.incomingAcknowledgement} onChange={e => update('incomingAcknowledgement', e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12 }}>Status: {status}</div>
        <button className="btn-positive" onClick={submit} style={{ marginTop: 6 }}>Submit</button>
      </div>
    </div>
  );
};
