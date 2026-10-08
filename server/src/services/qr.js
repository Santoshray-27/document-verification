const QRCode = require('qrcode');

async function generateQR(payload) {
    const jsonStr = JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(jsonStr, { errorCorrectionLevel: 'H' });
    return dataUrl;
}

module.exports = { generateQR };
