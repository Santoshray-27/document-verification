import React from 'react';
import { getVerdictStyle } from '../lib/verdicts';

const VerdictBadge = ({ verdict, className = '' }) => {
  const { color, icon, label } = getVerdictStyle(verdict);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${color} ${className}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default VerdictBadge;
