// Runs automatically after `npm install` at the repo root.
// Installs backend + frontend dependencies and creates backend/.env if missing.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const run = (dir) => {
  console.log(`\n📦 Installing dependencies in ${dir}/ ...`);
  execSync('npm install', { cwd: path.join(root, dir), stdio: 'inherit' });
};

run('backend');
run('frontend');

const env = path.join(root, 'backend', '.env');
const example = path.join(root, 'backend', '.env.example');
if (!fs.existsSync(env) && fs.existsSync(example)) {
  fs.copyFileSync(example, env);
  console.log('\n✅ Created backend/.env from .env.example');
}

console.log('\n🎉 Setup complete. Run "npm run dev" to start the app.\n');
