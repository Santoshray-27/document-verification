const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { verifyAuditIntegrity } = require('../services/audit');
const db = require('../db');
const router = express.Router();

router.get('/', authenticate, requireRole(['Admin']), (req, res) => {
    const integrity = verifyAuditIntegrity();
    const entries = db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 100').all();
    res.json({ integrity, entries });
});

module.exports = router;
