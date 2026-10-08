const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { issueDocument } = require('../services/issue');
const router = express.Router();

router.post('/', authenticate, requireRole(['Issuer']), async (req, res) => {
    try {
        const { templateId, fields } = req.body;
        const issuerId = req.user.id === 'u2' ? 'iss1' : req.user.id;
        const { docId, fileHash } = await issueDocument(issuerId, templateId, fields);
        res.json({ jobId: 'mock-job', documentId: docId, fileHash });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:jobId/events', authenticate, requireRole(['Issuer']), (req, res) => res.end());

module.exports = router;
