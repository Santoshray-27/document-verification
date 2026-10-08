import React from 'react';

const StepTracker = ({ events = [] }) => {
  if (!events.length) return null;

  return (
    <div className="bg-white border rounded p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Verification Steps</h3>
      <ul className="space-y-2">
        {events.map((ev, i) => {
          let statusColor = 'text-gray-500';
          let statusIcon = '⏳';
          if (ev.status === 'done') { statusColor = 'text-green-600'; statusIcon = '✅'; }
          if (ev.status === 'warn') { statusColor = 'text-yellow-600'; statusIcon = '⚠️'; }
          if (ev.status === 'fail') { statusColor = 'text-red-600'; statusIcon = '❌'; }
          if (ev.status === 'skipped') { statusColor = 'text-gray-400'; statusIcon = '⏭️'; }
          if (ev.status === 'running') { statusColor = 'text-blue-600'; statusIcon = '🔄'; }

          return (
            <li key={i} className={`flex items-start text-sm ${statusColor}`}>
              <span className="mr-2">{statusIcon}</span>
              <div>
                <p className="font-medium">{ev.label}</p>
                {ev.detail && <p className="text-xs opacity-80">{ev.detail}</p>}
              </div>
              {ev.ms !== undefined && <span className="ml-auto text-xs opacity-50">{ev.ms}ms</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepTracker;
