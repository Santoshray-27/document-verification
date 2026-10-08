import React, { useState, useEffect } from 'react';
import { client } from '../../api/client';
import { useSSE } from '../../hooks/useSSE';
import IssuerForm from '../../components/IssuerForm';
import StepTracker from '../../components/StepTracker';
import ProgressBar from '../../components/ProgressBar';
import Skeleton from '../../components/Skeleton';
import { triggerToast } from '../../components/Toast';
import { Link } from 'react-router-dom';

const IssueDocument = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { events, result, isFinished, startStream } = useSSE();
  
  useEffect(() => {
    client('/api/templates')
      .then(res => {
        setTemplates(res.templates);
        if (res.templates.length > 0) setSelectedTemplateId(res.templates[0].id);
      })
      .catch(err => triggerToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleSubmit = async (fields) => {
    setSubmitting(true);
    try {
      const res = await client('/api/issue', {
        method: 'POST',
        body: { templateId: selectedTemplateId, fields }
      });
      startStream(`/api/issue/${res.jobId}/events`);
    } catch (err) {
      triggerToast(err.message, 'error');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-96" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Issue New Document</h1>
      
      {!submitting && !isFinished ? (
        <>
          <div className="bg-white p-4 rounded border shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
            <select 
              value={selectedTemplateId} 
              onChange={e => setSelectedTemplateId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <IssuerForm 
            template={selectedTemplate} 
            onSubmit={handleSubmit} 
            disabled={submitting} 
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 border rounded shadow-sm">
            <h2 className="text-xl font-bold mb-4">Issuance Progress</h2>
            <ProgressBar events={events} totalSteps={3} />
            <StepTracker events={events} />
          </div>
          
          {isFinished && result && (
            <div className="bg-green-50 border border-green-200 p-6 rounded shadow-sm text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Document Issued Successfully!</h2>
              <p className="text-green-700 mb-4">Verdict: {result.verdict}</p>
              <div className="flex justify-center gap-4">
                <Link to="/issuer/documents" className="bg-white border text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">View My Documents</Link>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Print / Download</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueDocument;
