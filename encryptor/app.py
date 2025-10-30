from flask import Flask, request, jsonify
from encryption_core import process_and_encrypt
from decrypt_image import decrypt_image
import requests, json, os, traceback

app = Flask(__name__)

# 🔗 Node.js backend endpoint (for blockchain registration)
JS_BACKEND_URL = "http://localhost:3000/register"

# --- Encrypt and Upload to Pinata ---
@app.route("/encrypt", methods=["POST"])
def encrypt_route():
    """
    Encrypts an image, uploads to Pinata, and returns metadata.
    """
    try:
        data = request.get_json(force=True)
        image_path = data.get("image_path", "test_image.png")
        attributes = data.get("attributes", {"role": "doctor", "org": "HospitalX"})

        print(f"[ENCRYPT] Starting encryption for image: {image_path}")

        metadata = process_and_encrypt(image_path, attributes)

        if not metadata:
            return jsonify({"error": "Encryption or upload failed"}), 500

        metadata_path = "full_metadata_for_receiver.json"
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=4)

        return jsonify({
            "message": "Encryption + Pinata upload successful",
            "metadata_path": os.path.abspath(metadata_path),
            "metadata": metadata
        }), 200

    except Exception as e:
        print(f"[ENCRYPT ERROR] {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ---Decrypt and Reconstruct Image ---
@app.route("/decrypt", methods=["POST"])
def decrypt_route():
    """
    Decrypts image using metadata JSON and reconstructs the full image.
    """
    try:
        data = request.get_json(force=True)
        metadata_path = data.get("metadata_path", "full_metadata_for_receiver.json")
        output_image_path = data.get("output_path", "reconstructed_image.png")

        print(f"[DECRYPT] Starting decryption using metadata: {metadata_path}")

        decrypt_image(metadata_path, output_image_path)

        return jsonify({
            "message": "Decryption successful",
            "output_image_path": os.path.abspath(output_image_path)
        }), 200

    except Exception as e:
        print(f"[DECRYPT ERROR] {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ---Register Metadata on Blockchain (via Node.js backend) ---
@app.route("/register-on-chain", methods=["POST"])
def register_on_chain():
    """
    Sends image metadata to Node backend for blockchain registration.
    """
    try:
        data = request.get_json(force=True)
        metadata_path = data.get("metadata_path", "full_metadata_for_receiver.json")

        if not os.path.exists(metadata_path):
            return jsonify({"error": f"Metadata file not found: {metadata_path}"}), 404

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        print("[BLOCKCHAIN] Sending metadata for registration to JS backend...")

        response = requests.post(JS_BACKEND_URL, json={"metadata": metadata})
        backend_response = response.json() if response.status_code == 200 else response.text

        if response.status_code == 200:
            print("[BLOCKCHAIN] Metadata registered successfully on-chain ✅")
            return jsonify({
                "message": "Metadata successfully registered on blockchain",
                "blockchain_response": backend_response
            }), 200
        else:
            print(f"[BLOCKCHAIN ERROR] Node backend failed: {response.status_code}")
            return jsonify({
                "error": "Failed to register metadata on blockchain",
                "backend_status": response.status_code,
                "backend_response": backend_response
            }), 500

    except Exception as e:
        print(f"[BLOCKCHAIN ERROR] {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ---Root Route ---
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Secure Image Encryption–Blockchain API is running 🚀",
        "available_routes": {
            "POST /encrypt": "Encrypt image, upload to Pinata, generate metadata",
            "POST /decrypt": "Decrypt image from metadata and reconstruct",
            "POST /register-on-chain": "Register metadata to blockchain via JS backend"
        }
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
