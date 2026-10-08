const test = require('node:test');
const assert = require('node:assert');
const { canonicalize } = require('../src/services/canonical');

test('Canonical JSON', () => {
    const obj1 = { b: 2, a: 1 };
    const obj2 = { a: 1, b: 2 };
    assert.strictEqual(canonicalize(obj1), canonicalize(obj2));

    const obj3 = { name: 'A\u030A' }; // A + ring
    const obj4 = { name: '\u00C5' }; // A with ring
    assert.strictEqual(canonicalize(obj3), canonicalize(obj4));
});
