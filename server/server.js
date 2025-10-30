import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const { SEPOLIA_RPC, AMOY_RPC, PRIVATE_KEY, IMAGE_REGISTRY, ANCHOR_CONTRACT } = process.env;

// Log env check
console.log("Environment Check:");
console.log("PRIVATE_KEY:", PRIVATE_KEY ? "Loaded" : "Missing");
console.log("SEPOLIA_RPC:", SEPOLIA_RPC ? "Loaded" : "Missing");
console.log("AMOY_RPC:", AMOY_RPC ? "Loaded" : "Missing");
console.log("IMAGE_REGISTRY:", IMAGE_REGISTRY || "Missing");
console.log("ANCHOR_CONTRACT:", ANCHOR_CONTRACT || "Missing");

// Providers & Wallets
const providerSepolia = new ethers.JsonRpcProvider(SEPOLIA_RPC);
const providerAmoy = new ethers.JsonRpcProvider(AMOY_RPC);
const walletSepolia = new ethers.Wallet(PRIVATE_KEY, providerSepolia);
const walletAmoy = new ethers.Wallet(PRIVATE_KEY, providerAmoy);

// Load ABIs
const registryABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contracts/artifacts/src/ImageRegistry.sol/ImageRegistry.json"),
    "utf-8"
  )
).abi;

const anchorABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contracts/artifacts/src/Anchor.sol/Anchor.json"),
    "utf-8"
  )
).abi;

// Instantiate contracts
const registry = new ethers.Contract(IMAGE_REGISTRY, registryABI, walletSepolia);
const anchor = new ethers.Contract(ANCHOR_CONTRACT, anchorABI, walletAmoy);

// --- Register Metadata on Sepolia + Anchor on Amoy ---
app.post("/register", async (req, res) => {
  try {
    const metadata = req.body.metadata;
    if (!metadata) throw new Error("No metadata received from Flask backend.");

    const imageId = metadata.image_id;
    const ipfsHash = metadata.preview_cid; // From Pinata
    const encryptionKey = metadata.blocks[0].salt_hash;

    console.log(`🧩 Registering image metadata on Sepolia for ${imageId}`);

    // Upload image metadata to ImageRegistry (Sepolia)
    const tx = await registry.uploadImage(imageId, ipfsHash, encryptionKey);
    await tx.wait();
    console.log(`Metadata stored on Sepolia: ${tx.hash}`);

    // Compute metadata hash for anchoring
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));

    // Anchor hash on Amoy
    const tx2 = await anchor.anchorMetadata(imageId, metadataHash);
    await tx2.wait();
    console.log(`🔗 Anchored metadata hash on Amoy: ${tx2.hash}`);

    res.json({
      message: "Metadata registered and anchored successfully",
      sepoliaTx: tx.hash,
      amoyTx: tx2.hash,
      imageId: imageId,
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Verify Anchor ---
app.post("/verify-anchor", async (req, res) => {
  try {
    const { imageId, metadata } = req.body;
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
    const valid = await anchor.verifyAnchor(imageId, metadataHash);

    res.json({
      imageId,
      verified: valid,
      message: valid ? "Metadata hash matches anchor" : "Metadata hash mismatch",
    });
  } catch (err) {
    console.error("[VERIFY ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Root Endpoint ---
app.get("/", (req, res) => {
  res.json({
    message: "Blockchain Metadata Registry Backend is running 🚀",
    routes: {
      "POST /register": "Registers metadata on Sepolia + anchors hash on Amoy",
      "POST /verify-anchor": "Verifies metadata hash on Amoy",
    },
  });
});

// Start server
app.listen(3000, () => console.log("JS backend running on http://localhost:3000"));
