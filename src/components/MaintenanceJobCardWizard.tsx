/* src/components/MaintenanceJobCardWizard.tsx */
import React from "react";
import { FooterDocControl } from "./FooterDocControl";

export const MaintenanceJobCardWizard: React.FC = () => {
  return (
    <div className="module-container" aria-label="Maintenance job card">
      <h2>Maintenance Job Card</h2>
      <div style={{ flex: 1 }}>
        <p>Module content goes here.</p>
      </div>
      <FooterDocControl />
    </div>
  );
};
