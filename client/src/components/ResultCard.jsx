import React, { useState, useEffect } from 'react';
import VerdictBadge from './VerdictBadge';
import { formatBytes, formatDate } from '../lib/format';
import HeatmapViewer from './HeatmapViewer';
import { client } from '../api/client';
import Skeleton from './Skeleton';
import { triggerToast } from './Toast';

const ResultCard = ({ result }) => {
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!result?.verificationId) return;
    
    client(`/api/verify/${result.verificationId}/evidence`)
      .then(res => setEvidence(res))
      .catch(err => triggerToast(`Failed to load evidence: ${err.message}`, 'error'))
      .finally(() => setLoading(false));
  }, [result]);

  if (!result) return null;

  const copyLink = () => {
    const url = `${window.location.origin}/public/verify/${result.document?.docId || result.verificationId}`;
    navigator.clipboard.writeText(url);
    triggerToast('Verification link copied to clipboard', 'success');
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Banner */}
      <div className="bg-white border rounded shadow-sm overflow-hidden print:shadow-none print:border-none">
        <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Result</h2>
            <p className="text-sm text-gray-500 font-mono">ID: {result.verificationId}</p>
          </div>
          <VerdictBadge verdict={result.verdict} className="text-xl px-6 py-2 shadow-sm" />
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-lg text-gray-700 font-medium">{result.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded border text-sm text-gray-600 space-y-2">
              <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Document Metadata</h3>
              {result.document ? (
                <>
                  <p><span className="font-semibold">Doc ID:</span> <span className="font-mono bg-white px-1 border rounded">{result.document.docId}</span></p>
                  <p><span className="font-semibold">Name:</span> {result.document.name}</p>
                  <p><span className="font-semibold">Size:</span> {formatBytes(result.document.size)}</p>
                  <p><span className="font-semibold">SHA-256:</span> <span className="font-mono text-xs bg-white border px-1 py-0.5 rounded break-all">{result.document.sha256}</span></p>
                </>
              ) : (
                <p className="text-gray-400 italic">No document metadata available.</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded border text-sm text-gray-600 space-y-2">
              <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Verification Details</h3>
              {result.confidence && (
                <p><span className="font-semibold">Confidence:</span> <span className="capitalize">{result.confidence.level}</span> ({Math.round(result.confidence.score * 100)}%)</p>
              )}
              {result.timestamps && (
                <>
                  <p><span className="font-semibold">Started:</span> {formatDate(result.timestamps.startedAt)}</p>
                  <p><span className="font-semibold">Completed:</span> {formatDate(result.timestamps.completedAt)}</p>
                </>
              )}
            </div>
          </div>

          {result.changedFields && result.changedFields.length > 0 && (
            <div className="mt-6 border rounded overflow-hidden">
              <div className="bg-red-50 border-b border-red-100 p-3">
                <h3 className="font-bold text-red-800 flex items-center gap-2"><span>⚠️</span> Detected Data Changes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Field</th>
                      <th className="px-4 py-3 font-medium text-red-600">Altered Value (Found)</th>
                      <th className="px-4 py-3 font-medium text-green-600">Original Value (Expected)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {result.changedFields.map((field, idx) => (
                      <tr key={idx} className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">{field.field}</td>
                        <td className="px-4 py-3 text-red-700 font-medium bg-red-50/50">{field.altered}</td>
                        <td className="px-4 py-3 text-green-700 font-medium bg-green-50/50">{field.original}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.aiNotes && (
            <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm shadow-sm">
              <div className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                <span>🤖</span> AI-Assisted Analysis Note
              </div>
              <p className="text-blue-900 leading-relaxed">{result.aiNotes}</p>
              <div className="mt-3 pt-3 border-t border-blue-200/50">
                <p className="text-xs text-blue-700 font-medium opacity-80 uppercase tracking-wide">
                  Disclaimer: AI is used for heuristic analysis only and does not make final determinative decisions.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-4 justify-end print:hidden">
          <button onClick={copyLink} className="text-gray-600 bg-white border hover:bg-gray-50 font-medium px-4 py-2 rounded transition-colors text-sm shadow-sm">
            Copy Link
          </button>
          <button onClick={handleDownload} className="bg-gray-800 text-white hover:bg-gray-700 font-medium px-4 py-2 rounded transition-colors text-sm shadow-sm">
            Download Report
          </button>
        </div>
      </div>

      {/* Heatmap Evidence */}
      {!loading && evidence?.regions && evidence.regions.length > 0 && (
        <HeatmapViewer regions={evidence.regions} heatmapUrl={evidence.heatmapUrl} />
      )}

      {/* Check-by-check Evidence List */}
      <div className="bg-white border rounded shadow-sm overflow-hidden print:shadow-none print:border-gray-300">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800">Evidence & Checks</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
          ) : evidence?.checks && evidence.checks.length > 0 ? (
            <div className="space-y-4">
              {evidence.checks.map(check => (
                <div key={check.id} className={`p-4 border rounded flex items-start gap-3 ${check.status === 'fail' ? 'bg-red-50 border-red-200' : check.status === 'warn' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <span className="text-xl mt-0.5">
                    {check.status === 'fail' ? '❌' : check.status === 'warn' ? '⚠️' : '✅'}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold ${check.status === 'fail' ? 'text-red-800' : check.status === 'warn' ? 'text-yellow-800' : 'text-green-800'}`}>
                        {check.label}
                      </h4>
                      <span className="text-xs font-mono uppercase bg-white px-2 py-0.5 rounded shadow-sm text-gray-500 border border-black/10">
                        {check.category}
                      </span>
                    </div>
                    <p className={`text-sm ${check.status === 'fail' ? 'text-red-700' : check.status === 'warn' ? 'text-yellow-700' : 'text-green-700'}`}>
                      {check.detail}
                    </p>
                    {check.evidence && (
                      <p className="mt-2 text-xs font-mono p-2 bg-white/50 rounded border border-black/5 break-all text-gray-700">
                        {check.evidence}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No detailed checks available for this verification.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ResultCard;
