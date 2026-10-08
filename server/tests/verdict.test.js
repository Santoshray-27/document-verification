const test = require('node:test');
const assert = require('node:assert');
const { calculateVerdict } = require('../src/services/verdict');
const { calculateConfidence } = require('../src/services/confidence');

test('Verdict & Confidence Engine', async (t) => {
    await t.test('GENUINE', () => {
        const evidence = { issuerRegistered: true, signatureValid: true, fileHashMatches: true, status: 'GENUINE' };
        assert.strictEqual(calculateVerdict(evidence), 'GENUINE');
        assert.strictEqual(calculateConfidence(evidence).level, 'High');
    });

    await t.test('ALTERED', () => {
        const evidence = { issuerRegistered: true, signatureValid: true, fileHashMatches: false, ocrMatches: false, status: 'GENUINE' };
        assert.strictEqual(calculateVerdict(evidence), 'ALTERED');
        assert.strictEqual(calculateConfidence(evidence).level, 'Medium');
    });

    await t.test('FORGED', () => {
        const evidence = { issuerRegistered: true, signatureValid: false, status: 'GENUINE' };
        assert.strictEqual(calculateVerdict(evidence), 'FORGED');
        assert.strictEqual(calculateConfidence(evidence).level, 'Low');
    });

    await t.test('UNVERIFIABLE', () => {
        const evidence = { issuerRegistered: false };
        assert.strictEqual(calculateVerdict(evidence), 'UNVERIFIABLE');
    });
});
