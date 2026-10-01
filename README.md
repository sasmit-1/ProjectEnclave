# Project Enclave

A private file vault built on the MERN stack (MongoDB, Express, React, Node.js). Files are streamed and encrypted on the fly with AES-256-GCM, and every download is checked for tampering.

## Getting Started

### Prerequisites
- **Node.js** 22.12 or newer (22 LTS recommended; 20.19+ also works)
- **MongoDB Community Server**, installed as a service (includes MongoDB Compass). Alternatively, use a MongoDB Atlas free-tier connection string.

### 1. Server
```bash
cd server
npm install
```
Create `server/.env` by copying `server/.env.example`, then fill in the two secrets:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/enclave
JWT_SECRET=<random 64 hex chars>
MASTER_KEY=<random 64 hex chars = 32 bytes>
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```
Generate each secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Use `127.0.0.1`, not `localhost`, in `MONGO_URI` (on Windows, `localhost` can resolve to IPv6 and fail).
- **Never change or lose `MASTER_KEY`.** Every file already in the vault becomes unreadable without it.
- The project sits inside OneDrive, so for big test files set `UPLOAD_DIR` to a folder outside OneDrive (for example `C:\EnclaveUploads`). A relative `UPLOAD_DIR` is resolved from the `server/` folder.

Start the server:
```bash
npm run dev
```
It should print `MongoDB connected (database: enclave)`.

### 2. Client
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173.

### 3. Tests
```bash
cd server
npm test
```
Runs the crypto tests: a 1 MB stream encrypt/decrypt round trip, a tamper test (one flipped bit), and the wrong-length key check.
