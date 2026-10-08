import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client } from '../../api/client';
import Skeleton from '../../components/Skeleton';
import VerdictBadge from '../../components/VerdictBadge';

const PublicVerify = () => {
  const { docId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client(`/api/public/verify/${docId}`)
      .then(res => setResult(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [docId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">Agnitia Verify</Link>
          <p className="text-gray-500 mt-2">Checking authenticity of document ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{docId}</span></p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-6">
              <Skeleton className="h-10 w-1/3 mx-auto" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="bg-red-50 text-red-700 p-6 rounded border border-red-200">
                <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2"><span>⚠️</span> Verification Error</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : result ? (
            <>
              <div className="p-10 text-center border-b bg-gray-50">
                <VerdictBadge verdict={result.verdict} className="text-2xl px-8 py-3 shadow-sm" />
              </div>
              <div className="p-8 text-center space-y-6">
                <p className="text-lg text-gray-700 font-medium">{result.summary}</p>
                
                {result.verdict === 'UNVERIFIABLE' && (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200 text-sm text-left shadow-sm">
                    <strong>Note:</strong> A document is marked as <em>UNVERIFIABLE</em> if its cryptographic issuer is not registered in the trusted directory. This does not strictly mean it is a fake, only that its origin cannot be cryptographically proven.
                  </div>
                )}
                
                <div className="pt-8 border-t mt-8">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Secured by Agnitia Tamper-Evident Verification
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
        
        <div className="mt-8 text-center">
           <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Staff Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicVerify;
