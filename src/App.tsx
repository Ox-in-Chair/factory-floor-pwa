import React, { useEffect } from 'react';
import { IncidentWizard } from './components/IncidentWizard';
import { hasLicence } from './lib/licence';
import { verifySession } from './lib/stripe';

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId && !hasLicence()) {
      verifySession(sessionId).then(granted => {
        if (granted) {
          window.history.replaceState({}, '', window.location.pathname);
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'Poppins, system-ui' }}>
      {!hasLicence() && (
        <div style={{ marginBottom: 16, border: '2px solid var(--color-green)', padding: 16, borderRadius: 8 }}>
          <h2 style={{ margin: 0, color: 'var(--color-blue)' }}>Licence required</h2>
          <p style={{ margin: '8px 0' }}>One-time .99 per supervisor. Works offline once activated.</p>
          <button className="btn-primary" onClick={() => { /* purchase flow kept if needed */ }}>
            Purchase Licence
          </button>
        </div>
      )}
      {hasLicence() && (
        <>
          <div style={{ marginTop: 8, color: 'var(--color-green)', fontWeight: 600 }}>
            Licensed (Supervisor: M)
          </div>
          <IncidentWizard />
        </>
      )}
    </div>
  );
}

export default App;
