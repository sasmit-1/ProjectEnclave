> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 2 - Step 3: Zero-Overhead Streaming Encryption (Uploads)

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 2 Goal:** Cryptographic Engine & Integrity Validation.
**Current Step:** Intercepting the Phase 1 upload stream and encrypting the data on-the-fly before it is written to the disk/S3.

## Objectives
1. **Pipeline Modification:**
   - Modify the `POST /api/files/upload` endpoint.
   - For every upload, generate a new IV using the utility from Step 2.
   - Create an AES-256-GCM cipher stream (`crypto.createCipheriv`).
   - Insert the cipher stream into the upload pipeline: `incomingFileStream.pipe(cipher).pipe(storageWriteStream)`.
2. **Auth Tag Extraction:**
   - Listen for the stream's completion (`finish` event).
   - Extract the generated Authentication Tag from the cipher using `cipher.getAuthTag()`.
3. **Database Insertion:**
   - Save the file metadata to MongoDB, including the generated `iv` and the extracted `authTag` in HEX or Base64 format.

## Next Step Connection
Files are now successfully arriving at the storage layer as unreadable ciphertext. To make them useful again, Step 4 will implement the reverse process: Decryption and Integrity Validation.


