> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 1 - Step 6: Core Streaming Pipeline - Downloads

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming.
**Current Step:** Implementing RAM-efficient file retrieval and proving the system handles large files smoothly.

## Objectives
1. **Backend Download Streaming:**
   - Implement `GET /api/files/download/:fileId`.
   - Look up the file in MongoDB to verify it exists and the requesting user owns it. Return 404/403 if not.
   - Set proper HTTP headers: `Content-Disposition: attachment; filename="original_name.ext"`.
   - Open a read stream from the storage layer (`fs.createReadStream()`) and pipe it directly to the Express `res` object (`readStream.pipe(res)`).
2. **Frontend Integration:**
   - Add a download button next to each file item in the Vault list.
   - Configure the button to trigger a browser download (e.g., using an `<a>` tag pointing to the endpoint, or a blob-based fetch if headers need to be passed).
3. **Final Validation:**
   - Upload a large file (e.g., > 1GB) via the frontend.
   - Download the file via the frontend.
   - Monitor the Node.js server terminal and system RAM to prove memory usage stays low throughout the entire process, fulfilling the core requirement of the phase.

## Phase 1 Complete!
With this step finished, Phase 1 is fully operational. We have a working web app where users can register, log in, navigate a secure vault, and seamlessly stream large files up and down without crashing the server.


