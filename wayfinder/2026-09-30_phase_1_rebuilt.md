# 2026-09-30: Phase 1 Rebuilt

Phase 1 (Foundation, UI & Core Streaming) was rebuilt from scratch following `REBUILD_PLAN.md`.

## What was built
- **Step 1:** Vite + React client with the Tailwind v4 AMOLED theme (accent: emerald `#10b981`). Express 5 server with `GET /api/health`.
- **Step 2:** MongoDB connection (the server listens only after it connects), env checks, a JSON error handler, the `User` model with bcrypt hashing, register / login / me routes, and JWT middleware (HS256, 1 day).
- **Step 3:** axios instance with a JWT interceptor, Zustand auth store, Login / Register / Dashboard pages, and `ProtectedRoute`.
- **Step 4:** `uploads/` folder created at startup, the `File` model, `GET /api/vault`, and file cards with an empty state.
- **Step 5:** Streaming uploads with busboy + `pipeline`. Files are saved on disk under UUID names, half-written files are cleaned up, and there's a crash guard and upload progress %.
- **Step 6:** Streaming downloads with ownership checks, a disk check before headers, `res.attachment`, and a blob download in the UI.

## Verified
- Health dot shows "Server online"; `curl /api/health` returns `{"status":"ok","database":"connected"}`.
- Register → token; duplicate → 400; wrong password → 400 "Invalid credentials" (same message for an unknown email); `/me` with token → user; without → 401; forged / `alg: none` tokens → 401; `{"$ne": ""}` injection → 400. Stored password starts with `$2b$`.
- Login reaches the dashboard, a refresh stays logged in, logout goes to `/login`, and `/` while logged out redirects.
- Empty vault shows "Your vault is empty"; `/api/vault` without a token → 401; users only see their own files.
- Upload: file appears immediately, UUID-named file on disk, document in `enclave.files`, and the Hindi / Japanese names are kept.
- Upload failure paths: a client abort, a truncated body, or a disk write failure leaves no partial file behind, and the server stays up. A database failure → 500 and the file is deleted.
- Download: byte-identical (sha256); invalid id / another user's file / missing on disk → 404.
- **1.2 GB** upload + download: byte-identical, server memory flat at ~116–118 MB throughout.

## Notes for later
- **Mongoose 9:** `pre('save')` hooks must be `async` functions with no `next` argument (`next` is no longer passed).
- **Express 5:** the `app.listen` callback also receives startup errors (e.g. port in use), so the server handles them.
- **busboy:** if one of its file streams is destroyed (e.g. the disk write fails), busboy stalls and never emits `close`. The upload route stops busboy in that case, so the request can't hang.
- Upload errors: malformed / aborted → 400, disk or database failure → 500, no file → 400.

## Still to do on the Windows laptop
- Part 0: install MongoDB as a service; check the `users` / `files` documents in Compass.
- `certutil -hashfile <file> SHA256` on an original and its download.
- Watch the Node process in Task Manager during a 1 GB+ upload / download (set `UPLOAD_DIR` outside OneDrive first).
