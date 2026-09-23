> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 3 - Step 1: Redis Integration

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Integrating Redis into the backend to provide lightning-fast, RAM-based tracking of user behavior without crushing the primary MongoDB database.

## Objectives
1. **Redis Setup:**
   - Install and run a Redis server (locally via Docker/Direct or via a cloud provider like Upstash).
   - Install the `redis` or `ioredis` package in the Node.js backend.
2. **Backend Connection:**
   - Connect the Express app to the Redis instance on startup.
3. **Basic Warmup (Optional but good):**
   - Implement a standard login rate-limiter using Redis to prevent brute-force attacks on the `/api/auth/login` endpoint, proving the Redis connection works.

## Next Step Connection
With Redis functioning in the backend RAM, we have the infrastructure to track user download speeds in real-time. Step 2 will implement the exact metrics tracking needed for the defense engine.


