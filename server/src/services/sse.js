const connections = new Map();
const jobLogs = new Map();

function connectSSE(jobId, req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    connections.set(jobId, res);
    
    if (jobLogs.has(jobId)) {
        for (const msg of jobLogs.get(jobId)) {
            res.write(`data: ${JSON.stringify(msg)}\n\n`);
        }
    }
    
    req.on('close', () => connections.delete(jobId));
}

function emitStep(jobId, id, status, label, detail, ms) {
    const msg = { type: 'step', id, status, label, detail, ms };
    if (!jobLogs.has(jobId)) jobLogs.set(jobId, []);
    jobLogs.get(jobId).push(msg);
    
    if (connections.has(jobId)) {
        connections.get(jobId).write(`data: ${JSON.stringify(msg)}\n\n`);
    }
}

function emitDone(jobId, result) {
    const msg = { type: 'done', result };
    if (!jobLogs.has(jobId)) jobLogs.set(jobId, []);
    jobLogs.get(jobId).push(msg);
    
    if (connections.has(jobId)) {
        connections.get(jobId).write(`data: ${JSON.stringify(msg)}\n\n`);
        connections.get(jobId).end();
        connections.delete(jobId);
    }
}

module.exports = { connectSSE, emitStep, emitDone };
