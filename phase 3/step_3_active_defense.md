> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 3 - Step 3: Active Defense Engine (Stream Severing)

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Automatically stopping a mass data exfiltration event (like a rogue script) dead in its tracks.

## Objectives
1. **Threshold Evaluation:**
   - In the download route, immediately after checking/incrementing the Redis byte counter, evaluate the total against a hard limit (e.g., > 500MB per minute).
2. **The Kill Switch:**
   - If the user exceeds the threshold, **do not just send a 403 error**. If the stream is already active, violently sever the underlying TCP connection using `req.socket.destroy()` or `res.destroy()`. This physically breaks the download mid-stream.
3. **Account Quarantine:**
   - Update the user's MongoDB record to set a flag: `isLocked: true`.
   - Add backend middleware to reject any further API requests (uploads, downloads, or vault fetching) if the user's account is locked.

## Next Step Connection
The backend is now armed and dangerous. To make the project presentable and visually engaging, Step 4 will introduce real-time Frontend visualizers.


