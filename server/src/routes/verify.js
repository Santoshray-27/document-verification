const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { upload } = require('../middleware/upload');
const router = express.Router();

router.post('/', authenticate, requireRole(['Verifier']), upload.single('document'), (req, res) => res.json({ jobId: '1', verificationId: '1' }));
router.get('/:jobId/events', authenticate, requireRole(['Verifier']), (req, res) => res.end());
router.get('/:verificationId', authenticate, requireRole(['Verifier']), (req, res) => res.json({}));
router.get('/:verificationId/evidence', authenticate, requireRole(['Verifier']), (req, res) => res.json({ checks: [] }));

module.exports = router;
