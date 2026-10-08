import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('🚀 Starting College Event Management (Client + Server + Database)...');
console.log('─────────────────────────────────────────────────────────────────');

// 1. Start Server Process
const serverProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

serverProc.stdout.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  lines.forEach(line => console.log(`\x1b[36m[SERVER]\x1b[0m ${line}`));
});

serverProc.stderr.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  lines.forEach(line => console.error(`\x1b[31m[SERVER-ERR]\x1b[0m ${line}`));
});

// 2. Start Client Process
const clientProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

clientProc.stdout.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  lines.forEach(line => console.log(`\x1b[32m[CLIENT]\x1b[0m ${line}`));
});

clientProc.stderr.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  lines.forEach(line => console.error(`\x1b[33m[CLIENT-ERR]\x1b[0m ${line}`));
});

function cleanup() {
  console.log('\n🛑 Shutting down server and client services...');
  try {
    if (isWin) {
      if (serverProc.pid) spawn('taskkill', ['/pid', serverProc.pid.toString(), '/f', '/t']);
      if (clientProc.pid) spawn('taskkill', ['/pid', clientProc.pid.toString(), '/f', '/t']);
    } else {
      serverProc.kill('SIGTERM');
      clientProc.kill('SIGTERM');
    }
  } catch {
    // Ignore cleanup error
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
