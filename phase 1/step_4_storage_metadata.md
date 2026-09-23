# Phase 1 - Step 4: Storage Integration & File Metadata Schema

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming.
**Current Step:** Configuring where files live physically, tracking them in MongoDB, and displaying the empty (or populated) vault in the UI.

## Objectives
1. **Storage Layer Configuration:**
   - Choose local file system (e.g., a `uploads/` directory) or AWS S3. 
   - Ensure the backend has permissions to write to this location.
2. **Database Schemas:**
   - Create a `File` schema (fields: `filename`, `originalName`, `mimeType`, `size`, `storagePath/Key`, `owner` (ref to User)).
   - *(Optional for Phase 1)* Create a `Folder` schema to support directory hierarchies.
3. **Vault Fetching Backend:**
   - Implement `GET /api/vault` to fetch all files belonging to the logged-in user from the database.
4. **Vault Fetching Frontend:**
   - Wire up the Frontend Dashboard to call `GET /api/vault` on mount.
   - Replace the placeholders from Step 3 with a dynamic list/grid mapping over the fetched files. Show "Vault is empty" if no files exist.

## Next Step Connection
The UI can now dynamically display what's in the database. Next, Step 5 will build the actual file upload mechanism so users can start putting files into the vault.
