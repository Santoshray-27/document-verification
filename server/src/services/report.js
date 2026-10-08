const fs = require('fs');
const path = require('path');

function generateReport(verificationId, verdict, confidence, details) {
    const reportPath = path.join(__dirname, '..', '..', 'storage', 'pdfs', `report_${verificationId}.html`);
    const html = `
        <h1>Verification Report</h1>
        <p>Verification ID: ${verificationId}</p>
        <p>Verdict: <b>${verdict}</b></p>
        <p>Confidence: ${confidence.level} (${confidence.score})</p>
        <p>Evidence: ${JSON.stringify(details)}</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Limitations: AI is advisory. Cryptographic truth overrides visual heuristics.</p>
    `;
    fs.writeFileSync(reportPath, html);
    return reportPath;
}

module.exports = { generateReport };
