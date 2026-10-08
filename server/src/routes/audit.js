const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const router = express.Router();

router.get('/', authenticate, requireRole(['Admin']), (req, res) => res.json({ entries: [], integrity: true }));

module.exports = router;
