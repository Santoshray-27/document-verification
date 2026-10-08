# Agnitia - Hackathon CIPHER03 Demo Script

**Target Duration:** 3-5 Minutes
**Presenter:** Frontend Lead (Teammate 2)

## Setup & Precautions (Before Demo)
1. **Ensure Backend is Running:** Confirm the Python backend server is running on the expected port (or `.env` is properly configured).
2. **Environment Variable:** Ensure `VITE_MOCK` is correctly configured based on the environment (set to `false` for live backend, `true` only if backup plan is needed).
3. **Open Tabs:**
   - Tab 1: Issuer Dashboard (`/login` -> Issuer)
   - Tab 2: Verifier Portal (`/login` -> Verifier)
   - Tab 3: Incognito window for Public Verification (ready to paste a link).

---

## 1. Introduction & Issuance (1 min)
**Action:** Go to Tab 1 (Issuer View)
*   **Speaker:** "Welcome to Agnitia. We built a cryptographically secure, tamper-evident document verification system. Let's start as an Issuer, such as a University."
*   **Action:** Click "Issue Document" in the sidebar. Select "University Degree" (or Marksheet).
*   **Action:** Fill out the dynamic form (e.g., Student Name: "Jane Doe").
*   **Action:** Click "Issue Document".
*   **Speaker:** "When we issue a document, the backend signs the payload, generates a cryptographic hash, and logs it to a tamper-evident audit chain. We instantly get a live progress tracker."
*   **Action:** Wait for the success card to appear. Show the resulting Document ID and QR link.

---

## 2. Genuine Verification (1 min)
**Action:** Go to Tab 2 (Verifier View), click "Verify Document".
*   **Speaker:** "Now let's switch to an employer or external verifier."
*   **Action:** Select the **Upload File** or **Manual ID** tab. Use the ID or PDF generated in step 1.
*   **Action:** Click Verify and watch the live Step Tracker.
*   **Speaker:** "We stream live verification events from the backend using Server-Sent Events (SSE). It performs crypto checks and visual tamper analysis."
*   **Action:** The Result Card appears showing a **Genuine** verdict.
*   **Speaker:** "The result is Genuine. You can see the document metadata, confidence score, and the underlying crypto evidence that passed."

---

## 3. Altered / Forged Detection (1.5 min)
**Action:** Still on Tab 2 (Verifier View), click "Verify Another".
*   **Speaker:** "What if someone maliciously alters their marks or the document structure?"
*   **Action:** Select the **Upload File** tab and upload the known *Altered* sample (or enter the mock altered ID).
*   **Action:** Click Verify.
*   **Speaker:** "The system runs the same pipeline. If a signature check fails or pixel differences are found, it immediately flags it."
*   **Action:** The Result Card appears showing an **Altered** or **Forged** verdict.
*   **Speaker:** "Here, the system caught the tamper. Notice the 'Detected Data Changes' table showing the expected vs. found values. Below that, our Heatmap Viewer safely highlights exactly where the visual alteration occurred, alongside AI-assisted notes for context (AI is purely heuristic, not the final authority)."

---

## 4. Public Verification & Trust UX (0.5 min)
**Action:** Switch to Tab 3 (Incognito Window).
*   **Speaker:** "Finally, anyone can verify a document instantly via a QR scan or public link without needing an account."
*   **Action:** Paste the Public Verification URL (e.g., `/public/verify/{genuine-doc-id}`) and hit enter.
*   **Speaker:** "It securely queries the blockchain/registry. If we scan a document from an unregistered issuer, it won't falsely call it a fake—it will clearly state it is **Unverifiable**, educating the user on trust boundaries."

---

## 5. Backup Plan (If Live Network Fails)
If the backend network drops or the API is unreachable during the live demo:
1. Open the `.env` file and set `VITE_MOCK=true`.
2. Reload the frontend.
3. The app will seamlessly fall back to the built-in mock adapters.
4. **Speaker:** "We are currently operating in offline mock mode to demonstrate the UI resilience, but the exact same flow applies." The mock mode is pre-configured to handle all the demo scenarios (Genuine, Altered with Heatmap, and Unverifiable states).
