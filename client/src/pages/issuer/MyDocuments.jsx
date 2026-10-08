import React, { useState, useEffect } from 'react';
import { client } from '../../api/client';
import Skeleton from '../../components/Skeleton';
import VerdictBadge from '../../components/VerdictBadge';
import { triggerToast } from '../../components/Toast';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const fetchDocs = () => {
    client('/api/documents/me')
      .then(res => setDocuments(res.documents || []))
      .catch(err => triggerToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleRevoke = async (docId) => {
    if (!window.confirm(`Are you sure you want to revoke document ${docId}? This action cannot be undone.`)) return;
    
    setRevokingId(docId);
    try {
      await client(`/api/revoke/${docId}`, { method: 'POST', body: { reason: 'Issuer requested revocation' } });
      triggerToast('Document successfully revoked', 'success');
      fetchDocs();
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-10" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
      
      <div className="bg-white rounded shadow-sm border overflow-hidden">
        {documents.length === 0 ? (
          <p className="p-4 text-gray-500">No documents found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Document ID</th>
                  <th className="px-4 py-3">Template</th>
                  <th className="px-4 py-3">Issued At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{doc.id}</td>
                    <td className="px-4 py-3">{doc.templateId}</td>
                    <td className="px-4 py-3">{new Date(doc.issuedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><VerdictBadge verdict={doc.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {doc.status !== 'REVOKED' && (
                        <button
                          onClick={() => handleRevoke(doc.id)}
                          disabled={revokingId === doc.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 font-medium"
                        >
                          {revokingId === doc.id ? 'Revoking...' : 'Revoke'}
                        </button>
                      )}
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

export default MyDocuments;
