import React, { Suspense, useState } from "react";
import "./index.css"; // keep basic styles
import "./global-theme.css";
const CompanyHeader = React.lazy(() => import("./components/CompanyHeader"));
const ModuleTabs = React.lazy(() => import("./components/ModuleTabs"));
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  const [showTabs, setShowTabs] = useState(false);
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Poppins, system-ui",
        color: "#0056A3",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<div>Loading header...</div>}>
          <CompanyHeader />
        </Suspense>
      </ErrorBoundary>
      <div>
        <button
          onClick={() => setShowTabs(s => !s)}
          style={{ marginBottom: 12 }}
          aria-pressed={showTabs}
        >
          {showTabs ? "Hide Module Tabs" : "Enable Module Tabs"}
        </button>
      </div>
      {showTabs && (
        <ErrorBoundary>
          <Suspense fallback={<div>Loading module tabs...</div>}>
            <ModuleTabs />
          </Suspense>
        </ErrorBoundary>
      )}
      <div style={{ marginTop: "auto", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)" }}>
        Recovery branch: restore-modules — bring back additional pieces one at a time.
      </div>
    </div>
  );
}

export default App;
