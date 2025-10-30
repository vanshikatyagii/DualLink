import React, { useState } from 'react';
import { connectWallet } from '../../blockchain/wallet';
import { downloadFromIPFS } from '../../utils/ipfs';
import { decryptData } from '../../utils/encryption';

export default function AccessFiles(){
  const [cid, setCid] = useState('');
  const [status, setStatus] = useState('');

  async function handleFetch(){
    setStatus('Connecting wallet...');
    const w = await connectWallet();
    if(!w){ setStatus('No wallet'); return; }
    if(!cid){ setStatus('Enter CID'); return; }
    setStatus('Downloading encrypted...');
    const data = await downloadFromIPFS(cid);
    setStatus('Decrypting... (you will need the key the sharer provided)');
    const decrypted = await decryptData(data, prompt('Enter passphrase/key to decrypt:'));
    setStatus('Decrypted. (file blob available)');
    // Note: In a real app you'd create a blob URL and let user download/view
  }

  return (
    <div className="card p-3 mb-3">
      <h5>Access a shared file</h5>
      <input className="form-control my-2" value={cid} onChange={e=>setCid(e.target.value)} placeholder="Enter CID" />
      <button className="btn btn-primary" onClick={handleFetch}>Fetch</button>
      <div className="mt-2"><small>{status}</small></div>
    </div>
  );
}
