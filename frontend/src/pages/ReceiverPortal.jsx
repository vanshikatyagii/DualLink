"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export default function ReceiverPortal() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [decryptedImage, setDecryptedImage] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState("idle")
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type === "application/json") {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setMetadata(data)
        } catch (error) {
          console.error("Invalid JSON:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDecrypt = async () => {
    if (!metadata) return

    setLoading(true)
    setVerificationStatus("processing")

    try {
      const response = await fetch("http://127.0.0.1:5000/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) throw new Error("Decryption failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDecryptedImage(url)
      setVerificationStatus("success")
    } catch (error) {
      console.error("Decryption error:", error)
      setVerificationStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!metadata) return

    setLoading(true)
    setVerificationStatus("processing")

    try {
      const response = await fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_hash: metadata.tx_hash,
          network: metadata.network,
        }),
      })

      if (!response.ok) throw new Error("Verification failed")

      setVerificationStatus("success")
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-lg">
          <Link to="/" className="navbar-brand">
            <i className="bi bi-lock-fill"></i>
            DualLink
          </Link>
          <span className="ms-auto badge" style={{ backgroundColor: "var(--color-amoy)" }}>
            Receiver Portal
          </span>
        </div>
      </nav>

      <main className="py-5">
        <div className="container-lg">
          <div className="row g-4">
            {/* Metadata Upload */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Upload Metadata</h5>
                  <small className="text-muted">Upload the metadata JSON file to decrypt</small>
                </div>
                <div className="card-body">
                  <div
                    className={`upload-area ${dragOver ? "dragover" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("metadataInput").click()}
                  >
                    <div className="upload-icon">
                      <i className="bi bi-file-earmark-json"></i>
                    </div>
                    <p className="mb-1 fw-medium">Drop metadata JSON here or click to browse</p>
                    <small className="text-muted">JSON files only</small>
                  </div>
                  <input
                    id="metadataInput"
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />

                  {selectedFile && (
                    <div className="mt-3 p-3 border rounded d-flex align-items-center gap-2">
                      <i className="bi bi-file-earmark-json text-muted"></i>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium">{selectedFile.name}</p>
                        <small className="text-muted">{(selectedFile.size / 1024).toFixed(2)} KB</small>
                      </div>
                      {metadata && <i className="bi bi-check-circle-fill text-success"></i>}
                    </div>
                  )}

                  {metadata && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2 text-uppercase fw-bold">Metadata Preview</small>
                      <div className="metadata-preview">{JSON.stringify(metadata, null, 2)}</div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handleDecrypt}
                    disabled={!metadata || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Decrypting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-unlock me-2"></i>
                        Decrypt Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Verification & Decrypted Image */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Verification & Decryption</h5>
                  <small className="text-muted">Verify blockchain anchor and view decrypted image</small>
                </div>
                <div className="card-body">
                  <div className="status-item">
                    <i className="bi bi-shield-check status-icon"></i>
                    <div className="status-content">
                      <div className="status-label">Blockchain Verification</div>
                    </div>
                    {verificationStatus === "success" ? (
                      <span className="badge badge-success">Verified</span>
                    ) : verificationStatus === "processing" ? (
                      <span className="badge bg-info">
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Verifying
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                  </div>

                  {metadata && (
                    <>
                      <div className="mt-3 p-3 border rounded">
                        <small className="text-muted d-block mb-2 text-uppercase fw-bold">Transaction Hash</small>
                        <div className="d-flex align-items-center gap-2">
                          <code className="tx-hash flex-grow-1">{metadata.tx_hash || "N/A"}</code>
                          <button
                            className="btn btn-sm btn-outline-secondary copy-btn"
                            onClick={() => copyToClipboard(metadata.tx_hash)}
                            title="Copy to clipboard"
                          >
                            <i className="bi bi-clipboard"></i>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 p-3 border rounded">
                        <small className="text-muted d-block mb-2 text-uppercase fw-bold">Network</small>
                        <span className={`badge ${metadata.network === "sepolia" ? "badge-sepolia" : "badge-amoy"}`}>
                          {metadata.network === "sepolia" ? "Sepolia Testnet" : "Amoy Testnet"}
                        </span>
                      </div>
                    </>
                  )}

                  {decryptedImage && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2 text-uppercase fw-bold">Decrypted Image</small>
                      <img src={decryptedImage || "/placeholder.svg"} alt="Decrypted" className="decrypted-image" />
                    </div>
                  )}

                  <button className="btn btn-primary w-100 mt-3" onClick={handleVerify} disabled={!metadata || loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check me-2"></i>
                        Verify on Blockchain
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Recent Verifications</h5>
              <small className="text-muted">Your latest decryption and verification operations</small>
            </div>
            <div className="card-body">
              {[
                { name: "document-scan.png", status: "verified", network: "sepolia", time: "5 mins ago" },
                { name: "profile-photo.jpg", status: "verified", network: "amoy", time: "20 mins ago" },
                { name: "contract-proof.png", status: "failed", network: "sepolia", time: "2 hours ago" },
              ].map((item, i) => (
                <div key={i} className="activity-item">
                  <i className="bi bi-image activity-icon"></i>
                  <div className="activity-info">
                    <div className="activity-name">{item.name}</div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                  <div className="activity-actions">
                    <span className={`badge ${item.network === "sepolia" ? "badge-sepolia" : "badge-amoy"}`}>
                      {item.network === "sepolia" ? "Sepolia" : "Amoy"}
                    </span>
                    {item.status === "verified" ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-danger"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
