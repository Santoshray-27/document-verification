const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const router = express.Router();

router.post('/', authenticate, requireRole(['Issuer']), (req, res) => res.json({ jobId: '1', documentId: '1' }));
router.get('/:jobId/events', authenticate, requireRole(['Issuer']), (req, res) => res.end());

module.exports = router;
