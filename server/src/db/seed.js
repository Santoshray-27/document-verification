const bcrypt = require('bcrypt');
const db = require('./index.js');

const seed = () => {
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?');
    const insertUser = db.prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)');
    
    const hash = bcrypt.hashSync('password123', 10);
    
    if (!checkUser.get('admin@agnitia.local')) {
        insertUser.run('u1', 'admin@agnitia.local', hash, 'Admin');
    }
    if (!checkUser.get('issuer@agnitia.local')) {
        insertUser.run('u2', 'issuer@agnitia.local', hash, 'Issuer');
    }
    if (!checkUser.get('verifier@agnitia.local')) {
        insertUser.run('u3', 'verifier@agnitia.local', hash, 'Verifier');
    }
    
    const checkIssuer = db.prepare('SELECT id FROM issuers WHERE id = ?');
    const insertIssuer = db.prepare('INSERT INTO issuers (id, name) VALUES (?, ?)');
    
    if (!checkIssuer.get('iss1')) {
        insertIssuer.run('iss1', 'Agnitia Default Issuer');
    }
    console.log('Database seeded.');
};

if (require.main === module) {
    seed();
}

module.exports = seed;
