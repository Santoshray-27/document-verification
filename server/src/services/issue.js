const { canonicalize } = require('./canonical');
const { sha256, signP256 } = require('./crypto');
const { getTemplate, validateFields } = require('./templates');
const { getPrivateKey } = require('./keys');
const { generateQR } = require('./qr');
const { renderDocument } = require('./render');
const db = require('../db');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function issueDocument(issuerId, templateId, rawFields) {
    const docId = crypto.randomBytes(16).toString('hex');
    const issuedAt = new Date().toISOString();
    const expiresAt = null;
    
    const issuer = db.prepare('SELECT * FROM issuers WHERE id = ?').get(issuerId);
    if (!issuer) throw new Error('Issuer not found');
    
    const keysDir = path.join(__dirname, '..', '..', 'storage', 'keys');
    const files = fs.readdirSync(keysDir);
    const privFile = files.find(f => f.startsWith(`${issuerId}_`) && f.endsWith('_priv.pem'));
    if (!privFile) throw new Error('Issuer keys not found');
    const kid = privFile.split('_')[1];

    const template = getTemplate(templateId);
    const fields = validateFields(rawFields, template.fieldsSchema);
    
    const fieldsHash = sha256(canonicalize(fields));
    
    const contentPayload = {
        v: 1,
        doc_id: docId,
        issuer_id: issuerId,
        kid: kid,
        fields_hash: fieldsHash,
        issued_at: issuedAt,
        expires_at: expiresAt
    };
    const contentSig = signP256(getPrivateKey(issuerId, kid), canonicalize(contentPayload));
    
    const qrPayload = {
        v: 1,
        id: docId,
        kid: kid,
        fh: fieldsHash,
        sig: contentSig,
        u: `https://agnitia.local/verify/${docId}`
    };
    const qrDataUrl = await generateQR(qrPayload);
    
    let renderedHtml = template.html;
    for (const [k, v] of Object.entries(fields)) {
        renderedHtml = renderedHtml.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
    renderedHtml = renderedHtml.replace('{{qrCode}}', `<img src="${qrDataUrl}" />`);
    
    const renderRes = await renderDocument(renderedHtml, docId);
    const fileHash = sha256(renderRes.pdfBuffer);
    
    const recordPayload = {
        doc_id: docId,
        issuer_id: issuerId,
        kid: kid,
        fields_hash: fieldsHash,
        file_hash: fileHash,
        sig_content: contentSig,
        issued_at: issuedAt,
        expires_at: expiresAt
    };
    const recordSig = signP256(getPrivateKey(issuerId, kid), canonicalize(recordPayload));
    
    db.prepare(`
        INSERT INTO documents (id, issuer_id, kid, fields_hash, file_hash, sig_content, sig_record, issued_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(docId, issuerId, kid, fieldsHash, fileHash, contentSig, recordSig, issuedAt, expiresAt);
    
    return { docId, fileHash };
}

module.exports = { issueDocument };
