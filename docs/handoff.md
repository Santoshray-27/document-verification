# Agnitia Backend Integration Handoff

## Environment Setup
Create a `.env` file in the `server` directory:
```
PORT=4000
JWT_SECRET=supersecret123
WORKER_URL=http://127.0.0.1:8001
```

## Running the Backend
1. **Node Server**: `cd server && npm install && npm start`
2. **Python Worker**: `cd worker && pip install -r requirements.txt && uvicorn app.main:app --port 8001`

## Mock Accounts (DB Seeded)
- **Admin**: `admin@agnitia.local` / `pass123`
- **Issuer**: `issuer@agnitia.local` / `pass123`
- **Verifier**: `verifier@agnitia.local` / `pass123`

## Endpoints
### Auth
- `POST /api/auth/login` - Body: `{ email, password }`
- `GET /api/auth/me` - Validates JWT cookie.

### Issuance (Role: Issuer)
- `POST /api/issue` - Body: `{ templateId: "degree", fields: { studentName: "John", degreeName: "BSc" } }`
  Returns: `{ jobId, documentId, fileHash }`

### Verification (Role: Verifier)
- `POST /api/verify` - Multipart FormData: `document` (the PDF file)
  Returns: `{ jobId, verificationId }`
- `GET /api/verify/:jobId/events` - SSE endpoint.

### SSE Event Shapes
```json
// Progress step
{"type": "step", "id": "qr", "status": "done", "label": "QR Decoded", "detail": "ID: 123", "ms": 45}

// Final completion
{"type": "done", "result": {
  "verificationId": "123",
  "status": "COMPLETED",
  "verdict": "GENUINE",
  "confidence": { "level": "High", "score": 100 },
  "document": { "docId": "doc1", "name": "doc.pdf", "sha256": "abc" }
}}
```

### Public / Audit
- `GET /api/public/verify/:docId` - Unauthenticated document status check.
- `GET /api/report/:verificationId` - Downloads PDF (HTML) report.
- `GET /api/audit` - (Admin only) Gets audit logs and integrity boolean.
- `POST /api/revoke/:docId` - (Issuer only) Revokes a document.
