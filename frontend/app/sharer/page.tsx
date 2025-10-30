"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import Link from "next/link"
import { ArrowLeft, Upload, Lock, CheckCircle2, XCircle, Loader2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageCard from "@/components/image-card"
import TxCard from "@/components/tx-card"

type Status = "idle" | "encrypting" | "uploading" | "registering" | "success" | "error"

interface EncryptionResult {
  imageId: string
  preview_cid: string
  private_cid: string
  encryption_key: string
  metadata_path: string
}

interface BlockchainResult {
  sepolia_tx: string
  amoy_tx: string
  timestamp: string
}

export default function SharerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null)
  const [blockchainResult, setBlockchainResult] = useState<BlockchainResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attributes, setAttributes] = useState({ role: "doctor", org: "HospitalX" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && ["image/png", "image/jpeg", "image/gif"].includes(selectedFile.type)) {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid image file (PNG, JPG, GIF)")
    }
  }

  const handleEncrypt = async () => {
    if (!file) return

    setStatus("encrypting")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image_path", file.name)
      formData.append("attributes", JSON.stringify(attributes))

      const response = await axios.post("http://127.0.0.1:5000/encrypt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setEncryptionResult(response.data)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed")
      setStatus("error")
    }
  }

  const handleRegisterOnChain = async () => {
    if (!encryptionResult) return

    setStatus("registering")
    setError(null)

    try {
      const response = await axios.post("http://127.0.0.1:5000/register-on-chain", {
        metadata_path: encryptionResult.metadata_path,
      })

      setBlockchainResult(response.data)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      setStatus("error")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Sharer Portal</h1>
          <p className="text-slate-600">Encrypt and register images on blockchain</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image to encrypt and store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-900">Drop your image here or click to browse</p>
                  <p className="text-sm text-slate-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {file && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Attributes</label>
                <input
                  type="text"
                  placeholder="Role (e.g., doctor)"
                  value={attributes.role}
                  onChange={(e) => setAttributes({ ...attributes, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Organization (e.g., HospitalX)"
                  value={attributes.org}
                  onChange={(e) => setAttributes({ ...attributes, org: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <Button
                onClick={handleEncrypt}
                disabled={!file || status === "encrypting"}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {status === "encrypting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Encrypt Image
                  </>
                )}
              </Button>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {encryptionResult && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Encryption Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Image ID</p>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 font-mono text-sm text-slate-900">
                      {encryptionResult.imageId}
                      <button
                        onClick={() => copyToClipboard(encryptionResult.imageId)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <ImageCard cid={encryptionResult.preview_cid} label="Preview CID" />
                  <ImageCard cid={encryptionResult.private_cid} label="Private CID" />
                </CardContent>
              </Card>
            )}

            {blockchainResult && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Registered on Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TxCard network="sepolia" txHash={blockchainResult.sepolia_tx} />
                  <TxCard network="amoy" txHash={blockchainResult.amoy_tx} />
                </CardContent>
              </Card>
            )}

            {encryptionResult && !blockchainResult && (
              <Button
                onClick={handleRegisterOnChain}
                disabled={status === "registering"}
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
              >
                {status === "registering" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register on Blockchain"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
