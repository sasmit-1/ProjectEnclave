> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 2 - Step 4: Decryption & Integrity Validation (Downloads)

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 2 Goal:** Cryptographic Engine & Integrity Validation.
**Current Step:** Decrypting files on-the-fly during download and using the Auth Tag to guarantee the file hasn't been maliciously modified.

## Objectives
1. **Pipeline Modification:**
   - Modify the `GET /api/files/download/:fileId` endpoint.
   - Retrieve the `iv` and `authTag` from the file's MongoDB document.
2. **Decryption Stream:**
   - Create an AES-256-GCM decipher stream (`crypto.createDecipheriv`) using the Master Key and the retrieved IV.
   - Set the authentication tag on the decipher stream using `decipher.setAuthTag()`.
   - Insert the decipher into the pipeline: `storageReadStream.pipe(decipher).pipe(res)`.
3. **Integrity Validation Handling:**
   - If the file has been tampered with, the decipher stream will throw an error when finalizing.
   - Catch this specific crypto error, abort the response stream, and log a critical "Integrity Check Failed / Possible Tampering" warning in the backend console.

## Next Step Connection
The backend now enforces cryptographic integrity. Step 5 will ensure the Frontend gracefully handles the scenario where a download is rejected due to tampering.


