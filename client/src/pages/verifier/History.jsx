import React, { useState } from 'react';
import { client } from '../../api/client';
import ResultCard from '../../components/ResultCard';
import Skeleton from '../../components/Skeleton';
import { triggerToast } from '../../components/Toast';

const History = () => {
  const [verificationId, setVerificationId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!verificationId.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await client(`/api/verify/${verificationId.trim()}`);
      setResult(res);
    } catch (err) {
      triggerToast(`Could not find verification: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Verification History</h1>
      
      <div className="bg-white p-6 border rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Lookup Past Verification</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Enter Verification ID"
            value={verificationId}
            onChange={e => setVerificationId(e.target.value)}
            className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Lookup'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!loading && result && (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
};

export default History;
