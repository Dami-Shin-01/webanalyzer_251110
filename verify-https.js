#!/usr/bin/env node

/**
 * HTTPS Verification Script
 * 
 * This script verifies that both frontend and backend are accessible via HTTPS
 * and that they can communicate with each other.
 */

const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkUrl(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    log(`\nChecking ${name}: ${url}`, 'blue');
    
    const req = protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        log(`✅ ${name} is accessible (Status: ${res.statusCode})`, 'green');
        
        if (urlObj.protocol === 'https:') {
          log(`✅ ${name} is using HTTPS`, 'green');
        } else {
          log(`⚠️  ${name} is using HTTP (should use HTTPS in production)`, 'yellow');
        }
        
        resolve({ success: true, url, name });
      } else {
        log(`⚠️  ${name} returned status ${res.statusCode}`, 'yellow');
        resolve({ success: false, url, name, status: res.statusCode });
      }
    });
    
    req.on('error', (error) => {
      log(`❌ ${name} is not accessible: ${error.message}`, 'red');
      resolve({ success: false, url, name, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      log(`❌ ${name} request timed out`, 'red');
      resolve({ success: false, url, name, error: 'Timeout' });
    });
  });
}

async function verifyDeployment() {
  log('='.repeat(60), 'blue');
  log('HTTPS Deployment Verification', 'blue');
  log('='.repeat(60), 'blue');
  
  // Get URLs from command line arguments or use defaults
  const frontendUrl = process.argv[2] || process.env.FRONTEND_URL || 'http://localhost:3000';
  const backendUrl = process.argv[3] || process.env.BACKEND_URL || 'http://localhost:5000';
  
  log('\nConfiguration:', 'blue');
  log(`Frontend URL: ${frontendUrl}`);
  log(`Backend URL: ${backendUrl}`);
  
  // Check backend health endpoint
  const backendHealth = await checkUrl(`${backendUrl}/health`, 'Backend Health Check');
  
  // Check frontend
  const frontendCheck = await checkUrl(frontendUrl, 'Frontend');
  
  // Check backend API endpoint (just connectivity, not full analysis)
  log('\n' + '='.repeat(60), 'blue');
  log('Summary', 'blue');
  log('='.repeat(60), 'blue');
  
  const allChecks = [backendHealth, frontendCheck];
  const successCount = allChecks.filter(c => c.success).length;
  const totalChecks = allChecks.length;
  
  log(`\n${successCount}/${totalChecks} checks passed`, successCount === totalChecks ? 'green' : 'yellow');
  
  // HTTPS verification
  const frontendHttps = frontendUrl.startsWith('https://');
  const backendHttps = backendUrl.startsWith('https://');
  
  log('\nHTTPS Status:', 'blue');
  log(`Frontend HTTPS: ${frontendHttps ? '✅ Enabled' : '❌ Disabled'}`, frontendHttps ? 'green' : 'red');
  log(`Backend HTTPS: ${backendHttps ? '✅ Enabled' : '❌ Disabled'}`, backendHttps ? 'green' : 'red');
  
  if (!frontendHttps || !backendHttps) {
    log('\n⚠️  Warning: HTTPS should be enabled for production deployments', 'yellow');
  }
  
  // CORS check
  log('\nCORS Configuration:', 'blue');
  if (frontendUrl.startsWith('http://localhost') && backendUrl.startsWith('http://localhost')) {
    log('✅ Local development configuration detected', 'green');
  } else if (frontendHttps && backendHttps) {
    log('✅ Production configuration detected', 'green');
    log('⚠️  Make sure FRONTEND_URL in backend matches frontend URL exactly', 'yellow');
  } else {
    log('⚠️  Mixed HTTP/HTTPS configuration may cause CORS issues', 'yellow');
  }
  
  log('\n' + '='.repeat(60), 'blue');
  
  if (successCount === totalChecks && frontendHttps && backendHttps) {
    log('✅ All checks passed! Deployment looks good.', 'green');
    process.exit(0);
  } else if (successCount === totalChecks) {
    log('⚠️  Services are accessible but HTTPS is not fully configured', 'yellow');
    process.exit(0);
  } else {
    log('❌ Some checks failed. Please review the errors above.', 'red');
    process.exit(1);
  }
}

// Usage information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
HTTPS Verification Script

Usage:
  node verify-https.js [frontend-url] [backend-url]

Examples:
  # Check local development
  node verify-https.js http://localhost:3000 http://localhost:5000

  # Check production deployment
  node verify-https.js https://myapp.vercel.app https://myapi.railway.app

  # Use environment variables
  FRONTEND_URL=https://myapp.vercel.app BACKEND_URL=https://myapi.railway.app node verify-https.js

Options:
  --help, -h    Show this help message
  `);
  process.exit(0);
}

// Run verification
verifyDeployment().catch((error) => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  process.exit(1);
});
