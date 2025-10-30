import os, json, hashlib, requests
from io import BytesIO
from base64 import b64encode
from PIL import Image
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256
from dotenv import load_dotenv

load_dotenv()

# Load Pinata credentials
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")
PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

headers = {
    "pinata_api_key": PINATA_API_KEY,
    "pinata_secret_api_key": PINATA_SECRET_API_KEY,
}


#  Key Derivation + Canonicalization

def canonicalize(attrs: dict) -> bytes:
    """Deterministically serialize attributes for hashing."""
    items = sorted(attrs.items())
    s = ",".join(f"{k}:{v}" for k, v in items)
    return s.encode("utf-8")


def derive_adek(attrs: dict, salt: bytes, block_id: bytes) -> bytes:
    """Derive 256-bit ADEK key using HKDF-SHA256."""
    attr_bytes = canonicalize(attrs)
    seed = SHA256.new(attr_bytes + salt + block_id).digest()
    return HKDF(master=seed, key_len=32, salt=None, hashmod=SHA256, num_keys=1, context=b"ADEK-v1")



# AES-GCM Encryption Helper

def encrypt_block(aek, plaintext):
    nonce = os.urandom(12)
    cipher = AES.new(aek, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce, ciphertext, tag


#  Pinata Upload Helper

def upload_to_pinata(file_data: bytes, filename: str, mime_type: str = "application/octet-stream") -> str:
    """Uploads file to Pinata and returns CID."""
    files = {"file": (filename, file_data, mime_type)}
    response = requests.post(PINATA_URL, files=files, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Pinata upload failed: {response.text}")
    return response.json()["IpfsHash"]


#  Core Logic: Split + Encrypt + Upload + Metadata

def process_and_encrypt(image_path: str, attributes: dict, private_block_index: int = 1):
    # Load image
    img = Image.open(image_path).convert("RGB")
    width, height = img.size
    public_block = img.crop((0, 0, width // 2, height))
    private_block = img.crop((width // 2, 0, width, height))

    # Convert private block to bytes
    buf = BytesIO()
    private_block.save(buf, format="PNG")
    private_plaintext = buf.getvalue()

    # Generate salts and key
    salt_s = os.urandom(32)
    block_id = private_block_index.to_bytes(4, "big")
    adek = derive_adek(attributes, salt_s, block_id)

    # Encrypt private half
    nonce, ciphertext, tag = encrypt_block(adek, private_plaintext)
    encrypted_data = nonce + tag + ciphertext

    # Upload both halves to Pinata
    pub_buf = BytesIO()
    public_block.save(pub_buf, format="PNG")
    pub_buf.seek(0)

    print("[UPLOAD] Uploading to Pinata...")

    preview_cid = upload_to_pinata(pub_buf.getvalue(), "public_block.png", "image/png")
    private_cid = upload_to_pinata(encrypted_data, "private_block.bin")

    # Build metadata
    image_id = hashlib.sha256(os.urandom(16)).hexdigest()
    salt_hash = hashlib.sha256(salt_s).hexdigest()

    metadata = {
        "image_id": image_id,
        "preview_cid": preview_cid,
        "owner": "0xSharerAddress...",
        "raw_salt_S_b64": b64encode(salt_s).decode("utf-8"),
        "blocks": [
            {
                "block_id": private_block_index,
                "cid": private_cid,
                "attrs": attributes,
                "attrs_hash": SHA256.new(canonicalize(attributes)).hexdigest(),
                "salt_hash": salt_hash,
                "encrypt_meta": {
                    "nonce_b64": b64encode(nonce).decode("utf-8"),
                    "tag_len": len(tag),
                    "dimensions": [width, height],
                    "private_block_coords": [width // 2, 0, width, height],
                },
            }
        ],
    }

    # Save metadata files
    full_meta_file = f"full_metadata_for_receiver.json"
    on_chain_file = f"on_chain_metadata_{image_id}.json"

    with open(full_meta_file, "w") as f:
        json.dump(metadata, f, indent=4)

    on_chain_meta = metadata.copy()
    del on_chain_meta["raw_salt_S_b64"]
    with open(on_chain_file, "w") as f:
        json.dump(on_chain_meta, f, indent=4)

    print("Image encrypted and uploaded via Pinata")
    print("   -> Public CID:", preview_cid)
    print("   -> Private CID:", private_cid)
    print("   -> Metadata saved:", full_meta_file)

    return metadata
