export const VITE_MOCK = true;

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
