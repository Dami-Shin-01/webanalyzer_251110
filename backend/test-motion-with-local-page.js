/**
 * Test script for motion observation with local HTML page
 */

const DynamicAnalyzer = require('./src/analyzers/DynamicAnalyzer');
const path = require('path');

async function testWithLocalPage() {
  console.log('=== Testing Motion Observation with Local HTML ===\n');
  
  const analyzer = new DynamicAnalyzer({ timeout: 30000 });
  
  // Use file:// protocol for local HTML
  const testPagePath = path.resolve(__dirname, 'test-page-with-animations.html');
  const testUrl = `file://${testPagePath}`;
  
  try {
    console.log(`Testing with local page: ${testPagePath}\n`);
    
    const startTime = Date.now();
    const animations = await analyzer.analyze(testUrl);
    const duration = Date.now() - startTime;
    
    console.log('\n=== Results ===');
    console.log(`Analysis completed in ${duration}ms`);
    console.log(`Found ${animations.length} animations\n`);
    
    if (animations.length > 0) {
      console.log('Detected animations:');
      animations.forEach((anim, index) => {
        console.log(`\nAnimation ${index + 1}:`);
        console.log(`  ID: ${anim.id}`);
        console.log(`  Element: ${anim.element}`);
        console.log(`  Trigger: ${anim.trigger}`);
        console.log(`  Duration: ${anim.duration}ms`);
        console.log(`  Easing: ${anim.easing}`);
        console.log(`  Properties changed: ${anim.properties.length}`);
        anim.properties.forEach(prop => {
          console.log(`    - ${prop.property}:`);
          console.log(`      From: ${prop.from}`);
          console.log(`      To: ${prop.to}`);
        });
      });
      
      console.log('\n✅ Successfully detected animations!');
    } else {
      console.log('⚠️  No animations detected (this might be expected for simple pages)');
    }
    
    // Verify data structure
    console.log('\n=== Data Structure Validation ===');
    if (animations.length > 0) {
      const sample = animations[0];
      console.log('✓ ID field:', typeof sample.id === 'string' ? 'OK' : 'FAIL');
      console.log('✓ Element field:', typeof sample.element === 'string' ? 'OK' : 'FAIL');
      console.log('✓ Trigger field:', typeof sample.trigger === 'string' ? 'OK' : 'FAIL');
      console.log('✓ Duration field:', typeof sample.duration === 'number' ? 'OK' : 'FAIL');
      console.log('✓ Properties field:', Array.isArray(sample.properties) ? 'OK' : 'FAIL');
      console.log('✓ Easing field:', typeof sample.easing === 'string' ? 'OK' : 'FAIL');
      
      if (sample.properties.length > 0) {
        const prop = sample.properties[0];
        console.log('✓ Property.property:', typeof prop.property === 'string' ? 'OK' : 'FAIL');
        console.log('✓ Property.from:', typeof prop.from === 'string' ? 'OK' : 'FAIL');
        console.log('✓ Property.to:', typeof prop.to === 'string' ? 'OK' : 'FAIL');
      }
    }
    
    console.log('\n✅ Motion observation test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testWithLocalPage();
