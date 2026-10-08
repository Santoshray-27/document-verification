const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { upload } = require('../middleware/upload');
const { verifyDocument } = require('../services/verify');
const { connectSSE } = require('../services/sse');
const crypto = require('crypto');
const fs = require('fs');
const router = express.Router();

router.post('/', authenticate, requireRole(['Verifier']), upload.single('document'), (req, res) => {
    try {
        const jobId = crypto.randomBytes(8).toString('hex');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No document uploaded' });
        }
        
        const fileBuffer = fs.readFileSync(req.file.path);
        verifyDocument(jobId, fileBuffer, req.file.originalname);
        
        res.json({ jobId, verificationId: jobId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/:jobId/events', (req, res) => {
    const { jobId } = req.params;
    connectSSE(jobId, req, res);
});

router.get('/:verificationId', authenticate, requireRole(['Verifier']), (req, res) => res.json({}));
router.get('/:verificationId/evidence', authenticate, requireRole(['Verifier']), (req, res) => res.json({ checks: [] }));

module.exports = router;
