const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const router = express.Router();

router.get('/', authenticate, requireRole(['Admin']), (req, res) => res.json({ issuers: [] }));
router.post('/', authenticate, requireRole(['Admin']), (req, res) => res.json({ issuer: {} }));
router.get('/:id', (req, res) => res.json({ issuer: {}, publicKeys: [] }));

module.exports = router;
