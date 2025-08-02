/* src/components/ComplaintWizard.tsx */
import React from "react";
import { FooterDocControl } from "./FooterDocControl";

export const ComplaintWizard: React.FC = () => {
  return (
    <div className="module-container" aria-label="Complaint handling">
      <h2>Complaint Handling</h2>
      <div style={{ flex: 1 }}>
        <p>Module content goes here.</p>
      </div>
      <FooterDocControl />
    </div>
  );
};
