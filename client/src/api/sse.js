import { VITE_MOCK } from './client';

export const createSSEConnection = (endpoint, onMessage, onError, onComplete) => {
  if (VITE_MOCK) {
    console.log(`[MOCK SSE] Subscribing to ${endpoint}`);
    let stepCount = 0;
    const steps = [
      { type: "step", id: 1, status: "done", label: "receive", detail: "Payload received", ms: 100 },
      { type: "step", id: 2, status: "done", label: "qr", detail: "QR read", ms: 100 },
      { type: "step", id: 3, status: "done", label: "signature", detail: "Signature valid", ms: 150 },
    ];
    
    const interval = setInterval(() => {
      if (stepCount < steps.length) {
        onMessage(steps[stepCount]);
        stepCount++;
      } else {
        clearInterval(interval);
        onMessage({ type: "done", result: { verdict: "GENUINE", confidence: { level: "high", score: 0.99 } } });
        if (onComplete) onComplete();
      }
    }, 500);

    return () => {
      console.log(`[MOCK SSE] Unsubscribing from ${endpoint}`);
      clearInterval(interval);
    };
  }

  const eventSource = new EventSource(endpoint, { withCredentials: true });
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
    if (data.type === 'done') {
      eventSource.close();
      if (onComplete) onComplete();
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
};
