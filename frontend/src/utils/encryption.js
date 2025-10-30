// Simple encryption/decryption using Web Crypto API (AES-GCM)
async function importKeyFromPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: salt,
    iterations: 100000,
    hash: 'SHA-256'
  }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt','decrypt']);
}

export async function encryptData(file, password){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKeyFromPassword(password, salt);
  const arrayBuffer = await file.arrayBuffer();
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, arrayBuffer);
  // return combined: salt + iv + cipher in a Blob
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + cipher.byteLength);
  combined.set(salt,0); combined.set(iv, salt.byteLength); combined.set(new Uint8Array(cipher), salt.byteLength + iv.byteLength);
  return new Blob([combined], { type: 'application/octet-stream' });
}

export async function decryptData(blob, password){
  const combined = new Uint8Array(await blob.arrayBuffer());
  const salt = combined.slice(0,16);
  const iv = combined.slice(16,28);
  const cipher = combined.slice(28);
  const key = await importKeyFromPassword(password, salt);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return new Blob([plain]);
}
