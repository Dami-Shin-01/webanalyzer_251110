/**
 * Test script for motion observation logic
 * Tests the DynamicAnalyzer's ability to observe animations
 */

const DynamicAnalyzer = require('./src/analyzers/DynamicAnalyzer');

async function testMotionObservation() {
  console.log('=== Testing Motion Observation Logic ===\n');
  
  const analyzer = new DynamicAnalyzer({ timeout: 30000 });
  
  // Test with a simple HTML page that has animations
  const testUrl = 'https://example.com';
  
  try {
    console.log(`Testing with URL: ${testUrl}\n`);
    
    const startTime = Date.now();
    const animations = await analyzer.analyze(testUrl);
    const duration = Date.now() - startTime;
    
    console.log('\n=== Results ===');
    console.log(`Analysis completed in ${duration}ms`);
    console.log(`Found ${animations.length} animations\n`);
    
    if (animations.length > 0) {
      console.log('Sample animations:');
      animations.slice(0, 3).forEach((anim, index) => {
        console.log(`\nAnimation ${index + 1}:`);
        console.log(`  ID: ${anim.id}`);
        console.log(`  Element: ${anim.element}`);
        console.log(`  Trigger: ${anim.trigger}`);
        console.log(`  Duration: ${anim.duration}ms`);
        console.log(`  Properties changed: ${anim.properties.length}`);
        anim.properties.forEach(prop => {
          console.log(`    - ${prop.property}: ${prop.from} → ${prop.to}`);
        });
      });
    }
    
    console.log('\n✅ Motion observation test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testMotionObservation();
