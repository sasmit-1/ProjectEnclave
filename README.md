# Project Enclave: Secure Cloud Vault 🛡️

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square&logo=react)
![Encryption](https://img.shields.io/badge/Security-AES--256--GCM-success?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)

A highly secure, streaming-based cloud storage system featuring active behavioral defense and on-the-fly encryption. Built strictly on the MERN stack, this project ensures that data is never stored in plaintext and actively defends against ransomware and mass-exfiltration scripts.

---

## 🌟 Key Features

* **Zero-Overhead Streaming Encryption:** Files are encrypted on the fly as they stream to the server. No RAM exhaustion even for gigabyte-sized files.
* **Cryptographic Integrity Validation:** Uses AES-256-GCM authentication tags to verify data hasn't been tampered with. Ransomware-modified files are instantly rejected upon download.
* **Active Behavioral Defense:** Real-time monitoring of download velocity and frequency using Redis. Automatically severs TCP streams and revokes tokens if script-like mass extraction is detected.
* **Real-time Visualizers:** Minimalist, high-contrast "AMOLED black" UI with HTML5 Canvas / Framer Motion animations that visualize mathematical chunking and encryption.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Zustand, Framer Motion
* **Backend:** Node.js, Express.js, Node Streams API (`crypto`, `fs`)
* **Database & Caching:** MongoDB (metadata, IVs), Redis (rate limiting & speed tracking)
* **Storage:** AWS S3 / Local File System

---

## 🚀 Development Phases

This project is built iteratively across three major phases:

### Phase 1: Foundation, UI & Core Streaming
*Prove the foundational architecture works by demonstrating large file streaming without server memory crashes.*
- **Frontend Setup:** React + Vite, Tailwind CSS for AMOLED black UI, Zustand for state management.
- **Backend & Database:** Node.js/Express.js server, MongoDB schemas for users and folder hierarchies.
- **Core Streaming:** Implement Node Streams API (`fs.createReadStream`, `pipeline`) for chunked uploads and downloads.
- **Storage:** Connect to AWS S3 or Local File System.

### Phase 2: Cryptographic Engine & Integrity Validation
*Implement Zero-Overhead Streaming Encryption and secure data at rest.*
- **Streaming Encryption:** Integrate `crypto.createCipheriv` (`aes-256-gcm`) directly into upload streams.
- **Key Management:** Store Cryptographic Nonces (IVs) and Auth Tags securely in MongoDB.
- **Integrity Validation:** Implement decryption streams that flag auth tag failures and reject tampered files.

### Phase 3: Active Defense & Real-Time Visualization
*Deploy the Active Behavioral Defense engine and polish frontend visualizers.*
- **Redis Tracking:** Deploy Redis to monitor download velocity in RAM.
- **Active Defense:** Logic to detect mass-extraction behavior, sever TCP streams, and invalidate session tokens.
- **Visualizers:** Real-time visual representation of file chunking and encryption on the frontend.
- **Stress Testing:** Simulate attacks using stolen session tokens to prove active defense capabilities.

---

## ⚙️ Getting Started

Instructions on how to run this project locally will be added here as the development progresses.
