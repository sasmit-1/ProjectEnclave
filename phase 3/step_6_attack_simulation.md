# Phase 3 - Step 6: Attack Simulation & Final Polish

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Proving the Active Defense USP works by literally attacking your own system.

## Objectives
1. **The Exfiltration Script:**
   - Write a standalone script outside the main project (e.g., `attack.js` in Node or Python).
   - Hardcode a valid JWT token into the script.
   - Write a tight `while` loop that rapidly fires HTTP GET requests to download large files from the vault continuously.
2. **The Attack Demo:**
   - Run the frontend and backend.
   - Execute the `attack.js` script in the terminal.
   - Watch the script succeed for the first few files, then suddenly crash with `ECONNRESET` (socket hang up) as the backend Active Defense severs the connection mid-stream.
3. **The Aftermath Demo:**
   - Look at the Frontend UI for that user. They should be instantly kicked out of the vault and thrown into the red "SECURITY LOCKDOWN" screen.

## Phase 3 Complete!
With this step finished, the AOOP project is 100% complete and ready for the final Review 3 presentation. You have built a secure, streaming-based, actively defensive cloud architecture.
