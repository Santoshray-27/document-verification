import React from 'react';

const colors = {
  'GENUINE': 'bg-green-100 text-green-800 border-green-200',
  'GENUINE COPY': 'bg-green-50 text-green-700 border-green-200',
  'ALTERED': 'bg-red-100 text-red-800 border-red-200',
  'FORGED': 'bg-red-100 text-red-800 border-red-200',
  'UNVERIFIABLE': 'bg-gray-100 text-gray-800 border-gray-200',
  'REVOKED': 'bg-orange-100 text-orange-800 border-orange-200',
  'EXPIRED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const VerdictBadge = ({ verdict, className = '' }) => {
  const style = colors[verdict] || colors['UNVERIFIABLE'];
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${style} ${className}`}>
      {verdict}
    </span>
  );
};

export default VerdictBadge;
