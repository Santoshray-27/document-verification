const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/:verificationId', authenticate, (req, res) => res.end());

module.exports = router;
