> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 3 - Step 2: Behavioral Tracking (Velocity Metrics)

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Tracking exactly how much data a user is extracting from the vault within a given timeframe.

## Objectives
1. **Download Counter Logic:**
   - Modify the Phase 2 download stream (`GET /api/files/download/:fileId`).
   - Identify the size of the file being downloaded.
2. **Redis Aggregation:**
   - Before (or as) the download begins, increment a Redis key specific to that user (e.g., `user:${userId}:bytes_downloaded`).
   - Use the `INCRBY` command to add the file's byte size to the counter.
3. **Time-To-Live (TTL):**
   - Set an expiring TTL on this Redis key (e.g., 60 seconds). This creates a rolling window that tracks "Bytes downloaded per minute."

## Next Step Connection
The system now knows silently in the background if a user is acting suspiciously. Step 3 will give the system the teeth to fight back by severing the connection.


