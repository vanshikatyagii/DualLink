# DualLink Frontend

A modern React + Vite frontend for DualLink — a blockchain-integrated image encryption system.

## Features

- **Sharer Portal**: Encrypt images, upload to IPFS, and register metadata on-chain (Sepolia & Amoy)
- **Receiver Portal**: Decrypt images, verify ownership, and download decrypted files
- **Blockchain Integration**: On-chain registration with transaction tracking
- **IPFS Integration**: Distributed storage via Pinata gateway
- **Responsive Design**: Bootstrap 5 for mobile-first UI
- **Vanilla React**: Pure .js files, no JSX or TypeScript

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing

## Prerequisites

- Node.js 16+ and npm
- Flask API running on `http://127.0.0.1:5000`
- Node API running on `http://localhost:3000` (for anchor verification)

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repo-url>
cd duallink-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file from `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update `.env` if your backend APIs are on different URLs:
\`\`\`
VITE_FLASK_BASE=http://127.0.0.1:5000
VITE_NODE_BASE=http://localhost:3000
\`\`\`

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will open at `http://localhost:5173`

## Build

Build for production:
\`\`\`bash
npm run build
\`\`\`

Preview production build:
\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── main.js                 # React entry point
├── App.js                  # Router and layout
├── components/
│   ├── Navbar.js          # Top navigation
│   ├── Footer.js          # Footer
│   ├── ImageCard.js       # Image metadata display
│   └── TxCard.js          # Transaction display
├── pages/
│   ├── Home.js            # Landing page
│   ├── SharerPage.js      # Sharer portal
│   └── ReceiverPage.js    # Receiver portal
├── api/
│   └── constants.js       # API endpoints and config
├── utils/
│   └── fileHelpers.js     # File reading utilities
└── styles/
    └── custom.css         # Custom Bootstrap overrides
\`\`\`

## API Integration

### Flask API Endpoints

**POST /encrypt**
- Encrypts image and uploads to IPFS
- Body: `{ image_path, attributes }`
- Returns: Metadata with IPFS CIDs

**POST /register-on-chain**
- Registers metadata on Sepolia and Amoy
- Body: `{ metadata_path }`
- Returns: Transaction hashes for both networks

**POST /decrypt**
- Decrypts image from metadata
- Body: `{ metadata_path }`
- Returns: Base64 or URL of decrypted image

### Node API Endpoints

**POST /verify-anchor**
- Verifies on-chain anchor
- Body: `{ imageId, metadata }`
- Returns: Verification result

## Assumptions & Notes

### File Upload Handling

The current implementation assumes:
- Flask `/encrypt` endpoint accepts `FormData` with `image` file and `attributes` JSON
- If your backend expects different parameters, update the `handleEncryptAndUpload` function in `SharerPage.js`

### Metadata Format

Metadata is expected to have:
\`\`\`json
{
  "imageId": "unique-id",
  "preview_cid": "QmXxx...",
  "private_cid": "QmYyy...",
  "timestamp": "2025-01-01T00:00:00Z",
  "attributes": { "role": "doctor", "org": "HospitalX" }
}
\`\`\`

### CORS Configuration

Ensure your Flask and Node APIs have CORS enabled for `http://localhost:5173` (dev) and your production domain.

## Troubleshooting

### API Connection Issues
- Verify Flask API is running on `http://127.0.0.1:5000`
- Verify Node API is running on `http://localhost:3000`
- Check browser console for CORS errors
- Ensure `.env` variables are correctly set

### Image Upload Fails
- Check file size limits on Flask backend
- Verify file is valid PNG or JPG
- Check Flask logs for detailed error messages

### Decryption Fails
- Ensure metadata JSON is valid
- Verify metadata was created by the same encryption process
- Check Flask logs for decryption errors

## License

MIT
