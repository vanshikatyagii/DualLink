"use client"

import { useState } from "react"
import axios from "axios"
import { FLASK_BASE } from "../api/constants.js"
import ImageCard from "../components/ImageCard.js"
import TxCard from "../components/TxCard.js"
import { readFileAsBase64 } from "../utils/fileHelpers.js"

export default function SharerPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [metadata, setMetadata] = useState(null)
  const [txHashes, setTxHashes] = useState(null)
  const [error, setError] = useState("")

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError("")
      try {
        const base64 = await readFileAsBase64(file)
        setPreview(base64)
      } catch (err) {
        setError("Failed to read file")
      }
    }
  }

  const handleEncryptAndUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Encrypting image...")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append(
        "attributes",
        JSON.stringify({
          role: "doctor",
          org: "HospitalX",
        }),
      )

      // Call Flask encrypt endpoint
      setStatus("Uploading to IPFS...")
      const response = await axios.post(`${FLASK_BASE}/encrypt`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setMetadata(response.data)
      setStatus("Encryption complete!")
      setSelectedFile(null)
      setPreview(null)
    } catch (err) {
      setError(err.response?.data?.error || "Encryption failed: " + err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterOnChain = async () => {
    if (!metadata) {
      setError("No metadata to register")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Registering on-chain...")

    try {
      const response = await axios.post(`${FLASK_BASE}/register-on-chain`, {
        metadata_path: JSON.stringify(metadata),
      })

      setTxHashes(response.data)
      setStatus("Registration complete!")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed: " + err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4">
      <h2 className="mb-4">Sharer Portal</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Step 1: Upload & Encrypt</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Select Image (.png, .jpg)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  disabled={loading}
                />
              </div>

              {preview && (
                <div className="mb-3">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}

              {status && (
                <div className="alert alert-info mb-3">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {status}
                </div>
              )}

              <button
                className="btn btn-primary w-100"
                onClick={handleEncryptAndUpload}
                disabled={!selectedFile || loading}
              >
                {loading ? "Processing..." : "Encrypt & Upload to IPFS"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">{metadata && <ImageCard metadata={metadata} />}</div>
      </div>

      {metadata && (
        <div className="row mt-4">
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Step 2: Register On-Chain</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">Register this encrypted image metadata on Sepolia and Amoy networks.</p>
                <button className="btn btn-success w-100" onClick={handleRegisterOnChain} disabled={loading}>
                  {loading ? "Registering..." : "Register on Blockchain"}
                </button>
              </div>
            </div>
          </div>

          {txHashes && (
            <div className="col-lg-6 mb-4">
              <TxCard txHashes={txHashes} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
