import hashlib
import os
import json
from base64 import b64encode
from PIL import Image
from io import BytesIO
import ipfshttpclient
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Protocol.KDF import HKDF


# --- 1. Core ADEK Derivation Functions ---

def canonicalize(attrs: dict) -> bytes:
    """Creates a deterministic, sorted string from attributes for hashing."""
    items = sorted(attrs.items())
    s = ",".join(f"{k}:{v}" for k, v in items)
    return s.encode('utf-8')


def derive_adek(attrs: dict, salt: bytes, block_id: bytes) -> bytes:
    """Derives a 256-bit ADEK using HKDF-SHA256."""
    attr_bytes = canonicalize(attrs)
    
    # KDF Seed: Hash of (attributes + salt + block_id)
    seed = SHA256.new(attr_bytes + salt + block_id).digest()
    
    # HKDF to derive a strong 32-byte (256-bit) key
    adek = HKDF(
        master=seed,
        key_len=32,
        salt=None,
        hashmod=SHA256,
        num_keys=1,
        context=b"ADEK-v1"
    )
    return adek


# --- 2. Encryption Function ---

def encrypt_block(aek, plaintext):
    """Encrypts data using AES-256 GCM."""
    nonce = os.urandom(12)
    cipher = AES.new(aek, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce, ciphertext, tag


# --- 3. Main Sharer Logic ---

def run_sharer_logic(image_path, private_block_index=1):
    print("--- Sharer: Starting Image Processing and Encryption ---")
    
    IMAGE_ID = hashlib.sha256(os.urandom(16)).hexdigest()
    SALT_S = os.urandom(32)  # Sharer’s private salt
    SALT_HASH = hashlib.sha256(SALT_S).hexdigest()  # This can go on-chain
    
    # 1. Image Partition (Simple vertical split)
    try:
        img = Image.open(image_path).convert('RGB')
    except FileNotFoundError:
        print(f" Error: Image not found at {image_path}")
        return None

    width, height = img.size
    
    public_block = img.crop((0, 0, width // 2, height))
    private_block = img.crop((width // 2, 0, width, height))

    buffer = BytesIO()
    private_block.save(buffer, format="PNG")
    private_plaintext = buffer.getvalue()
    
    # 2. ADEK Generation
    ATTRIBUTES = {"role": "doctor", "org": "HospitalX"}
    BLOCK_ID_BYTES = private_block_index.to_bytes(4, 'big')
    
    adek = derive_adek(ATTRIBUTES, SALT_S, BLOCK_ID_BYTES)
    print(f"Derived ADEK (32 bytes): {b64encode(adek).decode('utf-8')[:10]}...")
    
    # 3. Encryption
    nonce, ciphertext, tag = encrypt_block(adek, private_plaintext)
    
    # 4. Upload to IPFS
    try:
        client = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001/http') 
        
        # Upload Public Block
        preview_buffer = BytesIO()
        public_block.save(preview_buffer, format="PNG")
        preview_cid = client.add_bytes(preview_buffer.getvalue())
        
        # Upload Encrypted Private Block
        encrypted_data = nonce + tag + ciphertext
        private_cid = client.add_bytes(encrypted_data)
        
        print("\n Uploaded to IPFS")
        print(f"   -> Public Preview CID: {preview_cid}")
        print(f"   -> Encrypted Private CID: {private_cid}")
        
    except Exception as e:
        print(f"\n IPFS Error: {e}")
        print("   Make sure IPFS daemon is running (run `ipfs daemon` in a separate terminal).")
        return None
    
    # 5. Generate Metadata
    full_metadata = {
        "image_id": IMAGE_ID,
        "preview_cid": preview_cid,
        "owner": "0xSharerAddress...",
        "raw_salt_S_b64": b64encode(SALT_S).decode('utf-8'),
        "blocks": [
            {
                "block_id": private_block_index,
                "cid": private_cid,
                "attrs": ATTRIBUTES,
                "attrs_hash": SHA256.new(canonicalize(ATTRIBUTES)).hexdigest(),
                "salt_hash": SALT_HASH,
                "encrypt_meta": {
                    "nonce_b64": b64encode(nonce).decode('utf-8'),
                    "tag_len": len(tag),
                    "dimensions": [width, height],
                    "private_block_coords": [width // 2, 0, width, height]
                }
            }
        ]
    }
    
    # Save on-chain data (exclude raw salt)
    on_chain_data = full_metadata.copy()
    del on_chain_data["raw_salt_S_b64"]
    
    on_chain_file = f"on_chain_metadata_{IMAGE_ID}.json"
    with open(on_chain_file, "w") as f:
        json.dump(on_chain_data, f, indent=4)
    
    print(f"\n Metadata saved: {on_chain_file}")
    print(f"Image ID: {IMAGE_ID}")
    
    return full_metadata


# --- 6. Execution Entry Point ---

if __name__ == "__main__":
    test_image_path = "test_image.png"
    
    if not os.path.exists(test_image_path):
        print(f"Creating placeholder image: {test_image_path}")
        img = Image.new("RGB", (200, 100), color="red")
        for x in range(100, 200):
            for y in range(100):
                img.putpixel((x, y), (255, 255, 255))
        img.save(test_image_path)
        print("Placeholder image created successfully.")
    
    result_metadata = run_sharer_logic(test_image_path)
    
    if result_metadata:
        with open("full_metadata_for_receiver.json", "w") as f:
            json.dump(result_metadata, f, indent=4)
        print("\n Simulation complete.")
        print("   Full metadata (including raw salt) saved as 'full_metadata_for_receiver.json'.")
