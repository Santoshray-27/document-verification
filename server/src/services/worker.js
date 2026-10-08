const { env } = require('../config');

async function callWorker(endpoint, formData) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(`${env.WORKER_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!response.ok) {
            throw new Error(`Worker returned ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            throw new Error('Worker timeout');
        }
        throw err;
    }
}

async function extractQR(buffer) {
    const fd = new FormData();
    fd.append('file', new Blob([buffer]));
    return callWorker('/qr', fd);
}

async function performOCR(buffer) {
    const fd = new FormData();
    fd.append('file', new Blob([buffer]));
    return callWorker('/ocr', fd);
}

module.exports = { callWorker, extractQR, performOCR };
