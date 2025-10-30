export default function Footer() {
  return (
    <footer className="py-4 mt-5 bg-dark text-light border-top border-secondary">
      <div className="container-lg">
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-primary">DualLink</h6>
            <small>Blockchain-integrated image encryption system</small>
          </div>
          <div className="col-md-6 text-md-end">
            <small>Sepolia & Amoy Networks • IPFS Integration</small>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <div className="text-center">
          <small className="text-muted">© 2025 DualLink. Built with React + Vite + Bootstrap</small>
        </div>
      </div>
    </footer>
  )
}
