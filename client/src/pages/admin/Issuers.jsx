import React, { useState, useEffect } from 'react';
import { client } from '../../api/client';
import Skeleton from '../../components/Skeleton';
import { triggerToast } from '../../components/Toast';

const Issuers = () => {
  const [issuers, setIssuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIssuerName, setNewIssuerName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchIssuers = () => {
    client('/api/issuers')
      .then(res => setIssuers(res.issuers || []))
      .catch(err => triggerToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIssuers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newIssuerName.trim()) return;
    setCreating(true);
    try {
      await client('/api/issuers', { method: 'POST', body: { name: newIssuerName } });
      triggerToast('Issuer created successfully', 'success');
      setNewIssuerName('');
      fetchIssuers();
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Issuers</h1>
      
      <div className="bg-white p-6 rounded shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Register New Issuer</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Issuer Organization Name"
            value={newIssuerName}
            onChange={e => setNewIssuerName(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <button 
            type="submit" 
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Register Issuer'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : issuers.length === 0 ? (
          <p className="p-4 text-gray-500">No issuers registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">DID</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {issuers.map(issuer => (
                  <tr key={issuer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{issuer.id}</td>
                    <td className="px-4 py-3 font-medium">{issuer.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{issuer.did || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${issuer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {issuer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Issuers;
