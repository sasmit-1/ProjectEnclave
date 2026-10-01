# Project Enclave

A highly secure, streaming-based cloud storage system built strictly on the MERN stack (MongoDB, Express, React, Node.js). Project Enclave focuses on performance and security, ensuring that files are streamed and encrypted on the fly with AES-256-GCM, and every download is rigorously checked for tampering.

## Core Features

- **Zero-Overhead Streaming Encryption:** Large files stream directly through Node.js crypto pipelines. Data is encrypted on the fly (AES-256-GCM) without buffering large payloads into server RAM, maintaining high performance and strict memory limits.
- **Cryptographic Integrity Validation:** Authentication tags are validated upon download. If a file is tampered with at rest (e.g., simulating ransomware), the system immediately flags the tag failure, severs the stream, and alerts the user on the frontend.
- **Active Behavioral Defense (Upcoming):** Redis-backed velocity tracking and an active defense engine will automatically sever TCP streams and invalidate session tokens if automated mass-extraction scripts are detected.
- **Minimalist UI:** High-contrast "AMOLED black" dashboard configured with Tailwind CSS and Zustand for intuitive vault navigation.

## Getting Started

### Prerequisites
- **Node.js** 22.12 or newer (22 LTS recommended; 20.19+ also works)
- **MongoDB Community Server**, installed as a service (includes MongoDB Compass). Alternatively, use a MongoDB Atlas free-tier connection string.

### 1. Server Setup

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `server/.env` file by copying `server/.env.example` and populate the required secrets:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/enclave
JWT_SECRET=<random 64 hex chars>
MASTER_KEY=<random 64 hex chars = 32 bytes>
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

You can generate secure random values for the secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important Notes:**
- Use `127.0.0.1` rather than `localhost` for the `MONGO_URI` (on Windows, `localhost` can sometimes resolve to IPv6 and fail connection).
- **Never change or lose your `MASTER_KEY`.** All files currently stored in the vault will become permanently unreadable without it.
- If you are running this project inside a cloud-synced folder (like OneDrive), set `UPLOAD_DIR` to a path outside of it (e.g., `C:\EnclaveUploads`) to prevent synchronization issues with large files. A relative path will resolve from the `server/` directory.

Start the server:
```bash
npm run dev
```
You should see the output: `MongoDB connected (database: enclave)`.

### 2. Client Setup

Open a second terminal instance for the frontend:
```bash
cd client
npm install
npm run dev
```
Navigate to http://localhost:5173 in your web browser.

### 3. Running Tests

To verify cryptographic integrity and test the pipelines:
```bash
cd server
npm test
```
This suite tests the 1 MB stream encrypt/decrypt round trip, simulates a tamper test (one flipped bit), and verifies the key-length validation logic.
