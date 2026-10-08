const express = require('express');
const { authenticate } = require('../middleware/auth');
const { generateReport } = require('../services/report');
const router = express.Router();

router.get('/:verificationId', authenticate, (req, res) => {
    const path = generateReport(req.params.verificationId, 'GENUINE', { level: 'High', score: 100 }, {});
    res.download(path);
});

module.exports = router;
