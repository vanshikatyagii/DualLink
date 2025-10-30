export default function ImageCard({ metadata }) {
  const getIpfsGatewayUrl = (cid) => {
    return `https://gateway.pinata.cloud/ipfs/${cid}`
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Metadata Summary</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <small className="text-muted">Image ID</small>
          <p className="mb-2 font-monospace text-break">{metadata.imageId || "N/A"}</p>
        </div>

        <div className="mb-3">
          <small className="text-muted">Preview CID</small>
          <p className="mb-2">
            <a
              href={getIpfsGatewayUrl(metadata.preview_cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <code className="text-break">{metadata.preview_cid?.substring(0, 30)}...</code>
            </a>
          </p>
        </div>

        <div className="mb-3">
          <small className="text-muted">Private CID</small>
          <p className="mb-2">
            <a
              href={getIpfsGatewayUrl(metadata.private_cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <code className="text-break">{metadata.private_cid?.substring(0, 30)}...</code>
            </a>
          </p>
        </div>

        <div className="mb-3">
          <small className="text-muted">Timestamp</small>
          <p className="mb-0">{new Date(metadata.timestamp).toLocaleString()}</p>
        </div>

        <div className="mt-3 pt-3 border-top">
          <small className="text-muted">Attributes</small>
          <p className="mb-0 font-monospace small">{JSON.stringify(metadata.attributes || {}, null, 2)}</p>
        </div>
      </div>
    </div>
  )
}
