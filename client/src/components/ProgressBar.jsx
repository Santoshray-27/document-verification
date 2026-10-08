import React from 'react';

const ProgressBar = ({ events = [], totalSteps = 13 }) => {
  const completed = events.filter(e => e.status === 'done' || e.status === 'skipped' || e.status === 'fail' || e.status === 'warn').length;
  const progress = Math.min(100, Math.round((completed / totalSteps) * 100));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
