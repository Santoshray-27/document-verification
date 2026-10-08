const express = require('express');
const { publicLimiter } = require('../middleware/rateLimit');
const router = express.Router();

router.get('/verify/:docId', publicLimiter, (req, res) => res.json({}));

module.exports = router;
