import React from 'react';

function ScanButton({ onClick, scanning, label = 'Start scan' }) {
  return (
    <button
      onClick={onClick}
      disabled={scanning}
      cursor-pointer
      className="px-6 py-2.5 bg-[#0078d4] hover:bg-[#106ebe] active:bg-[#005a9e] text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
    >
      {!scanning && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}
      {label}
    </button>
  );
}

export default ScanButton;
