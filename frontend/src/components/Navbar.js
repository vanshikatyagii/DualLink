import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container-lg">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">Dual</span>Link
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/sharer">
                Sharer Portal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/receiver">
                Receiver Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
