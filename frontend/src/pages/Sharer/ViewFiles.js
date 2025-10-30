import React, { useState } from 'react';

export default function ViewFiles(){
  const [files] = useState([
    {cid:'baf...1', name:'doc.pdf.enc', sharedTo:'0xABC...'},
    {cid:'baf...2', name:'image.png.enc', sharedTo:'0xDEF...'}
  ]);

  return (
    <div className="card p-3">
      <h5>Your shared files</h5>
      <ul className="list-group">
        {files.map((f,i)=>(
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{f.name}</strong><br/>
              <small>CID: {f.cid}</small>
            </div>
            <span className="badge bg-primary">Shared</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
