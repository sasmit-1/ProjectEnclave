# Phase 1 - Step 5: Core Streaming Pipeline - Uploads

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming.
**Current Step:** Implementing the RAM-efficient file upload mechanism using Node.js Streams and updating the UI in real-time.

## Objectives
1. **Backend Upload Streaming:**
   - Install `busboy` (or `formidable`) to parse `multipart/form-data` streams without buffering the entire file into server RAM (do not use `multer` memory storage).
   - Implement `POST /api/files/upload`. Pipe the incoming file stream directly to `fs.createWriteStream()` (local) or stream it directly to S3.
2. **Database Update:**
   - Once the file stream finishes writing to the disk/S3 successfully, create a new document in the `File` MongoDB collection.
3. **Frontend Integration:**
   - Implement the file input and upload button UI on the dashboard.
   - Post the file using `FormData`. Show a loading spinner or basic progress state.
   - **Crucial:** Upon successful upload, automatically trigger a refresh of the vault list (re-fetch `GET /api/vault` or push the new file to the Zustand store) so the user immediately sees the file they just uploaded.

## Next Step Connection
Users can now efficiently upload large files and immediately see them in their dashboard. The final step, Step 6, completes the cycle by allowing them to download those files.
