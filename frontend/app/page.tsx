"use client"
import Link from "next/link"
import { Lock, Unlock, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">DualLink</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">Blockchain-Integrated Image Encryption</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Securely encrypt, upload to IPFS, and anchor metadata on Ethereum and Polygon. Verify and decrypt with
            complete transparency.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Sharer Portal */}
          <Link href="/sharer">
            <div className="group cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-blue-400 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">Sharer Portal</h3>
              <p className="mb-6 text-slate-600">
                Upload images, encrypt them, and register metadata on blockchain networks.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Receiver Portal */}
          <Link href="/receiver">
            <div className="group cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-purple-400 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Unlock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">Receiver Portal</h3>
              <p className="mb-6 text-slate-600">
                Upload metadata files, decrypt images, and verify blockchain anchors.
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-medium group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 border border-slate-200">
            <div className="mb-3 text-2xl">🔐</div>
            <h4 className="mb-2 font-bold text-slate-900">End-to-End Encryption</h4>
            <p className="text-sm text-slate-600">Images are encrypted locally before being uploaded to IPFS.</p>
          </div>
          <div className="rounded-lg bg-white p-6 border border-slate-200">
            <div className="mb-3 text-2xl">⛓️</div>
            <h4 className="mb-2 font-bold text-slate-900">Multi-Chain Support</h4>
            <p className="text-sm text-slate-600">
              Metadata registered on Ethereum Sepolia and anchored on Polygon Amoy.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 border border-slate-200">
            <div className="mb-3 text-2xl">✅</div>
            <h4 className="mb-2 font-bold text-slate-900">Verifiable</h4>
            <p className="text-sm text-slate-600">
              Verify image authenticity and integrity through blockchain anchors.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
