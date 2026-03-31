const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function runCommand(command) {
  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return null;
  }
}

function parseCPU(raw) {
  if (!raw) return null;
  const lines = raw.split('\n').filter(line => line.trim());
  // Skip header line "Name"
  return lines.length > 1 ? lines[1].trim() : null;
}

function parseGPU(raw) {
  if (!raw) return [];
  const lines = raw.split('\n').filter(line => line.trim());
  // Skip header line "Name"
  return lines.slice(1).map(line => line.trim()).filter(Boolean);
}

function parseRAM(raw) {
  if (!raw) return null;
  const lines = raw.split('\n').filter(line => line.trim());
  if (lines.length > 1) {
    const bytes = parseInt(lines[1].trim(), 10);
    const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
    return `${gb} GB`;
  }
  return null;
}

async function scanSystem() {
  const [cpuRaw, gpuRaw, ramRaw] = await Promise.all([
    runCommand('wmic cpu get name'),
    runCommand('wmic path win32_VideoController get name'),
    runCommand('wmic computersystem get totalphysicalmemory'),
  ]);

  return {
    cpu: parseCPU(cpuRaw),
    gpu: parseGPU(gpuRaw),
    ram: parseRAM(ramRaw),
  };
}

module.exports = { scanSystem };
