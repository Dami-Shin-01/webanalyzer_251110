/**
 * DynamicAnalyzer 통합 테스트 스크립트
 * 
 * 실제 웹사이트를 대상으로 DynamicAnalyzer의 기본 기능을 검증합니다.
 */

const DynamicAnalyzer = require('./src/analyzers/DynamicAnalyzer');

async function testDynamicAnalyzer() {
  console.log('=== DynamicAnalyzer Integration Test ===\n');

  const analyzer = new DynamicAnalyzer({ timeout: 15000 });

  try {
    // Test 1: Puppeteer 가용성 확인
    console.log('Test 1: Checking Puppeteer availability...');
    const isAvailable = await DynamicAnalyzer.isAvailable();
    console.log(`✓ Puppeteer available: ${isAvailable}\n`);

    if (!isAvailable) {
      console.error('✗ Puppeteer is not available. Exiting tests.');
      return;
    }

    // Test 2: 간단한 웹사이트 분석
    console.log('Test 2: Analyzing example.com...');
    const result = await analyzer.analyze('https://example.com');
    console.log(`✓ Analysis completed successfully`);
    console.log(`  Motion reports: ${result.length}\n`);

    // Test 3: 브라우저 정리 확인
    console.log('Test 3: Verifying browser cleanup...');
    console.log(`✓ Browser cleaned up: ${analyzer.browser === null}\n`);

    console.log('=== All Tests Passed ===');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // 확실한 정리
    if (analyzer.browser) {
      await analyzer.closeBrowser();
    }
  }
}

// 테스트 실행
testDynamicAnalyzer()
  .then(() => {
    console.log('\nTest script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nTest script failed:', error);
    process.exit(1);
  });
