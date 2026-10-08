const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function renderDocument(html, docId) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set a fixed deterministic viewport
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });
    
    // Inject deterministic CSS to remove animations/timestamps
    const deterministicStyles = `
        <style>
            * { transition: none !important; animation: none !important; }
            .date-time { display: none !important; }
        </style>
    `;
    await page.setContent(deterministicStyles + html, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.join(__dirname, '..', '..', 'storage', 'pdfs', `${docId}.pdf`);
    const pngPath = path.join(__dirname, '..', '..', 'storage', 'snapshots', `${docId}.png`);
    
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    const pngBuffer = await page.screenshot({ fullPage: true, type: 'png' });
    fs.writeFileSync(pngPath, pngBuffer);
    
    await browser.close();
    
    return { pdfPath, pngPath, pdfBuffer, pngBuffer };
}

module.exports = { renderDocument };
