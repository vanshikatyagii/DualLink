import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="py-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-4 fw-bold mb-3">DualLink</h1>
          <p className="lead text-muted mb-4">
            Secure image encryption with blockchain verification. Share encrypted images via IPFS and verify ownership
            on-chain.
          </p>
          <div className="d-flex gap-3">
            <Link className="btn btn-primary btn-lg" to="/sharer">
              <i className="bi bi-upload"></i> Sharer Portal
            </Link>
            <Link className="btn btn-outline-primary btn-lg" to="/receiver">
              <i className="bi bi-download"></i> Receiver Portal
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body p-5 text-center">
              <h5 className="card-title mb-3">How It Works</h5>
              <div className="text-start">
                <p className="mb-2">
                  <strong>Sharer:</strong> Upload image → Encrypt → Upload to IPFS → Register on-chain
                </p>
                <p className="mb-2">
                  <strong>Receiver:</strong> Upload metadata → Decrypt → Verify anchor → Download image
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
