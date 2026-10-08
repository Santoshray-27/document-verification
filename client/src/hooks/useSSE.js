import { useEffect, useState, useCallback } from 'react';
import { createSSEConnection } from '../api/sse';

export const useSSE = () => {
  const [events, setEvents] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeEndpoint, setActiveEndpoint] = useState(null);

  useEffect(() => {
    if (!activeEndpoint) return;
    
    setEvents([]);
    setIsFinished(false);
    setError(null);
    setResult(null);

    const unsubscribe = createSSEConnection(
      activeEndpoint,
      (data) => {
        if (data.type === 'step') {
          setEvents(prev => [...prev, data]);
        } else if (data.type === 'done') {
          setResult(data.result);
        }
      },
      (err) => setError(err),
      () => setIsFinished(true)
    );

    return () => {
      unsubscribe();
    };
  }, [activeEndpoint]);

  const startStream = useCallback((endpoint) => {
    setActiveEndpoint(endpoint);
  }, []);

  const stopStream = useCallback(() => {
    setActiveEndpoint(null);
  }, []);

  return { events, isFinished, error, result, startStream, stopStream };
};
