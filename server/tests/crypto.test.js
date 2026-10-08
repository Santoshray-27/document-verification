const test = require('node:test');
const assert = require('node:assert');
const { sha256, signP256, verifyP256, constantTimeCompare } = require('../src/services/crypto');
const { generateIssuerKeys } = require('../src/services/keys');

test('Crypto', async (t) => {
    await t.test('SHA-256', () => {
        const hash = sha256('hello');
        assert.strictEqual(hash, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    await t.test('ECDSA Sign/Verify', () => {
        const keys = generateIssuerKeys('testiss');
        const data = 'testdata';
        const sig = signP256(keys.privateKey, data);
        assert.ok(verifyP256(keys.publicKey, data, sig));
        assert.ok(!verifyP256(keys.publicKey, 'wrongdata', sig));
    });

    await t.test('Constant Time Compare', () => {
        assert.ok(constantTimeCompare('hello', 'hello'));
        assert.ok(!constantTimeCompare('hello', 'world'));
        assert.ok(!constantTimeCompare('hello', 'hello '));
    });
});
