function calculateConfidence(evidence) {
    let score = 0;
    let level = 'Low';
    
    if (evidence.signatureValid && evidence.fileHashMatches) {
        score = 100;
        level = 'High';
    } else if (evidence.signatureValid && !evidence.fileHashMatches) {
        if (evidence.ocrMatches && evidence.ssimHigh) {
            score = 80;
            level = 'High';
        } else {
            score = 50;
            level = 'Medium';
        }
    } else {
        score = 0;
        level = 'Low';
    }
    
    return { score, level };
}

module.exports = { calculateConfidence };
