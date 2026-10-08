const fs = require('fs');
const path = require('path');

function getTemplate(templateId) {
    const templatesDir = path.join(__dirname, '..', 'templates');
    const templatePath = path.join(templatesDir, templateId);
    
    if (!fs.existsSync(templatePath)) {
        throw new Error('Template not found');
    }
    
    const html = fs.readFileSync(path.join(templatePath, 'template.html'), 'utf8');
    const layout = JSON.parse(fs.readFileSync(path.join(templatePath, 'layout.json'), 'utf8'));
    const fieldsSchema = JSON.parse(fs.readFileSync(path.join(templatePath, 'fields.json'), 'utf8'));
    
    return { html, layout, fieldsSchema };
}

function validateFields(fields, schema) {
    const valid = {};
    for (const key of Object.keys(schema)) {
        if (schema[key].required && (fields[key] === undefined || fields[key] === null || fields[key] === '')) {
            throw new Error(`Missing required field: ${key}`);
        }
        if (fields[key] !== undefined) {
            valid[key] = fields[key];
        }
    }
    return valid;
}

module.exports = { getTemplate, validateFields };
