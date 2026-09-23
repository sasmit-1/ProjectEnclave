# AOOP Project - Automated AI Master Checklist

This file is designed to be read by an AI assistant. It contains detailed test conditions for every step of the project. 
**Instructions for AI:** When the user asks to "run checks for Phase X", read this file, execute the specific terminal commands or code inspections listed under that phase, and check off the boxes (by changing `[ ]` to `[x]`) using a file editing tool if the conditions are fully met.

## Phase 1: Foundation, UI & Core Streaming

- [ ] **Step 1: Project Initialization**
  - **AI Check:** 
    1. Inspect `server/package.json` for `express` and `cors`.
    2. Inspect `client/package.json` for `react`, `vite`, `tailwindcss`, and `zustand`.
    3. Verify a basic health check endpoint exists (e.g., `app.get('/api/health')` in the server entry point).

- [ ] **Step 2: Database Setup & User Auth**
  - **AI Check:** 
    1. Verify `mongoose`, `bcrypt`, and `jsonwebtoken` are in `server/package.json`.
    2. Inspect the backend models folder for a `User` Mongoose schema with password hashing logic.
    3. Inspect backend routes for `POST /api/auth/register` and `POST /api/auth/login`.

- [ ] **Step 3: Frontend UI & Auth Wiring**
  - **AI Check:**
    1. Inspect frontend code (`client/src`) for an Axios interceptor or fetch wrapper configured to automatically attach the JWT token to the `Authorization` header.
    2. Verify a Zustand store exists for managing user authentication state.
    3. Verify React Router is set up with a protected route for the Vault Dashboard.

- [ ] **Step 4: Storage & File Metadata**
  - **AI Check:**
    1. Inspect backend models for a `File` schema containing `filename`, `size`, `owner`, and `storagePath` (or S3 Key).
    2. Verify a `GET /api/vault` endpoint exists to fetch the file array for the logged-in user.

- [ ] **Step 5: Streaming Uploads**
  - **AI Check:**
    1. Inspect `POST /api/files/upload`.
    2. **Crucial:** Verify it uses a streaming parser like `busboy` or `formidable`. 
    3. Verify it uses `fs.createWriteStream()` (or AWS S3 `Upload` stream) to pipe data. It MUST NOT use `multer` memory storage to buffer files into RAM.

- [ ] **Step 6: Streaming Downloads**
  - **AI Check:**
    1. Inspect `GET /api/files/download/:id`.
    2. Verify it queries the DB for ownership, then uses `fs.createReadStream()` piped directly to the Express `res` object (`readStream.pipe(res)`).

---

## Phase 2: Cryptographic Engine & Integrity Validation

- [ ] **Step 1: Crypto Schema Expansion**
  - **AI Check:** Inspect the `File` model schema. Verify the fields `iv` (String) and `authTag` (String) have been explicitly added.

- [ ] **Step 2: Key Management**
  - **AI Check:**
    1. Verify a utility file (e.g., `server/utils/crypto.js`) exists with a function to generate a 12-byte random IV (`crypto.randomBytes(12)`).
    2. Verify logic exists to load a `MASTER_KEY` from environment variables.

- [ ] **Step 3: Upload Encryption (On-the-fly)**
  - **AI Check:**
    1. Inspect `POST /api/files/upload`.
    2. Verify `crypto.createCipheriv('aes-256-gcm', ...)` is initialized.
    3. Verify the stream pipeline is updated to push data through the cipher: `stream.pipe(cipher).pipe(writeStream)`.
    4. Verify `cipher.getAuthTag()` is called on the stream's finish event and the resulting tag is saved to the DB.

- [ ] **Step 4: Download Decryption & Integrity**
  - **AI Check:**
    1. Inspect `GET /api/files/download/:id`.
    2. Verify `crypto.createDecipheriv('aes-256-gcm', ...)` is initialized using the `iv` fetched from the DB.
    3. Verify `decipher.setAuthTag(...)` is called using the `authTag` fetched from the DB.
    4. Verify the read stream is piped through the decipher: `readStream.pipe(decipher).pipe(res)`.
    5. Verify error-handling (e.g., `.on('error')`) is attached to the decipher stream to catch tampering exceptions.

- [ ] **Step 5: Tamper UI Alert**
  - **AI Check:** Inspect frontend download logic. Verify it catches generic 500 errors or specific integrity errors and triggers a UI alert/toast containing keywords like "Integrity", "Compromised", or "Tampered".

- [ ] **Step 6: Validation Ready**
  - **AI Check:** Verify all Phase 2 steps above are checked off to confirm end-to-end encryption is functional.

---

## Phase 3: Active Behavioral Defense

- [ ] **Step 1: Redis Integration**
  - **AI Check:** Inspect `server/package.json` for `redis` or `ioredis`. Verify Redis connection logic exists in the backend initialization sequence.

- [ ] **Step 2: Velocity Tracking**
  - **AI Check:** Inspect the download route. Verify Redis `INCRBY` (or similar increment logic) is used to increment a user-specific byte-tracking key with the file size, and a TTL/expire is set on that key.

- [ ] **Step 3: The Kill Switch**
  - **AI Check:** 
    1. Inspect the download route for threshold evaluation logic (e.g., `if (trackedBytes > MAX_THRESHOLD)`).
    2. **Crucial:** Verify the presence of `req.socket.destroy()` or `res.destroy()` specifically triggered by the threshold breach to physically sever the TCP connection.
    3. Verify the user is flagged as locked/quarantined in the database.

- [ ] **Step 4: Real-Time Visualizers**
  - **AI Check:** Inspect the frontend upload component. Look for Canvas API usage, Framer Motion, or custom CSS animations explicitly designed to visually track and represent the upload/encryption pipeline progress.

- [ ] **Step 5: Lockdown UI**
  - **AI Check:** Inspect the frontend router and Axios interceptors. Verify a global catch for `403` or locked account errors automatically redirects the user to a `/lockdown` route, and verify the lockdown UI component exists.

- [ ] **Step 6: Attack Script**
  - **AI Check:** Verify a standalone script (e.g., `attack.js` or `attack.py`) exists in the project root or a `scripts/` folder, containing an automated loop designed to hit the download endpoint continuously.
