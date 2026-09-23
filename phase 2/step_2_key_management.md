> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 2 - Step 2: Master Key Management & Crypto Utilities

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 2 Goal:** Cryptographic Engine & Integrity Validation.
**Current Step:** Establishing a secure Master Key and creating reusable cryptographic utility functions for our streams.

## Objectives
1. **Master Key Setup:**
   - Generate a secure 32-byte (256-bit) random string to act as the Master Encryption Key.
   - Store this key securely in the backend `.env` file (e.g., `MASTER_KEY=...`).
2. **Crypto Utilities File:**
   - Create a `utils/crypto.js` file in the backend.
   - Write a function to generate a secure random Initialization Vector (IV) (12 bytes is standard for AES-GCM).
   - Write a helper to ensure the Master Key is correctly formatted as a Buffer for the Node `crypto` library.

## Next Step Connection
Now that we have our Master Key and IV generation logic, we can insert the encryption engine directly into our file upload pipeline in Step 3.


