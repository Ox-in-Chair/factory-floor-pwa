/* src/components/ShiftHandoverWizard.tsx */
import React from "react";
import { FooterDocControl } from "./FooterDocControl";

export const ShiftHandoverWizard: React.FC = () => {
  return (
    <div className="module-container" aria-label="Shift handover">
      <h2>Shift-Change Handover Report</h2>
      <div style={{ flex: 1 }}>
        <p>Module content goes here (auto-save, attachments, etc.).</p>
      </div>
      <FooterDocControl />
    </div>
  );
};
