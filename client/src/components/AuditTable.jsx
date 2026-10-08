import React from 'react';
import Skeleton from './Skeleton';

const AuditTable = ({ entries, integrity, loading }) => {
  if (loading) return <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;

  if (!entries || entries.length === 0) return <p className="text-gray-500 bg-white p-4 rounded border">No audit log entries found.</p>;

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden">
      {integrity === false && (
        <div className="bg-red-100 text-red-800 p-3 font-bold border-b border-red-200">
          ⚠️ Tamper Evidence Detected! The hash chain is broken or validation failed.
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{entry.action}</td>
                <td className="px-4 py-3 text-gray-600">{entry.actor}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={entry.details}>{entry.details}</td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono max-w-[120px] truncate" title={entry.hash}>{entry.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTable;
