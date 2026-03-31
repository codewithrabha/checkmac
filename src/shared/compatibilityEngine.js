const rules = require('./rules.json');

function evaluateCPU(cpuName) {
  if (!cpuName) {
    return { status: 'fail', reason: 'CPU not detected' };
  }

  const cpuLower = cpuName.toLowerCase();

  // Check for blocked keywords first
  for (const blocked of rules.cpu.intel.blocked_keywords) {
    if (cpuLower.includes(blocked.toLowerCase())) {
      return { status: 'fail', reason: `${blocked} CPUs are not supported for macOS` };
    }
  }

  for (const blocked of rules.cpu.amd.blocked_keywords) {
    if (cpuLower.includes(blocked.toLowerCase())) {
      return { status: 'fail', reason: `${blocked} CPUs are not supported for macOS` };
    }
  }

  // Check Intel
  if (cpuLower.includes('intel')) {
    // Check for supported patterns
    const hasSupported = rules.cpu.intel.supported_patterns.some(p =>
      cpuLower.includes(p.toLowerCase())
    );

    if (hasSupported) {
      // Check for warning keywords (like F suffix - no iGPU)
      for (const warn of rules.cpu.intel.warning_keywords) {
        if (cpuName.includes(warn)) {
          return {
            status: 'warning',
            reason: `${warn}-suffix CPU detected - no integrated graphics, requires compatible dGPU`
          };
        }
      }
      return { status: 'ok', reason: 'Intel Core CPU supported' };
    }
  }

  // Check AMD
  if (cpuLower.includes('amd')) {
    const hasSupported = rules.cpu.amd.supported_patterns.some(p =>
      cpuLower.includes(p.toLowerCase())
    );

    if (hasSupported) {
      return {
        status: 'warning',
        reason: 'AMD Ryzen requires additional patches but is supported'
      };
    }
  }

  return { status: 'warning', reason: 'CPU compatibility uncertain - manual verification recommended' };
}

function evaluateGPU(gpuList) {
  if (!gpuList || gpuList.length === 0) {
    return { status: 'fail', reason: 'No GPU detected' };
  }

  const results = [];

  for (const gpu of gpuList) {
    const gpuLower = gpu.toLowerCase();

    // Check unsupported
    const isUnsupported = rules.gpu.unsupported.some(p =>
      gpuLower.includes(p.toLowerCase())
    );
    if (isUnsupported) {
      results.push({ gpu, status: 'fail', reason: 'NVIDIA GPUs are not supported in modern macOS' });
      continue;
    }

    // Check supported
    const isSupported = rules.gpu.supported.some(p =>
      gpuLower.includes(p.toLowerCase())
    );
    if (isSupported) {
      results.push({ gpu, status: 'ok', reason: 'GPU is compatible with macOS' });
      continue;
    }

    // Check warning
    const isWarning = rules.gpu.warning.some(p =>
      gpuLower.includes(p.toLowerCase())
    );
    if (isWarning) {
      results.push({ gpu, status: 'warning', reason: 'GPU may require additional configuration' });
      continue;
    }

    results.push({ gpu, status: 'warning', reason: 'GPU compatibility uncertain' });
  }

  // Determine overall GPU status
  const hasOk = results.some(r => r.status === 'ok');
  const allFail = results.every(r => r.status === 'fail');

  if (allFail) {
    return {
      status: 'fail',
      reason: 'No compatible GPU found',
      details: results
    };
  }

  if (hasOk) {
    return {
      status: 'ok',
      reason: 'Compatible GPU available',
      details: results
    };
  }

  return {
    status: 'warning',
    reason: 'GPU compatibility needs verification',
    details: results
  };
}

function evaluateRAM(ramString) {
  if (!ramString) {
    return { status: 'warning', reason: 'RAM not detected' };
  }

  const gbMatch = ramString.match(/([\d.]+)\s*GB/i);
  if (gbMatch) {
    const gb = parseFloat(gbMatch[1]);
    if (gb >= 8) {
      return { status: 'ok', reason: `${gb} GB RAM is sufficient` };
    } else if (gb >= 4) {
      return { status: 'warning', reason: `${gb} GB RAM is minimum, 8GB+ recommended` };
    } else {
      return { status: 'fail', reason: `${gb} GB RAM is insufficient for macOS` };
    }
  }

  return { status: 'warning', reason: 'Could not parse RAM amount' };
}

function getVerdict(cpuResult, gpuResult, ramResult) {
  const statuses = [cpuResult.status, gpuResult.status, ramResult.status];

  if (statuses.includes('fail')) {
    return {
      verdict: 'not_supported',
      message: 'Your system is not compatible with macOS',
      icon: 'fail'
    };
  }

  if (statuses.includes('warning')) {
    return {
      verdict: 'warning',
      message: 'Your system can run macOS with some tweaks',
      icon: 'warning'
    };
  }

  return {
    verdict: 'supported',
    message: 'Your system is compatible with macOS!',
    icon: 'ok'
  };
}

function analyzeSystem(systemInfo) {
  const cpuResult = evaluateCPU(systemInfo.cpu);
  const gpuResult = evaluateGPU(systemInfo.gpu);
  const ramResult = evaluateRAM(systemInfo.ram);
  const verdict = getVerdict(cpuResult, gpuResult, ramResult);

  return {
    cpu: cpuResult,
    gpu: gpuResult,
    ram: ramResult,
    verdict,
    systemInfo
  };
}

module.exports = { analyzeSystem, evaluateCPU, evaluateGPU, evaluateRAM, getVerdict };
