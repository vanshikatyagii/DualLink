"use client"

import { useState } from "react"
import axios from "axios"
import { FLASK_BASE, NODE_BASE } from "../api/constants.js"
import { readFileAsText } from "../utils/fileHelpers.js"

export default function ReceiverPage() {
  const [metadataFile, setMetadataFile] = useState(null)
  const [metadataContent, setMetadataContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [decryptedImage, setDecryptedImage] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [error, setError] = useState("")

  const handleMetadataSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setMetadataFile(file)
      setError("")
      try {
        const content = await readFileAsText(file)
        setMetadataContent(JSON.parse(content))
      } catch (err) {
        setError("Failed to parse metadata JSON: " + err.message)
      }
    }
  }

  const handleDecrypt = async () => {
    if (!metadataContent) {
      setError("Please upload metadata file")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Decrypting image...")

    try {
      const response = await axios.post(`${FLASK_BASE}/decrypt`, {
        metadata_path: JSON.stringify(metadataContent),
      })

      // Handle base64 or URL response
      if (response.data.image_data) {
        setDecryptedImage(response.data.image_data)
      } else if (response.data.image_url) {
        setDecryptedImage(response.data.image_url)
      }
      setStatus("Decryption complete!")
    } catch (err) {
      setError(err.response?.data?.error || "Decryption failed: " + err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAnchor = async () => {
    if (!metadataContent) {
      setError("No metadata to verify")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Verifying anchor...")

    try {
      const response = await axios.post(`${NODE_BASE}/verify-anchor`, {
        imageId: metadataContent.imageId,
        metadata: metadataContent,
      })

      setVerificationResult(response.data)
      setStatus("Verification complete!")
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed: " + err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadImage = () => {
    if (!decryptedImage) return

    const link = document.createElement("a")
    link.href = decryptedImage.startsWith("data:") ? decryptedImage : `data:image/png;base64,${decryptedImage}`
    link.download = "decrypted-image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="py-4">
      <h2 className="mb-4">Receiver Portal</h2>

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
              <h5 className="mb-0">Step 1: Upload Metadata</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Select Metadata JSON File</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".json"
                  onChange={handleMetadataSelect}
                  disabled={loading}
                />
              </div>

              {metadataContent && (
                <div className="alert alert-info mb-3">
                  <small>
                    <strong>Image ID:</strong> {metadataContent.imageId || "N/A"}
                    <br />
                    <strong>Preview CID:</strong> {metadataContent.preview_cid?.substring(0, 20)}...
                    <br />
                    <strong>Timestamp:</strong> {metadataContent.timestamp || "N/A"}
                  </small>
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

              <button className="btn btn-primary w-100" onClick={handleDecrypt} disabled={!metadataContent || loading}>
                {loading ? "Decrypting..." : "Decrypt Image"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          {decryptedImage && (
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Decrypted Image</h5>
              </div>
              <div className="card-body text-center">
                <img
                  src={decryptedImage.startsWith("data:") ? decryptedImage : `data:image/png;base64,${decryptedImage}`}
                  alt="Decrypted"
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "300px" }}
                />
                <button className="btn btn-success w-100" onClick={handleDownloadImage}>
                  Download Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {metadataContent && (
        <div className="row mt-4">
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">Step 2: Verify Anchor (Optional)</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">Verify the on-chain anchor for this image.</p>
                <button className="btn btn-warning w-100" onClick={handleVerifyAnchor} disabled={loading}>
                  {loading ? "Verifying..." : "Verify Anchor"}
                </button>
              </div>
            </div>
          </div>

          {verificationResult && (
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">Verification Result</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span className={`badge ${verificationResult.valid ? "bg-success" : "bg-danger"}`}>
                      {verificationResult.valid ? "Valid" : "Mismatch"}
                    </span>
                  </div>
                  <small className="text-muted">
                    <strong>Status:</strong> {verificationResult.status || "N/A"}
                    <br />
                    {verificationResult.details && (
                      <>
                        <strong>Details:</strong> {JSON.stringify(verificationResult.details)}
                        <br />
                      </>
                    )}
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
