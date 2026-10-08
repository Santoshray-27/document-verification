export const VITE_MOCK = import.meta.env?.VITE_MOCK === 'true';

const MOCK_DB = {
  admin: { role: 'admin', email: 'admin@agnitia.test', name: 'System Admin' },
  issuer: { role: 'issuer', email: 'issuer@agnitia.test', name: 'University Issuer' },
  verifier: { role: 'verifier', email: 'verifier@agnitia.test', name: 'External Verifier' }
};

let currentUser = null;

export const client = async (endpoint, { method = 'GET', body, ...customConfig } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const config = { method, ...customConfig, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (VITE_MOCK) {
    console.log(`[MOCK] ${method} ${endpoint}`, body);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (endpoint === '/api/auth/login' && method === 'POST') {
          const { email, password } = body;
          const userKey = Object.keys(MOCK_DB).find(k => MOCK_DB[k].email === email);
          if (userKey && password === 'password') {
            currentUser = MOCK_DB[userKey];
            return resolve({ user: currentUser, ok: true });
          }
          return reject(new Error('401 Unauthorized'));
        }
        if (endpoint === '/api/auth/me' && method === 'GET') {
          if (currentUser) return resolve({ user: currentUser });
          return reject(new Error('401 Unauthorized'));
        }
        if (endpoint === '/api/auth/logout' && method === 'POST') {
          currentUser = null;
          return resolve({ ok: true });
        }

        if (endpoint === '/api/templates' && method === 'GET') {
          return resolve({ templates: [
            { id: 'degree-v1', name: 'University Degree', fields: [ {name: 'studentName', type: 'string', required: true}, {name: 'degree', type: 'string', required: true} ] },
            { id: 'marksheet-v1', name: 'Marksheet', fields: [ {name: 'studentName', type: 'string', required: true}, {name: 'marks', type: 'table', columns: ['subject', 'score']} ] }
          ], ok: true });
        }
        if (endpoint === '/api/issuers' && method === 'GET') {
          return resolve({ issuers: [{ id: 'issuer-1', name: 'University Issuer', status: 'active', did: 'did:agnitia:issuer-1' }], ok: true });
        }
        if (endpoint === '/api/issuers' && method === 'POST') {
          return resolve({ issuer: { id: 'issuer-new', name: body.name, status: 'active' }, ok: true });
        }
        if (endpoint === '/api/issue' && method === 'POST') {
          return resolve({ jobId: 'job-123', documentId: 'doc-123', ok: true });
        }
        if (endpoint.match(/^\/api\/issuers\/[^\/]+$/) && method === 'GET') {
          return resolve({ issuer: { id: 'issuer-1', name: 'University Issuer' }, publicKeys: [{ id: 'key-1', status: 'active', material: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...mock\n-----END PUBLIC KEY-----' }], ok: true });
        }
        if (endpoint === '/api/audit' && method === 'GET') {
          return resolve({ entries: [{ id: '1', action: 'DOCUMENT_ISSUED', actor: 'issuer-1', timestamp: '2026-10-08T10:00:00Z', details: 'Issued doc-123', hash: 'abc...' }], integrity: true, ok: true });
        }
        if (endpoint.startsWith('/api/revoke/') && method === 'POST') {
          return resolve({ success: true, auditId: 'audit-revoke-1', ok: true });
        }
        if (endpoint === '/api/documents/me' && method === 'GET') {
          return resolve({ documents: [{ id: 'doc-123', templateId: 'degree-v1', status: 'GENUINE', issuedAt: '2026-10-08T10:00:00Z' }], ok: true });
        }
        if (endpoint === '/api/verify' && method === 'POST') {
          return resolve({ jobId: 'verify-job-123', verificationId: 'verify-123', ok: true });
        }
        if (endpoint.match(/^\/api\/verify\/[^\/]+$/) && method === 'GET') {
          return resolve({ 
            verificationId: endpoint.split('/').pop(),
            status: 'done',
            verdict: 'ALTERED',
            confidence: { level: 'high', score: 0.99 },
            document: { docId: 'doc-123', name: 'test.pdf', type: 'application/pdf', size: 1024, sha256: 'abc123def456' },
            summary: 'The document signature is valid, but visual tampering was detected in the marks section.',
            changedFields: [{ field: 'marks', original: '85', altered: '95' }],
            aiNotes: 'The font kerning in the altered region is inconsistent with the rest of the document.',
            timestamps: { startedAt: '2026-10-08T10:00:00Z', completedAt: '2026-10-08T10:00:10Z' },
            ok: true 
          });
        }
        if (endpoint.match(/^\/api\/verify\/[^\/]+\/evidence$/) && method === 'GET') {
          return resolve({
            checks: [
              { id: 'c1', category: 'crypto', status: 'pass', severity: 'low', label: 'Signature Check', detail: 'ECDSA P-256 valid' },
              { id: 'c2', category: 'visual', status: 'fail', severity: 'high', label: 'Pixel Diff', detail: 'Mismatch in marks region', evidence: 'High structural similarity diff' }
            ],
            regions: [
              { label: 'marks', x: 10, y: 20, w: 100, h: 50, heatmapUrl: '/mock-heatmap.png' }
            ],
            ok: true
          });
        }
        if (endpoint.startsWith('/api/public/verify/') && method === 'GET') {
          const docId = endpoint.split('/').pop();
          if (docId === 'unknown' || docId === 'unverifiable') {
            return resolve({
              verificationId: 'pub-verify-unknown',
              status: 'done',
              verdict: 'UNVERIFIABLE',
              summary: 'Issuer is not registered in the trusted directory. The document cannot be verified.',
              ok: true
            });
          }
          return resolve({
            verificationId: 'pub-verify-123',
            status: 'done',
            verdict: 'GENUINE',
            summary: 'The document is authentic and unmodified.',
            ok: true
          });
        }
        
        if (!currentUser && !endpoint.startsWith('/api/public')) {
           return reject(new Error('401 Unauthorized'));
        }
        
        return resolve({ data: 'mock_data', ok: true });
      }, 500);
    });
  }

  config.credentials = 'include';
  let data;
  try {
    const response = await fetch(endpoint, config);
    if (response.ok) {
      if(response.headers.get('content-length') === '0') return { ok: true };
      data = await response.json();
      return data;
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error(`${response.status}`);
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(err);
  }
};
