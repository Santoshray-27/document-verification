import React, { useState } from 'react';
import { client } from '../../api/client';
import { useSSE } from '../../hooks/useSSE';
import FileDropzone from '../../components/FileDropzone';
import QRScanner from '../../components/QRScanner';
import StepTracker from '../../components/StepTracker';
import ProgressBar from '../../components/ProgressBar';
import VerdictBadge from '../../components/VerdictBadge';
import { triggerToast } from '../../components/Toast';

const Verify = () => {
  const [inputMode, setInputMode] = useState('upload');
  const [manualId, setManualId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { events, result, isFinished, startStream, stopStream } = useSSE();
  
  const submitVerification = async (payload) => {
    if (submitting) return;
    setSubmitting(true);
    stopStream();
    
    try {
      const res = await client('/api/verify', {
        method: 'POST',
        body: payload
      });
      startStream(`/api/verify/${res.jobId}/events`);
    } catch (err) {
      triggerToast(err.message, 'error');
      setSubmitting(false);
    }
  };

  const handleFile = (file) => submitVerification({ type: 'file', name: file.name });
  const handleQR = (qrData) => submitVerification({ type: 'qr', data: qrData });
  const handleManualId = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    submitVerification({ type: 'id', id: manualId.trim() });
  };

  const reset = () => {
    setSubmitting(false);
    stopStream();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Verify Document</h1>
      
      {!submitting && !isFinished ? (
        <div className="bg-white p-6 border rounded shadow-sm">
          <div className="flex border-b mb-6">
            <button 
              className={`pb-2 px-4 font-medium transition-colors ${inputMode === 'upload' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setInputMode('upload')}
            >
              Upload File
            </button>
            <button 
              className={`pb-2 px-4 font-medium transition-colors ${inputMode === 'qr' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setInputMode('qr')}
            >
              Scan QR
            </button>
            <button 
              className={`pb-2 px-4 font-medium transition-colors ${inputMode === 'id' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setInputMode('id')}
            >
              Manual ID
            </button>
          </div>

          {inputMode === 'upload' && <FileDropzone onFileSelect={handleFile} />}
          {inputMode === 'qr' && <QRScanner onScan={handleQR} />}
          {inputMode === 'id' && (
            <form onSubmit={handleManualId} className="flex gap-4 max-w-md mx-auto py-8">
              <input 
                type="text" 
                placeholder="Enter Document ID or Link" 
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors">Verify</button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Verification Progress</h2>
              {isFinished && <button onClick={reset} className="text-sm text-blue-600 hover:underline font-medium">Verify Another</button>}
            </div>
            <ProgressBar events={events} totalSteps={13} />
            <StepTracker events={events} />
          </div>
          
          {isFinished && result && (
            <div className="bg-white border rounded shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Verification Result</h2>
                <VerdictBadge verdict={result.verdict} className="text-lg px-4 py-2" />
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700 font-medium">{result.summary}</p>
                {result.document && (
                  <div className="bg-gray-50 p-4 rounded border text-sm text-gray-600 space-y-2">
                    <p><strong className="text-gray-800">Document ID:</strong> {result.document.docId}</p>
                    <p><strong className="text-gray-800">SHA-256:</strong> <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">{result.document.sha256}</span></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;
