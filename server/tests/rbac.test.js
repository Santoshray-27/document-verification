const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { env } = require('../src/config');
const seed = require('../src/db/seed');

seed(); // Ensure DB is seeded

test('RBAC and Auth Tests', async (t) => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    
    const token = jwt.sign({ id: 'u3', email: 'verifier@agnitia.local', role: 'Verifier' }, env.JWT_SECRET);
    const headers = { 'Cookie': `jwt=${token}` };

    t.after(() => server.close());

    await t.test('Health endpoint works', async () => {
        const res = await fetch(`${baseUrl}/api/health`);
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.ok, true);
    });

    await t.test('Unauthorized access fails', async () => {
        const res = await fetch(`${baseUrl}/api/auth/me`);
        assert.strictEqual(res.status, 401);
    });

    await t.test('RBAC prevents Verifier from accessing Admin route', async () => {
        const res = await fetch(`${baseUrl}/api/issuers`, { headers });
        assert.strictEqual(res.status, 403);
    });

    await t.test('Invalid upload type is rejected', async () => {
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const body = `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\nFake Content\r\n--${boundary}--`;
        const res = await fetch(`${baseUrl}/api/verify`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body
        });
        // Multer throws error on bad mimetype which our error handler catches as 500
        assert.strictEqual(res.status, 500);
    });
});
