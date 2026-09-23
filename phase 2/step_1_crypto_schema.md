> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 2 - Step 1: Database Schema Expansion for Crypto

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 2 Goal:** Cryptographic Engine & Integrity Validation.
**Current Step:** Expanding our database model to store the required cryptographic metadata necessary for AES-GCM encryption.

## Objectives
1. **Schema Update:**
   - Update the existing `File` Mongoose schema in the backend.
   - Add a new field: `iv` (Initialization Vector), type `String`, required.
   - Add a new field: `authTag` (Authentication Tag), type `String`, required.
2. **Migration/Handling old files:**
   - (Optional but recommended) Ensure your application handles any existing Phase 1 files that do not have these fields, or simply clear the database to start fresh with Phase 2 enforcement.

## Next Step Connection
With the database ready to store encryption metadata, we need to establish the actual encryption keys and utilities. Step 2 will focus on setting up the Master Key and crypto helper functions.


