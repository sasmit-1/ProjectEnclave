# Phase 1 - Step 1: Project Initialization & Skeleton

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 1 Goal:** Foundation, UI & Core Streaming. No encryption yet.
**Current Step:** Setting up the base folder structure, dependencies, and getting both the Frontend and Backend running and communicating.

## Objectives
1. **Repository Structure:** Create a standard monorepo structure separating `client` and `server` folders.
2. **Frontend Setup:** 
   - Initialize a React app using Vite (`npm create vite@latest client -- --template react`).
   - Install Tailwind CSS, configure it for the "AMOLED black" theme.
   - Install Zustand (state management) and React Router (navigation).
3. **Backend Setup:**
   - Initialize a Node.js project (`npm init -y` in `server`).
   - Install dependencies: `express`, `cors`, `dotenv`.
   - Install dev dependencies: `nodemon`.
   - Set up the Express app with `express.json()` and `cors()` (configured to accept requests from the Vite frontend port).
4. **Integration Check:** 
   - Start both servers concurrently.
   - Ensure the frontend can successfully make a basic `fetch` or `axios` call to a backend health-check endpoint (`GET /api/health`), proving CORS is correctly configured.

## Next Step Connection
With the boilerplate running and CORS issues out of the way, Step 2 will focus on connecting to MongoDB and securing the app with user authentication.
