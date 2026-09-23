> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 1 - Step 2: Database Setup & User Authentication

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming.
**Current Step:** Connecting our Express backend to a database to persist data and creating the necessary schemas and endpoints for user management.

## Objectives
1. **MongoDB Connection:** 
   - Install `mongoose`, `bcrypt` (for password hashing), and `jsonwebtoken` (for auth tokens).
   - Connect the Node.js backend to a MongoDB instance via Mongoose.
2. **User Schema:** 
   - Create a `User` Mongoose schema (fields: username/email, password hash, created_at).
3. **Authentication Endpoints:**
   - `POST /api/auth/register`: Hash password, create user, return JWT.
   - `POST /api/auth/login`: Verify password, return JWT.
   - `GET /api/auth/me`: Middleware to verify the JWT and return the currently logged-in user's details.
4. **Security Basics:**
   - Decide how the JWT will be sent to the frontend (e.g., via `httpOnly` cookie or simply as a JSON response to be stored in memory/localStorage).

## Next Step Connection
Now that the backend can issue secure tokens and manage users, Step 3 will focus on building the Frontend UI to consume these endpoints, log the user in, and manage their session state.


