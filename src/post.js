const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const rootPath = process.env.STATE_root_path;

if (!rootPath) {
  console.log('setup-alpine: no root path recorded, skipping cleanup');
  process.exit(0);
}

const destroyPath = path.join(rootPath, 'destroy.sh');

if (!fs.existsSync(destroyPath)) {
  console.log(`setup-alpine: cleanup script not found at ${destroyPath}, skipping cleanup`);
  process.exit(0);
}

const result = spawnSync('sudo', [destroyPath], {
  stdio: 'inherit',
});

if (result.error) {
  console.error(`setup-alpine: failed to start cleanup script: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
