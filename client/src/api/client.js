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
