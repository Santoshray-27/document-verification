function calculateVerdict(evidence) {
    if (!evidence.issuerRegistered) return 'UNVERIFIABLE';
    if (evidence.status === 'REVOKED') return 'REVOKED';
    if (evidence.status === 'EXPIRED') return 'EXPIRED';
    if (!evidence.signatureValid) return 'FORGED';
    if (evidence.fileHashMatches) return 'GENUINE';
    
    if (evidence.ocrMatches && evidence.ssimHigh) return 'GENUINE COPY';
    return 'ALTERED';
}

module.exports = { calculateVerdict };
