import React, { useState } from 'react';
import { ShiftHandoverWizard } from './ShiftHandoverWizard';
import { NonConformanceWizard } from './NonConformanceWizard';
import { MaintenanceJobCardWizard } from './MaintenanceJobCardWizard';
import { ComplaintWizard } from './ComplaintWizard';

const TABS = [
  { key: 'handover', label: 'Shift Handover', Component: ShiftHandoverWizard },
  { key: 'nonconformity', label: 'Non-conformance Advice', Component: NonConformanceWizard },
  { key: 'maintenance', label: 'Maintenance Job Card', Component: MaintenanceJobCardWizard },
  { key: 'complaint', label: 'Complaint Handling', Component: ComplaintWizard },
];

export const ModuleTabs: React.FC = () => {
  const [active, setActive] = useState<string>('handover');
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: active === t.key ? 'var(--color-blue)' : 'transparent',
              color: active === t.key ? '#fff' : 'var(--color-black)',
              border: active === t.key ? 'none' : '1px solid rgba(0,0,0,0.1)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {TABS.map(t => {
          if (t.key !== active) return null;
          const Component = t.Component;
          return (
            <div key={t.key}>
              <Component />
            </div>
          );
        })}
      </div>
    </div>
  );
};
