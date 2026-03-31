import React from 'react';

function Header() {
  return (
    <header className="px-6 py-4 border-b border-[#2d2d2d] flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#0078d4] flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </div>
      <div>
        <h1 className="text-sm font-semibold">CheckMac</h1>
        <p className="text-xs text-[#888]">OpenCore Hardware Compatibility Checker</p>
      </div>
    </header>
  );
}

export default Header;
