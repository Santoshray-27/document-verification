import React, { useState, useEffect } from 'react';

export const triggerToast = (message, type = 'info') => {
  const event = new CustomEvent('agnitia-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('agnitia-toast', handleToast);
    return () => window.removeEventListener('agnitia-toast', handleToast);
  }, []);

  if (!toast) return null;

  const bg = toast.type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bg} text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-50`}>
      {toast.message}
    </div>
  );
};

export default Toast;
