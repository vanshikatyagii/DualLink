"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import Link from "next/link"
import { ArrowLeft, Upload, Unlock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Status = "idle" | "decrypting" | "verifying" | "success" | "error"

interface DecryptionResult {
  image_data: string
  imageId: string
  attributes: Record<string, string>
}

interface VerificationResult {
  valid: boolean
  message: string
  metadata: Record<string, any>
}

export default function ReceiverPage() {
  const [metadataFile, setMetadataFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/json") {
      setMetadataFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid JSON metadata file")
    }
  }

  const handleDecrypt = async () => {
    if (!metadataFile) return

    setStatus("decrypting")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("metadata_file", metadataFile)

      const response = await axios.post("http://127.0.0.1:5000/decrypt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setDecryptionResult(response.data)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed")
      setStatus("error")
    }
  }

  const handleVerify = async () => {
    if (!decryptionResult) return

    setStatus("verifying")
    setError(null)

    try {
      const response = await axios.post("http://localhost:3000/verify-anchor", {
        imageId: decryptionResult.imageId,
        metadata: decryptionResult.attributes,
      })

      setVerificationResult(response.data)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      setStatus("error")
    }
  }

  const downloadImage = () => {
    if (!decryptionResult) return

    const link = document.createElement("a")
    link.href = decryptionResult.image_data
    link.download = `decrypted-${decryptionResult.imageId}.png`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Receiver Portal</h1>
          <p className="text-slate-600">Decrypt and verify images from blockchain</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Upload Metadata</CardTitle>
              <CardDescription>Select the metadata JSON file to decrypt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-purple-400 hover:bg-purple-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-900">Drop metadata file here or click to browse</p>
                  <p className="text-sm text-slate-600">JSON file only</p>
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />

              {metadataFile && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{metadataFile.name}</p>
                    <p className="text-sm text-slate-600">{(metadataFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              )}

              <Button
                onClick={handleDecrypt}
                disabled={!metadataFile || status === "decrypting"}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {status === "decrypting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    Decrypt Image
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
            {decryptionResult && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Decryption Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <img
                      src={decryptionResult.image_data || "/placeholder.svg"}
                      alt="Decrypted"
                      className="w-full rounded-lg"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Image ID</p>
                    <p className="font-mono text-sm text-slate-900 bg-slate-50 p-2 rounded">
                      {decryptionResult.imageId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Attributes</p>
                    <div className="space-y-1">
                      {Object.entries(decryptionResult.attributes).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
                          <span className="text-slate-600">{key}:</span>
                          <span className="font-medium text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={downloadImage} className="w-full bg-green-600 text-white hover:bg-green-700">
                    Download Image
                  </Button>
                </CardContent>
              </Card>
            )}

            {verificationResult && (
              <Card className={`border-slate-200 ${verificationResult.valid ? "border-green-200" : "border-red-200"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {verificationResult.valid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Verification Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={verificationResult.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                  >
                    {verificationResult.valid ? "Valid" : "Invalid"}
                  </Badge>
                  <p className="mt-2 text-sm text-slate-600">{verificationResult.message}</p>
                </CardContent>
              </Card>
            )}

            {decryptionResult && !verificationResult && (
              <Button
                onClick={handleVerify}
                disabled={status === "verifying"}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {status === "verifying" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify on Blockchain"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
