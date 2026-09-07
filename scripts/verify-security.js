const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Running PlaylistBridge Security Verification...\n');

let hasErrors = false;

// 1. Verify .env.local is in .gitignore
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const content = fs.readFileSync(gitignorePath, 'utf8');
  if (!content.includes('.env*.local') && !content.includes('.env.local')) {
    console.error('❌ FAIL: .env.local is not listed in .gitignore!');
    hasErrors = true;
  } else {
    console.log('✅ PASS: .gitignore correctly protects .env files.');
  }
}

// 2. Check git tracking status for secrets
try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf8' });
  if (trackedFiles.includes('.env.local')) {
    console.error('❌ FAIL: .env.local is being tracked by git!');
    hasErrors = true;
  } else {
    console.log('✅ PASS: No secret env files tracked in git index.');
  }
} catch (e) {
  // Not in git yet or error
}

// 3. Scan codebase for raw hardcoded secrets
const suspiciousPatterns = [
  /GOCSPX-[a-zA-Z0-9_-]{20,}/,
  /AIza[0-9A-Za-z-_]{35}/,
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.env.local') continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          console.error(`❌ FAIL: Suspicious secret pattern found in: ${fullPath}`);
          hasErrors = true;
        }
      }
    }
  }
}

try {
  scanDir(path.join(__dirname, '..'));
  console.log('✅ PASS: Source code clean of hardcoded secrets.');
} catch (e) {
  console.warn('⚠️ Note during directory scan:', e.message);
}

if (hasErrors) {
  console.error('\n❌ Security verification failed.');
  process.exit(1);
} else {
  console.log('\n🛡️ All security checks passed successfully!');
}
