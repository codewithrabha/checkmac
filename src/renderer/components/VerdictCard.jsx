import React from 'react';

const verdictConfig = {
  supported: {
    title: 'Compatible',
    bgColor: 'bg-[#0e7a0d]',
    borderColor: 'border-[#1a9e1a]',
    iconBg: 'bg-[#1a9e1a]',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    title: 'Compatible with tweaks',
    bgColor: 'bg-[#9d5d00]',
    borderColor: 'border-[#c77c00]',
    iconBg: 'bg-[#c77c00]',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  not_supported: {
    title: 'Not Compatible',
    bgColor: 'bg-[#a4262c]',
    borderColor: 'border-[#d13438]',
    iconBg: 'bg-[#d13438]',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

function VerdictCard({ results }) {
  const hasNvidia = results.gpu?.some(g =>
    g.toLowerCase().includes('nvidia') || g.toLowerCase().includes('geforce')
  );

  const hasIntelGraphics = results.gpu?.some(g =>
    g.toLowerCase().includes('intel')
  );

  const hasAMDGraphics = results.gpu?.some(g =>
    g.toLowerCase().includes('radeon')
  );

  let verdict = 'supported';
  let message = 'Your hardware is compatible with macOS. You can proceed with OpenCore installation.';

  if (hasNvidia && !hasIntelGraphics && !hasAMDGraphics) {
    verdict = 'not_supported';
    message = 'NVIDIA GPUs are not supported in modern macOS (Monterey+). An Intel iGPU or AMD GPU is required.';
  } else if (hasNvidia && (hasIntelGraphics || hasAMDGraphics)) {
    verdict = 'warning';
    message = 'NVIDIA GPU detected, but a compatible GPU is available. You can use macOS with the Intel/AMD graphics while disabling the NVIDIA card.';
  }

  const config = verdictConfig[verdict];

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-5`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white mb-1">
            {config.title}
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerdictCard;
