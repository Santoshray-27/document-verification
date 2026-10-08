# Security Notes

## Trust Boundary
- The Node.js Express server is the only component with access to the database and signing keys.
- Python workers are stateless and operate strictly on provided images, isolating complex C-bindings and avoiding direct DB/key exposure.

## Cryptography
- We use ECDSA P-256 for deterministic issuance.
- The `canonical.js` utility strictly enforces NFC normalization and dictionary sorting before hashing.

## Limitations
- AI/OCR are advisory.
- Currently, rate-limiting relies on basic memory stores, which should be shifted to Redis in production.
