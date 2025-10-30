// API Base URLs
// These can be overridden with environment variables during build

export const FLASK_BASE = import.meta.env.VITE_FLASK_BASE || "http://127.0.0.1:5000"
export const NODE_BASE = import.meta.env.VITE_NODE_BASE || "http://localhost:3000"

// Network configurations
export const NETWORKS = {
  SEPOLIA: {
    name: "Sepolia",
    chainId: 11155111,
    color: "primary",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  AMOY: {
    name: "Amoy",
    chainId: 80002,
    color: "secondary",
    explorerUrl: "https://amoy.polygonscan.com",
  },
}

// IPFS Gateway
export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs"
