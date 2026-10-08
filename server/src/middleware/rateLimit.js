const rateLimit = require('express-rate-limit');

const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests' }
});

module.exports = { publicLimiter };
