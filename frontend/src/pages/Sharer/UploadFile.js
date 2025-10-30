import React, { useState } from 'react';
import { connectWallet } from '../../blockchain/wallet';
import { uploadToIPFS } from '../../utils/ipfs';
import { encryptData } from '../../utils/encryption';

export default function UploadFile(){
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  async function handleUpload(){
    setStatus('Connecting wallet...');
    const w = await connectWallet();
    if(!w){ setStatus('No wallet found'); return; }

    if(!file){ setStatus('Select a file first'); return; }
    setStatus('Encrypting file...');
    const key = 'passphrase-' + Date.now();
    const encrypted = await encryptData(file, key);
    setStatus('Uploading to IPFS...');
    const cid = await uploadToIPFS(encrypted, file.name + '.enc');
    setStatus('Uploaded. CID: ' + cid + '. (Pretend contract tx sent)');
  }

  return (
    <div className="card p-3 mb-3">
      <h5>Upload & Share File</h5>
      <input className="form-control my-2" type="file" onChange={e=>setFile(e.target.files[0])} />
      <button className="btn btn-success" onClick={handleUpload}>Upload</button>
      <div className="mt-2"><small>{status}</small></div>
    </div>
  );
}
