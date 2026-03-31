import React, { useState } from "react";
import HardwareCard from "./components/HardwareCard";
import VerdictCard from "./components/VerdictCard";
import Header from "./components/Header";
import ScanButton from "./components/ScanButton";
import packageInfo from "../../package.json";

function App() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    setResults(null);

    try {
      const systemInfo = await window.electronAPI.scanSystem();

      if (systemInfo.error) {
        setError(systemInfo.error);
      } else {
        setResults(systemInfo);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e4e4e4] flex flex-col">
      {/* Title Bar Area */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Welcome State */}
        {!results && !scanning && !error && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#0078d4] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Ready to scan</h2>
            <p className="text-[#888] text-sm mb-8 text-center max-w-md">
              Analyze your hardware to check compatibility with macOS and
              OpenCore bootloader.
            </p>
            <ScanButton onClick={handleScan} scanning={scanning} />
          </div>
        )}

        {/* Scanning State */}
        {scanning && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#333]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#0078d4] border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-lg font-medium mb-2">Scanning hardware...</h2>
            <p className="text-[#888] text-sm">This will only take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 mb-6 rounded-full bg-[#c42b1c]/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#ff6b6b]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Scan failed</h2>
            <p className="text-[#888] text-sm mb-6 text-center max-w-md">
              {error}
            </p>
            <ScanButton
              onClick={handleScan}
              scanning={scanning}
              label="Try again"
            />
          </div>
        )}

        {/* Results State */}
        {results && !scanning && (
          <div className="max-w-2xl mx-auto">
            {/* Verdict at top */}
            <VerdictCard results={results} />

            {/* Hardware Details */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
                YourHardware Details
              </h3>
              <div className="bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] overflow-hidden">
                <HardwareCard
                  label="Processor"
                  value={results.cpu || "Not detected"}
                  icon="cpu"
                />
                <HardwareCard
                  label="Graphics"
                  value={results.gpu?.join(" • ") || "Not detected"}
                  icon="gpu"
                  border
                />
                <HardwareCard
                  label="Memory"
                  value={results.ram || "Not detected"}
                  icon="ram"
                  border
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setResults(null)}
                className="px-4 py-2 text-sm text-[#e4e4e4] bg-[#333] hover:bg-[#404040] border border-[#404040] rounded transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>
              <button
                onClick={handleScan}
                className="px-4 py-2 text-sm text-[#0078d4] hover:bg-[#0078d4]/10 rounded transition-colors"
              >
                Scan again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#2d2d2d] flex items-center justify-between text-xs text-[#666]">
        <span>CheckMac v{packageInfo.version}
        <a className="text-[#0078d4] hover:text-[#0078d4]/80 transition-colors" href="https://github.com/codewithrabha/checkmac" target="_blank">{} On GitHub</a>
        </span>

        <span>
          <a className="text-[#0078d4] hover:text-[#0078d4]/80 transition-colors" href="https://dortania.github.io/OpenCore-Install-Guide/" target="_blank">
            OpenCore {}
          </a>
          Compatibility Checker
        </span>
      </footer>
    </div>
  );
}

export default App;
