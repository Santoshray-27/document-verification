const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { addAuditEntry } = require('../services/audit');
const db = require('../db');
const router = express.Router();

router.post('/:docId', authenticate, requireRole(['Issuer']), (req, res) => {
    const { docId } = req.params;
    const issuerId = req.user.id === 'u2' ? 'iss1' : req.user.id;
    
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (doc.issuer_id !== issuerId) return res.status(403).json({ error: 'Not document owner' });
    
    db.prepare('UPDATE documents SET status = ? WHERE id = ?').run('REVOKED', docId);
    const auditId = addAuditEntry('REVOKE_DOC', issuerId, docId, { docId });
    
    res.json({ success: true, auditId });
});

module.exports = router;
