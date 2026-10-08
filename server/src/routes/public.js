const express = require('express');
const { publicLimiter } = require('../middleware/rateLimit');
const db = require('../db');
const router = express.Router();

router.get('/verify/:docId', publicLimiter, (req, res) => {
    const doc = db.prepare('SELECT id, issuer_id, status, issued_at FROM documents WHERE id = ?').get(req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    
    res.json({
        id: doc.id,
        issuerId: doc.issuer_id,
        status: doc.status,
        issuedAt: doc.issued_at
    });
});

module.exports = router;
