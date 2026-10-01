> [!IMPORTANT]
> **MERN Stack Project:** This project must be strictly built using the MERN stack (MongoDB, Express, React, Node.js). Do not use Python scripts or alternative backend languages.

# Phase 3 - Step 4: Real-time Visualizers (Encryption Animation)

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Visually representing the invisible mathematical processes (chunking and encryption) to the audience during the final presentation.

## Objectives
1. **Animation Setup:**
   - In the frontend Vault Dashboard, implement an HTML5 `<canvas>` or use Framer Motion.
2. **Upload Visualization:**
   - When a user uploads a file, display a visual "pipeline" on the screen.
   - Animate data "blocks" moving from the left (representing the user's device) to the right (representing the server).
   - Midway through the animation, have the blocks change color (e.g., from green to dark red) and scramble their visual content to represent the AES-256-GCM cipher scrambling the chunks on the fly.
3. **Sync with Upload:**
   - Tie the animation's progress to the actual Axios/Fetch upload progress event so the visualizer matches reality.

## Next Step Connection
The presentation visuals are stunning. Now we need to ensure the user knows when the backend Active Defense has quarantined them. Step 5 will build the Lockdown UI.


