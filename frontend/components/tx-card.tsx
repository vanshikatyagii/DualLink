"use client"

import { ExternalLink, Copy } from "lucide-react"

interface TxCardProps {
  network: "sepolia" | "amoy"
  txHash: string
}

export default function TxCard({ network, txHash }: TxCardProps) {
  const networkConfig = {
    sepolia: {
      name: "Ethereum Sepolia",
      color: "bg-blue-100 text-blue-700",
      explorer: "https://sepolia.etherscan.io/tx/",
    },
    amoy: {
      name: "Polygon Amoy",
      color: "bg-purple-100 text-purple-700",
      explorer: "https://amoy.polygonscan.com/tx/",
    },
  }

  const config = networkConfig[network]
  const explorerUrl = `${config.explorer}${txHash}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${config.color}`}>{config.name}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-sm text-slate-900 truncate">{txHash}</p>
        <div className="flex gap-1">
          <button onClick={copyToClipboard} className="text-slate-600 hover:text-slate-900" title="Copy">
            <Copy className="h-4 w-4" />
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
            title="View on Explorer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
