export default function TxCard({ txHashes }) {
  const getEtherscanUrl = (txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`
  }

  const getPolygonscanUrl = (txHash) => {
    return `https://amoy.polygonscan.com/tx/${txHash}`
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">On-Chain Registration</h5>
      </div>
      <div className="card-body">
        {txHashes.sepolia_tx && (
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary">Sepolia</span>
              <small className="text-success">✓ Success</small>
            </div>
            <a
              href={getEtherscanUrl(txHashes.sepolia_tx)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <code className="text-break small">{txHashes.sepolia_tx}</code>
            </a>
            <br />
            <small className="text-muted">View on Etherscan</small>
          </div>
        )}

        {txHashes.amoy_tx && (
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-secondary">Amoy</span>
              <small className="text-success">✓ Success</small>
            </div>
            <a
              href={getPolygonscanUrl(txHashes.amoy_tx)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <code className="text-break small">{txHashes.amoy_tx}</code>
            </a>
            <br />
            <small className="text-muted">View on Polygonscan</small>
          </div>
        )}

        {txHashes.error && (
          <div className="alert alert-danger mb-0">
            <small>{txHashes.error}</small>
          </div>
        )}
      </div>
    </div>
  )
}
