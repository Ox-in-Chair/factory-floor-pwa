/* src/components/NonConformanceWizard.tsx */
import React from "react";
import { FooterDocControl } from "./FooterDocControl";

export const NonConformanceWizard: React.FC = () => {
  return (
    <div className="module-container" aria-label="Non-conformance advice">
      <h2>Non-conformance Advice</h2>
      <div style={{ flex: 1 }}>
        <p>Module content goes here (auto-save, validation, etc.).</p>
      </div>
      <FooterDocControl />
    </div>
  );
};
