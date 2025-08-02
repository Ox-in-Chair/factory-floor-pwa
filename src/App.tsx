import React, { Suspense, useState } from "react";
const CompanyHeader = React.lazy(() => import("./components/CompanyHeader"));
const ModuleTabs = React.lazy(() => import("./components/ModuleTabs"));

function App() {
  const [showTabs, setShowTabs] = useState(false);
  return (
    <div style={{ padding: 24, fontFamily: "Poppins, system-ui", color: "#0056A3", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 16 }}>
      <Suspense fallback={<div>Loading header...</div>}>
        <CompanyHeader />
      </Suspense>
      <div>
        <button onClick={() => setShowTabs(true)} style={{ marginBottom: 12 }}>
          {showTabs ? "Tabs Enabled" : "Enable Module Tabs"}
        </button>
      </div>
      {showTabs && (
        <Suspense fallback={<div>Loading modules...</div>}>
          <ModuleTabs />
        </Suspense>
      )}
      <div style={{ marginTop: "auto", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)" }}>
        Recovery branch: restore-modules — add back other pieces one at a time.
      </div>
    </div>
  );
}

export default App;
