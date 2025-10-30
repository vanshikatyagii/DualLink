import { ExternalLink } from "lucide-react"

interface ImageCardProps {
  cid: string
  label: string
}

export default function ImageCard({ cid, label }: ImageCardProps) {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-sm text-slate-900 truncate">{cid}</p>
        <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
