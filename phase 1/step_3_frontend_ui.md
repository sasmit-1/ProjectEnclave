> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 1 - Step 3: Frontend UI - Auth & Vault Dashboard

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming.
**Current Step:** Building the user-facing minimalist "AMOLED black" interface and wiring it to our backend authentication endpoints.

## Objectives
1. **Zustand Store & HTTP Client:** 
   - Set up an Axios instance (or customized `fetch`) that automatically attaches the JWT to the `Authorization` header of every request.
   - Create a Zustand auth store to hold the current user's state (`user`, `isAuthenticated`, `login()`, `logout()`, `checkAuth()`).
2. **Authentication Pages:**
   - Build a sleek Login and Registration page using Tailwind CSS.
   - Connect the forms to the backend auth endpoints and update the Zustand store on success.
3. **Vault Dashboard Layout:**
   - Create the main application layout (Sidebar, Header with user profile/logout, Main Content Area).
   - Implement protected routes in React Router so unauthenticated users are redirected to `/login`.
   - Create UI placeholders in the dashboard for "Upload File" and "File List".

## Next Step Connection
With the user securely logged in and navigating a protected dashboard, we need a place to store their files. Step 4 will prepare the physical storage layer and the file metadata schemas.


