# full_ui_bootstrap_fixed.ps1 - apply UI branding, PWA config, corrected components, and stub logic

# Ensure directories
New-Item -ItemType Directory -Force src\lib, src\components | Out-Null

# 1. vite.config.ts with PWA plugin
$viteConfig = @"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Factory Floor PWA',
        short_name: 'FloorPWA',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0056A3',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
"@
$viteConfig | Set-Content -Encoding UTF8 vite.config.ts

# 2. index.html branding injection
$indexPath = 'index.html'
if (Test-Path $indexPath) {
    $html = Get-Content $indexPath -Raw
    $snippet = @'
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
<meta name="theme-color" content="#0056A3" />
'@
    if ($html -notmatch '<meta name="theme-color" content="#0056A3" />') {
        $newHtml = $html -replace '(?i)(<head[^>]*>)', '$1' + "`n    " + $snippet.Trim()
        Set-Content -Encoding UTF8 $indexPath $newHtml
    }
}

# 3. src/index.css with palette and base
$indexCss = @"
:root {
  --color-blue: #0056A3;
  --color-green: #00722D;
  --color-yellow: #FFB81C;
  --color-red: #D62718;
  --color-black: #000000;
  --color-bg: #ffffff;
  --radius: 8px;
  --shadow: 0 6px 18px rgba(0,0,0,0.08);
  --transition: 0.15s ease-out;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
body { background: var(--color-bg); color: var(--color-black); font-family: inherit; margin:0; line-height:1.4; -webkit-font-smoothing:antialiased; }
h1,h2,h3{ margin:0 0 .5rem 0; font-weight:600; }
button{ font-family:inherit; cursor:pointer; border:none; padding:.75rem 1rem; border-radius:var(--radius); transition:var(--transition); font-weight:600; }
.btn-primary{ background:var(--color-blue); color:white; }
.btn-positive{ background:var(--color-green); color:white; }
.btn-warning{ background:var(--color-yellow); color:black; }
.btn-danger{ background:var(--color-red); color:white; }
.card{ background:white; border-radius:var(--radius); box-shadow:var(--shadow); padding:1rem; margin-bottom:1rem; }
.input{ width:100%; padding:.6rem; border:1px solid #ccc; border-radius:4px; font-size:1rem; font-family:inherit; margin-top:4px; box-sizing:border-box; }
.input:focus{ outline:2px solid var(--color-blue); }
.label{ display:block; font-size:.75rem; font-weight:500; letter-spacing:.5px; text-transform:uppercase; margin-bottom:4px; color:rgba(0,0,0,.85); }
.badge{ display:inline-block; padding:2px 8px; border-radius:12px; font-size:.65rem; font-weight:600; }
"@
$indexCss | Set-Content -Encoding UTF8 src\index.css

# 4. src/main.tsx with ErrorBoundary wrapping
$mainTsx = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
"@
$mainTsx | Set-Content -Encoding UTF8 src\main.tsx

# 5. ErrorBoundary component
$errorBoundary = @"
import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.toString() };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: '#ffe6e6', borderRadius: 8 }}>
          <h2 style={{ color: '#D62718' }}>Something went wrong</h2>
          <div>{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
"@
$errorBoundary | Set-Content -Encoding UTF8 src\components\ErrorBoundary.tsx

# 6. src/lib/db.ts
$db = @"
import { openDB } from 'idb';

const DB_NAME = 'factory-floor';
const STORE_LOG = 'wal';
const STORE_FORMS = 'forms';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_LOG)) {
        db.createObjectStore(STORE_LOG, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_FORMS)) {
        db.createObjectStore(STORE_FORMS, { keyPath: 'formId' });
      }
    }
  });
}

export async function appendLog(entry: any) {
  const db = await getDb();
  await db.add(STORE_LOG, { ...entry, timestamp: Date.now() });
}

export async function saveForm(formId: string, data: any) {
  const db = await getDb();
  await db.put(STORE_FORMS, { formId, data, updatedAt: Date.now() });
  await appendLog({ type: 'form-save', formId, data });
}

export async function loadForm(formId: string) {
  const db = await getDb();
  const rec = await db.get(STORE_FORMS, formId);
  return rec?.data || null;
}
"@
$db | Set-Content -Encoding UTF8 src\lib/db.ts

# 7. src/lib/licence.ts
$licence = @"
const LICENCE_KEY = 'paid_license_token';

export function hasLicence(): boolean {
  return !!localStorage.getItem(LICENCE_KEY);
}

export function grantMockLicence() {
  const token = JSON.stringify({
    device: 'mock-device-id',
    purchasedAt: new Date().toISOString(),
    signature: 'mock-signature'
  });
  localStorage.setItem(LICENCE_KEY, token);
}

export function getLicence() {
  return localStorage.getItem(LICENCE_KEY);
}
"@
$licence | Set-Content -Encoding UTF8 src\lib/licence.ts

# 8. src/components/IncidentWizard.tsx
$wizard = @"
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
"@
$wizard | Set-Content -Encoding UTF8 src\components\IncidentWizard.tsx

# 9. src/App.tsx with licence gate
$app = @"
import React from 'react';
import { IncidentWizard } from './components/IncidentWizard';
import { hasLicence, grantMockLicence } from './lib/licence';
import './index.css';

function App() {
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'Poppins, system-ui' }}>
      {!hasLicence() && (
        <div style={{ marginBottom: 16, border: '2px solid var(--color-green)', padding: 16, borderRadius: 8 }}>
          <h2 style={{ margin: 0, color: 'var(--color-blue)' }}>Licence required</h2>
          <p style={{ margin: '8px 0' }}>One-time $9.99 per supervisor. Works offline once activated.</p>
          <button className="btn-primary" onClick={() => { grantMockLicence(); window.location.reload(); }}>Grant mock licence</button>
        </div>
      )}
      {hasLicence() && <IncidentWizard />}
    </div>
  );
}

export default App;
"@
$app | Set-Content -Encoding UTF8 src\App.tsx

Write-Output "Bootstrap fixed complete. Run: npm install vite-plugin-pwa idb; npm run dev; npm run lint; then commit and push."
