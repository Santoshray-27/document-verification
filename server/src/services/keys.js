const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '..', '..', 'storage', 'keys');
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

function generateIssuerKeys(issuerId) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const kid = crypto.randomBytes(8).toString('hex');
    
    fs.writeFileSync(path.join(keysDir, `${issuerId}_${kid}_priv.pem`), privateKey, { mode: 0o600 });
    fs.writeFileSync(path.join(keysDir, `${issuerId}_${kid}_pub.pem`), publicKey);
    
    return { kid, publicKey, privateKey };
}

function getPrivateKey(issuerId, kid) {
    const keyPath = path.join(keysDir, `${issuerId}_${kid}_priv.pem`);
    if (!fs.existsSync(keyPath)) throw new Error('Private key not found');
    return fs.readFileSync(keyPath, 'utf8');
}

module.exports = { generateIssuerKeys, getPrivateKey };
