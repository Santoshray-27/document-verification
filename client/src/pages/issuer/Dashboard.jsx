import React, { useEffect, useState } from 'react';
import { client } from '../../api/client';
import Skeleton from '../../components/Skeleton';
import VerdictBadge from '../../components/VerdictBadge';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client('/api/documents/me')
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200">Error loading dashboard: {error}</div>;

  const total = data?.documents?.length || 0;
  const genuine = data?.documents?.filter(d => d.status === 'GENUINE').length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Issuer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium mb-1">Total Issued</h3>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium mb-1">Genuine Status</h3>
          <p className="text-3xl font-bold text-green-600">{genuine}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50"><h2 className="font-semibold text-gray-700">Recent Documents</h2></div>
        {total === 0 ? (
          <p className="p-4 text-gray-500">No documents issued yet.</p>
        ) : (
          <ul className="divide-y">
            {data.documents.slice(0, 5).map(doc => (
              <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{doc.templateId}</p>
                  <p className="text-xs text-gray-500">ID: {doc.id} • {new Date(doc.issuedAt).toLocaleDateString()}</p>
                </div>
                <VerdictBadge verdict={doc.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
