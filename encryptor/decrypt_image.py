import sys, os, json, requests
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from io import BytesIO
from base64 import b64decode, b64encode
from PIL import Image
from Crypto.Cipher import AES
from encryption_core import canonicalize, derive_adek  # shared logic

# --- 1. Decryption Helper ---

def decrypt_block(aek, nonce, tag, ciphertext):
    """Decrypts data using AES-256 GCM (Authenticated Encryption)."""
    try:
        cipher = AES.new(aek, AES.MODE_GCM, nonce=nonce)
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext
    except ValueError as e:
        print(f"[ERROR] Decryption failed: {e}")
        return None


# --- 2. Fetch from Pinata Gateway ---

def fetch_from_pinata(cid):
    """Fetches file bytes from Pinata’s public gateway."""
    try:
        url = f"https://gateway.pinata.cloud/ipfs/{cid}"
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except Exception as e:
        print(f"[ERROR] Failed to fetch CID {cid}: {e}")
        return None


# --- 3. Main Decryption & Reconstruction Logic ---

def decrypt_image(metadata_path, output_image_path="reconstructed_image.png"):
    print("\n--- Starting Decryption and Reconstruction ---")

    # Load metadata
    if not os.path.exists(metadata_path):
        print(f"[ERROR] Metadata file not found: {metadata_path}")
        print("Please run the encryption process first.")
        return

    with open(metadata_path, "r") as f:
        metadata = json.load(f)

    try:
        RAW_SALT_S = b64decode(metadata["raw_salt_S_b64"])
        block_meta = metadata["blocks"][0]
        block_id = block_meta["block_id"]
        private_cid = block_meta["cid"]
        attributes = block_meta["attrs"]
        encrypt_meta = block_meta["encrypt_meta"]

        tag_len = encrypt_meta["tag_len"]
        nonce = b64decode(encrypt_meta["nonce_b64"])
        width, height = encrypt_meta["dimensions"]
    except (KeyError, IndexError) as e:
        print(f"[ERROR] Malformed metadata: {e}")
        return

    # Re-derive key
    BLOCK_ID_BYTES = block_id.to_bytes(4, "big")
    adek = derive_adek(attributes, RAW_SALT_S, BLOCK_ID_BYTES)
    print(f"[INFO] Re-derived ADEK: {b64encode(adek).decode()[:12]}...")

    # Fetch encrypted and public blocks from Pinata
    public_data = fetch_from_pinata(metadata["preview_cid"])
    encrypted_data = fetch_from_pinata(private_cid)

    if not public_data or not encrypted_data:
        print("[ERROR] Failed to retrieve image data from Pinata.")
        return

    print(f"[INFO] Data fetched. Encrypted block size: {len(encrypted_data)} bytes")

    # Extract encryption components
    nonce_len = len(nonce)
    tag_start = nonce_len
    tag_end = nonce_len + tag_len

    retrieved_nonce = encrypted_data[:nonce_len]
    retrieved_tag = encrypted_data[tag_start:tag_end]
    retrieved_ciphertext = encrypted_data[tag_end:]

    if retrieved_nonce != nonce:
        print("[ERROR] Nonce mismatch – possible data corruption.")
        return

    # Decrypt the private block
    private_plaintext = decrypt_block(adek, retrieved_nonce, retrieved_tag, retrieved_ciphertext)
    if private_plaintext is None:
        print("[ERROR] Decryption failed. Exiting.")
        return

    # Reconstruct the full image
    public_block_img = Image.open(BytesIO(public_data)).convert("RGB")
    private_block_img = Image.open(BytesIO(private_plaintext)).convert("RGB")

    reconstructed_img = Image.new("RGB", (width, height))
    reconstructed_img.paste(public_block_img, (0, 0))
    reconstructed_img.paste(private_block_img, (width // 2, 0))
    reconstructed_img.save(output_image_path)

    print("\n SUCCESS: Image Reconstructed")
    print(f"   -> Saved as: {output_image_path}")
    print("   -> Source data fetched via Pinata IPFS Gateway.")


# --- 4. Script Entry Point ---

if __name__ == "__main__":
    metadata_file = "full_metadata_for_receiver.json"
    decrypt_image(metadata_file)
