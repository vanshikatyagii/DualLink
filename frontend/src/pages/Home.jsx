import { Link } from "react-router-dom"

export default function Home() {
  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-lg">
          <Link to="/" className="navbar-brand">
            <i className="bi bi-lock-fill"></i>
            DualLink
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-lg">
          <h1>Blockchain-Integrated Image Encryption</h1>
          <p>
            Securely encrypt, upload to IPFS, and anchor metadata on Ethereum and Polygon. Verify and decrypt with
            complete transparency.
          </p>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="py-5">
        <div className="container-lg">
          <div className="row g-4 mb-5">
            {/* Sharer Portal */}
            <div className="col-md-6">
              <Link to="/sharer" className="portal-card sharer p-4">
                <div className="portal-icon">
                  <i className="bi bi-lock"></i>
                </div>
                <h3 className="h4 mb-3">Sharer Portal</h3>
                <p className="text-muted mb-3">
                  Upload images, encrypt them, and register metadata on blockchain networks.
                </p>
                <div className="d-flex align-items-center gap-2 text-primary">
                  <span>Get Started</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </Link>
            </div>

            {/* Receiver Portal */}
            <div className="col-md-6">
              <Link to="/receiver" className="portal-card receiver p-4">
                <div className="portal-icon">
                  <i className="bi bi-unlock"></i>
                </div>
                <h3 className="h4 mb-3">Receiver Portal</h3>
                <p className="text-muted mb-3">Upload metadata files, decrypt images, and verify blockchain anchors.</p>
                <div className="d-flex align-items-center gap-2" style={{ color: "var(--color-amoy)" }}>
                  <span>Get Started</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h5 className="mb-2">End-to-End Encryption</h5>
                <p className="text-muted small">Images are encrypted locally before being uploaded to IPFS.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">⛓️</div>
                <h5 className="mb-2">Multi-Chain Support</h5>
                <p className="text-muted small">
                  Metadata registered on Ethereum Sepolia and anchored on Polygon Amoy.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h5 className="mb-2">Verifiable</h5>
                <p className="text-muted small">Verify image authenticity and integrity through blockchain anchors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
