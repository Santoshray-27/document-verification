const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { generateIssuerKeys } = require('../services/keys');
const db = require('../db');
const router = express.Router();

router.get('/', authenticate, requireRole(['Admin']), (req, res) => {
    const issuers = db.prepare('SELECT id, name, created_at FROM issuers').all();
    res.json({ issuers });
});

router.post('/', authenticate, requireRole(['Admin']), (req, res) => {
    const { id, name } = req.body;
    db.prepare('INSERT INTO issuers (id, name) VALUES (?, ?)').run(id, name);
    const keys = generateIssuerKeys(id);
    db.prepare('UPDATE issuers SET public_key = ? WHERE id = ?').run(keys.publicKey, id);
    res.json({ issuer: { id, name } });
});

router.get('/:id', (req, res) => {
    const issuer = db.prepare('SELECT id, name, public_key, theme_data FROM issuers WHERE id = ?').get(req.params.id);
    res.json({ issuer, publicKeys: issuer && issuer.public_key ? [issuer.public_key] : [] });
});

module.exports = router;
