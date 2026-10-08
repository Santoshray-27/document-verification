import React, { useEffect, useState, useRef } from 'react';

const QRScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Note: Since we are in mock mode and cannot install new packages,
    // this stubs the html5-qrcode interface.
    return () => {
      setScanning(false);
    };
  }, []);

  const handleSimulateScan = () => {
    onScan('mock-qr-payload-data');
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto min-h-[350px]">
      <div id="reader" className="w-full aspect-square border border-gray-600 rounded flex items-center justify-center mb-6 relative">
        <div className="absolute inset-4 border-2 border-green-500/50 rounded pointer-events-none">
          {/* Scanning crosshairs simulation */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
        </div>
        <p className="text-gray-400 font-medium">Camera Active</p>
      </div>
      
      <p className="mb-4 text-center text-sm text-gray-300">Point your camera at the Agnitia QR code.</p>
      
      <button 
        onClick={handleSimulateScan}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Simulate Successful Scan
      </button>
    </div>
  );
};

export default QRScanner;
