> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# AOOP Project - Development Phases

Based on the project requirements—a highly secure, streaming-based cloud storage system with active behavioral defense and on-the-fly encryption—the development is divided into three distinct phases for the 3 project reviews.

## Phase 1: Foundation, UI & Core Streaming (Review 1)
**Goal:** Prove the foundational architecture works by building the UI and demonstrating that large files can be streamed without crashing the server RAM.
* **Frontend Setup:** Initialize the React + Vite project. Configure Tailwind CSS to build the minimalist, high-contrast "AMOLED black" UI. Set up Zustand for managing user states.
* **Backend & Database:** Set up the Node.js/Express.js server and connect it to MongoDB. Create the database schemas for users and file metadata (folder hierarchies).
* **Core Streaming Pipeline (No Encryption Yet):** Implement the `Node Streams API` (`fs.createReadStream`, `fs.createWriteStream`, and `pipeline`). Build the mechanism to upload and download files in chunks. 
* **Storage Setup:** Connect the backend to AWS S3 (or configure the Local File System) to store the raw files.

**Deliverable:** A working web app where users can log in, navigate their vault, and upload/download large files seamlessly using streams.

## Phase 2: Cryptographic Engine & Integrity Validation (Review 2)
**Goal:** Implement the "Zero-Overhead Streaming Encryption" and "Cryptographic Integrity Validation" USPs. Secure the data at rest.
* **Streaming Encryption:** Integrate Node’s built-in `crypto` (`crypto.createCipheriv` with `aes-256-gcm`) directly into your Phase 1 upload streams. Files must now be encrypted on the fly as they are being uploaded.
* **Key & Metadata Management:** Update MongoDB to store the vital Cryptographic Nonces (IVs) and Authentication Tags alongside the file metadata.
* **Integrity Validation (Decryption):** Implement the decryption stream for downloads. Ensure that if a file is tampered with (simulating ransomware), the system flags the authentication tag failure and rejects the download.

**Deliverable:** End-to-end secure file transfer. You can demonstrate uploading a file, showing that it is stored as an unreadable ciphertext blob in S3/Local storage, and successfully decrypting it upon download.

## Phase 3: Active Defense & Real-Time Visualization (Review 3)
**Goal:** Implement the "Active Behavioral Defense" USP and the frontend visualizers. Polish the project for the final presentation.
* **Redis Integration for Speed Tracking:** Deploy Redis to track download velocity and frequency in the backend RAM without database bottlenecks.
* **Active Defense Engine:** Write the logic that monitors user behavior. If script-like mass extraction is detected, instantly sever the active TCP streams and invalidate the user's session token.
* **Real-time Visualizers:** Implement the HTML5 Canvas / Framer Motion animations on the frontend to visually represent the mathematical chunking and encryption processes during uploads.
* **Testing & Final Polish:** Simulate an attack by writing a quick script that attempts to drain gigabytes of data using a stolen session token, proving your active defense stops it mid-stream.

**Deliverable:** The complete, production-ready secure vault. A show-stopping final demonstration where you visually show the encryption happening and actively block an automated exfiltration script in real-time.


