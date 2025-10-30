import React from 'react';
import AccessFiles from './AccessFiles';
import VerifyAccess from './VerifyAccess';

export default function ReceiverDashboard(){
  return (
    <div>
      <h2>Receiver Dashboard</h2>
      <AccessFiles />
      <hr />
      <VerifyAccess />
    </div>
  );
}
