# 2026-09-30: Phase 2 Completed

Phase 2 (Cryptographic Engine & Integrity Validation) was built on top of the rebuilt Phase 1, starting from a fresh `files` collection and an empty `uploads/` folder.

## What was built
- **Step 1:** `iv` and `authTag` (hex, required) on the `File` model. A `toJSON` transform removes `iv`, `authTag` and `storagePath` from every API response.
- **Step 2:** `utils/crypto.js` with `getMasterKey()` (must be exactly 32 bytes) and `generateIV()` (12 fresh random bytes per file). The key is checked once at startup.
- **Step 3:** Uploads stream through an AES-256-GCM cipher before reaching disk: `pipeline(fileStream, cipher, writeStream)`.
- **Step 4:** Downloads stream through the decipher (`authTagLength: 16`). The decipher is set up before any headers, so a corrupt stored tag returns a clean 500. A failed tag check logs `🚨 INTEGRITY CHECK FAILED / POSSIBLE TAMPERING` and cuts off the download.
- **Step 5:** Tamper alert on the Dashboard: a fixed red box with a Dismiss button, shown when a download is cut off. Server errors (404 / 500) still show their normal message.
- **Step 6:** `server/test/crypto.test.js` (built-in `node:test`), run with `npm test`.

## Verified (Review 2 demo)
1. **Encryption proof:** an uploaded `.txt` is stored as random bytes; none of its words appear in the file on disk. Same size as the original (GCM adds no padding).
2. **Decryption proof:** the download is byte-identical to the original.
3. **Tamper proof:** after one byte of the ciphertext was changed, the server logged `INTEGRITY CHECK FAILED`, the download was cut off (nothing saved), and the red alert showed: "Download Blocked: File integrity compromised. Potential tampering detected."
4. **Automated tests:** `npm test` → 3/3 pass (1 MB stream round trip, one flipped bit → `unable to authenticate`, wrong-length key throws).
- API responses (upload + vault) contain no `iv`, `authTag` or `storagePath`.
- A wrong-length or non-hex `MASTER_KEY` stops the server with a clear message.
- **1.2 GB** encrypted upload + download: byte-identical, server memory flat at ~97–119 MB.
- A cancelled download logs nothing.

## Known limit (by design, see plan)
AES-GCM checks the tag only at the **end** of the file. By then the bytes have already been sent with status 200, so the browser sees a cut-off download (network error), not a 500. The upgrade path, if tampered bytes must never reach the user, is to read the file twice: verify first, then send.

## Still to do on the Windows laptop
- Repeat the demo there: open the UUID file in Notepad (should be unreadable), edit one character and save, then download again.
- `certutil -hashfile <file> SHA256` on an original and its download.
