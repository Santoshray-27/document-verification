const db = require('../db');
const { sha256 } = require('./crypto');
const { canonicalize } = require('./canonical');

function addAuditEntry(action, actorId, targetId, details) {
    const lastEntry = db.prepare('SELECT entry_hash FROM audit_log ORDER BY id DESC LIMIT 1').get();
    const prevHash = lastEntry ? lastEntry.entry_hash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const timestamp = new Date().toISOString();
    const entryData = { action, actorId, targetId, details, timestamp };
    const entryHash = sha256(prevHash + canonicalize(entryData));
    
    db.prepare('INSERT INTO audit_log (action, actor_id, target_id, details, prev_hash, entry_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(action, actorId, targetId, JSON.stringify(details), prevHash, entryHash, timestamp);
      
    return entryHash;
}

function verifyAuditIntegrity() {
    const entries = db.prepare('SELECT * FROM audit_log ORDER BY id ASC').all();
    let computedPrev = '0000000000000000000000000000000000000000000000000000000000000000';
    
    for (const row of entries) {
        if (row.prev_hash !== computedPrev) return false;
        
        const entryData = { action: row.action, actorId: row.actor_id, targetId: row.target_id, details: JSON.parse(row.details), timestamp: row.created_at };
        const computedEntry = sha256(row.prev_hash + canonicalize(entryData));
        
        if (computedEntry !== row.entry_hash) return false;
        computedPrev = computedEntry;
    }
    return true;
}

module.exports = { addAuditEntry, verifyAuditIntegrity };
