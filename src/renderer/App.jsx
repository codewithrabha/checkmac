import React, { useState, useEffect } from "react";
import HardwareCard from "./components/HardwareCard";
import VerdictCard from "./components/VerdictCard";
import Header from "./components/Header";
import ScanButton from "./components/ScanButton";
import packageInfo from "../../package.json";
import avatarImg from "./assets/avatar.jpg";

function App() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCredits(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
            <h2 className="text-xl font-semibold mb-2">Ready to Scan?</h2>
            <p className="text-[#888] text-sm mb-8 text-center max-w-md">
              Check your system's hardware compatibility with macOS and
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
        <span className="flex items-center gap-2">
          <span>CheckMac v{packageInfo.version}</span>
          <a className="text-[#0078d4] hover:text-[#0078d4]/80 transition-colors" href="https://github.com/codewithrabha/checkmac" target="_blank" rel="noreferrer">On GitHub</a>
          <span>•</span>
          <button onClick={() => setShowCredits(true)} className="text-[#0078d4] hover:text-[#0078d4]/80 transition-colors cursor-pointer focus:outline-none">Credits</button>
        </span>

        <span>
          <a className="text-[#0078d4] hover:text-[#0078d4]/80 transition-colors" href="https://dortania.github.io/OpenCore-Install-Guide/" target="_blank" rel="noreferrer">
            OpenCore
          </a>
          {' '}Compatibility Checker
        </span>
      </footer>

      {/* Credits Dialog */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#3d3d3d] rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowCredits(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#e4e4e4] transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <img src={avatarImg} alt="Abhijit Rabha" className="w-24 h-24 rounded-full border-2 border-[#0078d4] mb-4 object-cover" />
              <h3 className="text-xl font-bold mb-1">Abhijit Rabha</h3>
              <p className="text-[#888] text-sm mb-5">Creator & Developer</p>
              
              <div className="bg-[#2d2d2d] rounded-lg p-4 mb-6 border border-[#3d3d3d]">
                <p className="text-sm text-[#e4e4e4] leading-relaxed">
                  Thank you for using CheckMac! If you find this tool helpful in your Hackintosh journey, please consider giving it a star on GitHub.
                </p>
              </div>
              
              <a 
                href="https://github.com/codewithrabha/checkmac" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0078d4] hover:bg-[#0078d4]/90 rounded-lg transition-colors font-medium text-sm text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
