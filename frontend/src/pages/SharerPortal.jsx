"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export default function SharerPortal() {
  const [selectedNetwork, setSelectedNetwork] = useState("sepolia")
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [encryptionStatus, setEncryptionStatus] = useState("idle")
  const [txHash, setTxHash] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setUploadStatus("idle")
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

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setUploadStatus("processing")

    try {
      // Simulate IPFS upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setUploadStatus("success")
    } catch (error) {
      setUploadStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const handleEncrypt = async () => {
    if (!selectedFile) return

    setLoading(true)
    setEncryptionStatus("processing")

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("http://127.0.0.1:5000/encrypt", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Encryption failed")

      const data = await response.json()
      setTxHash(data.tx_hash || "0x8f3a2...7b4c")
      setEncryptionStatus("success")
    } catch (error) {
      console.error("Encryption error:", error)
      setEncryptionStatus("error")
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
          <span className="ms-auto badge badge-sepolia">Sharer Portal</span>
        </div>
      </nav>

      <main className="py-5">
        <div className="container-lg">
          {/* Network Selection */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Select Network</h5>
              <small className="text-muted">Choose the blockchain network for encryption</small>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-6">
                  <button
                    className={`btn w-100 ${selectedNetwork === "sepolia" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedNetwork("sepolia")}
                  >
                    <i className="bi bi-circle-fill me-2"></i>
                    Sepolia Testnet
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className={`btn w-100 ${selectedNetwork === "amoy" ? "btn-primary-amoy" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedNetwork("amoy")}
                  >
                    <i className="bi bi-circle-fill me-2"></i>
                    Amoy Testnet
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Upload Section */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Upload Image</h5>
                  <small className="text-muted">Select an image file to encrypt and store</small>
                </div>
                <div className="card-body">
                  <div
                    className={`upload-area ${dragOver ? "dragover" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <div className="upload-icon">
                      <i className="bi bi-cloud-arrow-up"></i>
                    </div>
                    <p className="mb-1 fw-medium">Drop your image here or click to browse</p>
                    <small className="text-muted">PNG, JPG, GIF up to 10MB</small>
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />

                  {selectedFile && (
                    <div className="mt-3 p-3 border rounded d-flex align-items-center gap-2">
                      <i className="bi bi-image text-muted"></i>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium">{selectedFile.name}</p>
                        <small className="text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
                      </div>
                      {uploadStatus === "success" && <i className="bi bi-check-circle-fill text-success"></i>}
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-arrow-up me-2"></i>
                        Upload to IPFS
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Encryption Section */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Encryption Status</h5>
                  <small className="text-muted">Monitor your encryption process</small>
                </div>
                <div className="card-body">
                  <div className="status-item">
                    <i className="bi bi-lock status-icon"></i>
                    <div className="status-content">
                      <div className="status-label">Encryption Key Generated</div>
                    </div>
                    <span className="badge badge-success">Complete</span>
                  </div>

                  <div className="status-item">
                    <i className="bi bi-image status-icon"></i>
                    <div className="status-content">
                      <div className="status-label">Image Processing</div>
                    </div>
                    {encryptionStatus === "processing" ? (
                      <span className="badge bg-info">
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        In Progress
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                  </div>

                  <div className="status-item">
                    <i className="bi bi-unlock status-icon"></i>
                    <div className="status-content">
                      <div className="status-label">Blockchain Transaction</div>
                    </div>
                    {encryptionStatus === "success" ? (
                      <span className="badge badge-success">Confirmed</span>
                    ) : (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                  </div>

                  {txHash && (
                    <div className="mt-3 p-3 border rounded">
                      <small className="text-muted d-block mb-2 text-uppercase fw-bold">Transaction Hash</small>
                      <div className="d-flex align-items-center gap-2">
                        <code className="tx-hash flex-grow-1">{txHash}</code>
                        <button
                          className="btn btn-sm btn-outline-secondary copy-btn"
                          onClick={() => copyToClipboard(txHash)}
                          title="Copy to clipboard"
                        >
                          <i className="bi bi-clipboard"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handleEncrypt}
                    disabled={!selectedFile || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock me-2"></i>
                        Start Encryption
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
              <small className="text-muted">Your latest encryption operations</small>
            </div>
            <div className="card-body">
              {[
                { name: "document-scan.png", status: "success", network: "sepolia", time: "2 mins ago" },
                { name: "profile-photo.jpg", status: "success", network: "amoy", time: "15 mins ago" },
                { name: "contract-proof.png", status: "error", network: "sepolia", time: "1 hour ago" },
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
                    {item.status === "success" ? (
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
