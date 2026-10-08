const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const router = express.Router();

router.post('/:docId', authenticate, requireRole(['Issuer']), (req, res) => res.json({ success: true, auditId: 1 }));

module.exports = router;
