const { spawnSync } = require('node:child_process');
const path = require('node:path');

const inputNames = {
  'apk-tools-url': 'INPUT_APK_TOOLS_URL',
  arch: 'INPUT_ARCH',
  branch: 'INPUT_BRANCH',
  'extra-keys': 'INPUT_EXTRA_KEYS',
  'extra-repositories': 'INPUT_EXTRA_REPOSITORIES',
  'mirror-url': 'INPUT_MIRROR_URL',
  packages: 'INPUT_PACKAGES',
  'setup-qemu': 'INPUT_SETUP_QEMU',
  'shell-name': 'INPUT_SHELL_NAME',
  volumes: 'INPUT_VOLUMES',
};

function getInput(name) {
  const envName = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
  return process.env[envName] || '';
}

const actionPath = path.resolve(__dirname, '..');
const env = { ...process.env };

for (const [inputName, scriptEnvName] of Object.entries(inputNames)) {
  env[scriptEnvName] = getInput(inputName);
}

const result = spawnSync('sudo', ['-E', path.join(actionPath, 'setup-alpine.sh')], {
  cwd: actionPath,
  env,
  stdio: 'inherit',
});

if (result.error) {
  console.error(`setup-alpine: failed to start setup script: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
