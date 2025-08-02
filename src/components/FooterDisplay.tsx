import React from 'react';

export type FooterDocControlData = {
  documentNumber: string;
  documentName: string;
  revision: string;
  revisionDate: string;
  controlled: boolean;
  companyName?: string;
  logoBase64?: string;
};

export const FooterDisplay: React.FC<{ data: FooterDocControlData }> = ({ data }) => {
  return (
    <div className='footer'>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {data.logoBase64 && (
          <img
            src={data.logoBase64}
            alt='logo'
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(0,0,0,0.1)' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{data.companyName || 'Company'}</div>
        </div>
      </div>
      <div style={{ flex: '1 1 auto' }} />
      <div>
        <div className='label'>Document #</div>
        <div>{data.documentNumber}</div>
      </div>
      <div>
        <div className='label'>Name</div>
        <div>{data.documentName}</div>
      </div>
      <div>
        <div className='label'>Revision</div>
        <div>{data.revision}</div>
      </div>
      <div>
        <div className='label'>Rev Date</div>
        <div>{data.revisionDate}</div>
      </div>
      <div>
        <div className='label'>Controlled</div>
        <div>{data.controlled ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};
