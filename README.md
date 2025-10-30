# 🔐 DualLink: Blockchain-Based Secure Image Encryption

**DualLink** is a blockchain-integrated system that performs secure image encryption and decentralized storage using IPFS, while ensuring verifiable metadata integrity across two blockchains — **Ethereum Sepolia** and **Polygon Amoy**.

---

## ⚙️ What’s Implemented

✅ **AES-256-GCM image encryption and decryption** in Python  
✅ **IPFS decentralized storage** for encrypted image blocks  
✅ **Flask backend** to manage encryption, decryption, and blockchain interaction  
✅ **Node.js + Ethers.js backend** to handle smart contract transactions  
✅ **Smart contracts** for registry and anchoring:
- `AccessControl.sol` – manages access permissions  
- `ImageRegistry.sol` – stores image metadata on Sepolia  
- `Anchor.sol` – anchors metadata hash on Polygon Amoy  

✅ **Dual-chain verification**:
- Metadata stored on Ethereum (Sepolia)
- Metadata hash anchored on Polygon (Amoy)

✅ **End-to-end working pipeline** connecting:
`Encryption → IPFS Upload → Blockchain Registration → Hash Anchoring → Decryption`

---

## 🧠 How It Works

### 🔹 1. Image Encryption (Flask - Python)
- The system splits the input image into **two halves**:
  - **Public half** – left side (unencrypted)
  - **Private half** – right side (encrypted)
- The private half is encrypted using **AES-256-GCM** with a key derived from:
  - User-defined attributes (like `role` and `organization`)
  - A randomly generated salt
- Both halves are uploaded to **IPFS** (or Pinata).
- Metadata containing CIDs, attributes, and encryption details is generated.

---

### 🔹 2. Blockchain Registration (Node.js - Ethers.js)
- The Flask API sends the image metadata to the Node.js server.
- The Node backend:
  1. Stores the metadata on **Ethereum Sepolia** via `ImageRegistry.sol`
  2. Computes a metadata hash and anchors it on **Polygon Amoy** using `Anchor.sol`
- This creates a verifiable record of metadata integrity across chains.

---

### 🔹 3. Decryption and Reconstruction
- Using the metadata file and shared salt, the system re-derives the encryption key.
- The encrypted private half is fetched from IPFS and decrypted locally.
- The two halves are merged to reconstruct the original image.
- If needed, the anchored hash on Amoy can verify authenticity.

---

## 🔗 System Flow

Upload Image -> Split(Public + Private Halves) -> Encrypt Private Half (AES-256-GCM)->Upload Both to IPFS ->Store Metadata on Ethereum(Sepolia)-> Anchor Metadata Hash on Polygon (Amoy) -> Decrypt & Reconstruct Image


---

## 🧱 Components Overview

| Component | Description |
|------------|-------------|
| **`encryption_core.py`** | Handles encryption, IPFS upload, and metadata creation |
| **`decrypt_image.py`** | Fetches encrypted block, decrypts, and reconstructs image |
| **`app.py`** | Flask API for encryption, decryption, and blockchain registration |
| **`server.js`** | Node.js backend for Ethereum & Polygon communication |
| **Smart Contracts** | Solidity contracts deployed on testnets (Sepolia, Amoy) |

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Encryption** | Python (Flask, PyCryptodome, PIL) |
| **Storage** | Pinata |
| **Blockchain Integration** | Node.js, Express.js, Ethers.js |
| **Smart Contracts** | Solidity (Hardhat) |
| **Networks Used** | Ethereum Sepolia, Polygon Amoy |

---

## ⚡ Run Summary

### 🔹 Flask Backend
Handles image encryption/decryption and connects to blockchain bridge.  
Runs on: `http://127.0.0.1:5000`

### 🔹 Node.js Backend
Registers metadata and anchors hash on blockchain networks.  
Runs on: `http://localhost:3000`

---

## 🧾 Summary

**DualLink** demonstrates how blockchain can be used to **secure and verify digital content**.  
By combining **AES encryption**, **decentralized storage (IPFS)**, and **dual-chain anchoring**, it ensures:
- Image privacy and integrity  
- Metadata immutability  
- Cross-chain verification between Ethereum and Polygon

This forms a foundation for building **secure digital record systems**, **healthcare imaging platforms**, or **blockchain-based content verification tools**.

---
