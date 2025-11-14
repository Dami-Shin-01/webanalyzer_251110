/**
 * Test script to validate StaticAnalyzer with real reference websites
 * Tests architecture validity and CORS handling
 */

const StaticAnalyzer = require('./StaticAnalyzer');

// Test websites - mix of popular sites with different CSS architectures
const TEST_WEBSITES = [
  'https://example.com',
  'https://www.wikipedia.org',
  'https://github.com',
  'https://stackoverflow.com',
  'https://www.mozilla.org',
  'https://www.w3.org',
  'https://developer.mozilla.org',
  'https://www.npmjs.com',
  'https://nodejs.org',
  'https://reactjs.org'
];

async function testWebsite(analyzer, url) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${url}`);
  console.log('='.repeat(80));
  
  try {
    const startTime = Date.now();
    const result = await analyzer.analyze(url);
    const duration = Date.now() - startTime;
    
    console.log(`✅ SUCCESS (${duration}ms)`);
    console.log(`   CSS Files Found: ${result.metadata.cssFilesFound}`);
    console.log(`   CSS Files Downloaded: ${result.metadata.cssFilesDownloaded}`);
    
    if (result.metadata.hasCORSIssues) {
      console.log(`   ⚠️  CORS Issues Detected`);
    }
    
    return {
      url,
      success: true,
      duration,
      cssFilesFound: result.metadata.cssFilesFound,
      cssFilesDownloaded: result.metadata.cssFilesDownloaded,
      hasCORSIssues: result.metadata.hasCORSIssues || false
    };
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    console.log(`   Error Type: ${error.type || 'unknown'}`);
    
    return {
      url,
      success: false,
      error: error.message,
      errorType: error.type || 'unknown'
    };
  }
}

async function runTests() {
  console.log('\n🚀 Starting StaticAnalyzer Architecture Validation');
  console.log(`Testing ${TEST_WEBSITES.length} reference websites...\n`);
  
  const analyzer = new StaticAnalyzer({
    timeout: 30000
  });
  
  const results = [];
  
  for (const url of TEST_WEBSITES) {
    const result = await testWebsite(analyzer, url);
    results.push(result);
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const withCORS = results.filter(r => r.hasCORSIssues);
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Successful: ${successful.length} (${(successful.length / results.length * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed.length} (${(failed.length / results.length * 100).toFixed(1)}%)`);
  console.log(`⚠️  CORS Issues: ${withCORS.length} (${(withCORS.length / results.length * 100).toFixed(1)}%)`);
  
  if (successful.length > 0) {
    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    const avgCSSFiles = successful.reduce((sum, r) => sum + r.cssFilesDownloaded, 0) / successful.length;
    console.log(`\nAverage Duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`Average CSS Files Downloaded: ${avgCSSFiles.toFixed(1)}`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed URLs:');
    failed.forEach(r => {
      console.log(`   - ${r.url}: ${r.errorType} - ${r.error}`);
    });
  }
  
  if (withCORS.length > 0) {
    console.log('\n⚠️  URLs with CORS Issues:');
    withCORS.forEach(r => {
      console.log(`   - ${r.url} (${r.cssFilesDownloaded}/${r.cssFilesFound} files downloaded)`);
    });
  }
  
  // Architecture validation conclusion
  console.log('\n' + '='.repeat(80));
  console.log('ARCHITECTURE VALIDATION');
  console.log('='.repeat(80));
  
  const successRate = (successful.length / results.length) * 100;
  const corsRate = (withCORS.length / results.length) * 100;
  
  if (successRate >= 70) {
    console.log('✅ Architecture is VALID - Server-side approach works for most websites');
  } else {
    console.log('❌ Architecture may need RECONSIDERATION - High failure rate');
  }
  
  if (corsRate > 50) {
    console.log('⚠️  WARNING: High CORS issue rate detected');
    console.log('   Consider browser extension architecture for better compatibility');
  } else if (corsRate > 0) {
    console.log('ℹ️  Some CORS issues detected but within acceptable range');
    console.log('   Server-side architecture is viable with graceful degradation');
  } else {
    console.log('✅ No CORS issues detected - Server-side architecture is optimal');
  }
  
  console.log('\n');
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, TEST_WEBSITES };
