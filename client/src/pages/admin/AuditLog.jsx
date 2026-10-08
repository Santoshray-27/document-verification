import React, { useState, useEffect } from 'react';
import { client } from '../../api/client';
import AuditTable from '../../components/AuditTable';
import { triggerToast } from '../../components/Toast';

const AuditLog = () => {
  const [data, setData] = useState({ entries: [], integrity: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client('/api/audit')
      .then(res => setData(res))
      .catch(err => triggerToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cryptographic Audit Log</h1>
        <p className="text-sm text-gray-600 max-w-3xl">
          This log provides a tamper-evident, hash-chained record of all critical system actions. 
          The integrity check continuously verifies that no past records have been altered or deleted.
        </p>
      </div>

      <div className="bg-white p-4 border rounded shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-700">Integrity Status</h2>
          <p className="text-sm text-gray-500">Hash chain validation state</p>
        </div>
        <div>
          {loading ? (
            <span className="text-gray-400 font-medium">Verifying...</span>
          ) : data.integrity !== false ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <span className="mr-1">✅</span> Chain Intact
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <span className="mr-1">⚠️</span> Chain Broken
            </span>
          )}
        </div>
      </div>

      <AuditTable entries={data.entries} integrity={data.integrity} loading={loading} />
    </div>
  );
};

export default AuditLog;
