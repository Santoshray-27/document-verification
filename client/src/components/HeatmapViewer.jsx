import React, { useState } from 'react';

const HeatmapViewer = ({ regions = [], heatmapUrl }) => {
  const [opacity, setOpacity] = useState(70);

  if (!regions || regions.length === 0) return null;

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🔍</span> Visual Tamper Analysis
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-600 font-medium">Overlay Opacity:</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={opacity} 
            onChange={(e) => setOpacity(e.target.value)} 
            className="w-24 accent-red-600"
          />
          <span className="w-8 text-right text-gray-500 font-mono">{opacity}%</span>
        </div>
      </div>
      
      <div className="p-6 bg-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative border border-gray-300 rounded shadow-inner bg-white overflow-hidden w-full aspect-[1/1.414] max-h-[600px] mx-auto">
            {/* Mocking the safe uploaded file preview */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50 font-mono text-sm border-2 border-dashed border-gray-200 m-4">
              [Original Document Preview]
            </div>
            
            {/* Heatmap overlay */}
            {heatmapUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-200 mix-blend-multiply"
                style={{ 
                  backgroundImage: `url(${heatmapUrl})`,
                  opacity: opacity / 100 
                }}
              />
            )}
            
            {/* Region highlights */}
            {regions.map((region, i) => (
              <div 
                key={i}
                className="absolute border-2 border-red-500 bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.6)] cursor-help"
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.w}%`,
                  height: `${region.h}%`
                }}
                title={`Altered Region: ${region.label}`}
              >
                <span className="absolute -top-7 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow whitespace-nowrap font-bold">
                  {region.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-64 space-y-4 flex-shrink-0">
          <h4 className="font-semibold text-gray-700 border-b pb-2">Detected Regions</h4>
          <ul className="space-y-3">
            {regions.map((region, i) => (
              <li key={i} className="flex items-start gap-2 text-sm bg-white p-3 rounded shadow-sm border border-red-200">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <div>
                  <p className="font-bold text-gray-800 capitalize">{region.label}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">pos: {region.x}%, {region.y}%</p>
                  <p className="text-xs text-gray-500 font-mono">dim: {region.w}% x {region.h}%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeatmapViewer;
