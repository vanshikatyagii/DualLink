import React from 'react';
import UploadFile from './UploadFile';
import ViewFiles from './ViewFiles';

export default function SharerDashboard(){
  return (
    <div>
      <h2>Sharer Dashboard</h2>
      <UploadFile />
      <hr />
      <ViewFiles />
    </div>
  );
}
