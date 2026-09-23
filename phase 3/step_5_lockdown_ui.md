# Phase 3 - Step 5: Threat UI & Lockdown State

## Context
**Project:** Secure, streaming-based cloud storage system.
**Phase 3 Goal:** Active Behavioral Defense & Real-Time Visualization.
**Current Step:** Forcing a rogue user into a digital "jail" on the frontend when caught exfiltrating data.

## Objectives
1. **Global Auth Interceptor:**
   - Update the Axios/Fetch interceptor. If any API request returns a `403 Account Locked` status, immediately clear the user's local state and redirect them to a specific `/lockdown` route.
2. **Lockdown Screen:**
   - Build a highly imposing, full-screen UI (e.g., dark red background, warning icons).
   - Display a message: "SECURITY LOCKDOWN: Suspicious mass-extraction detected. Your session has been terminated and the account is quarantined."
   - Remove all navigation options. The user cannot return to the vault.

## Next Step Connection
The entire system is complete. Step 6 will focus on building the attack script to test the defense and finalizing the presentation demo.
