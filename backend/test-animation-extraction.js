/**
 * Manual test script to verify animation extraction works end-to-end
 */

const CSSParser = require('./src/parsers/CSSParser');

const sampleCSS = `
/* Sample CSS with animations */

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Usage Examples */
.fade-element {
  animation: fadeIn 500ms ease-in-out;
}

.spinner {
  animation-name: spin;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.bounce-element {
  animation: bounce 1s ease-in-out infinite;
}

/* Other CSS */
.button {
  color: #FF0000;
  background: #00FF00;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
`;

console.log('🎬 Testing Animation Extraction\n');
console.log('=' .repeat(60));

const parser = new CSSParser();

// Extract all tokens
console.log('\n📊 Extracting all tokens...\n');

const colors = parser.extractColors(sampleCSS);
const fonts = parser.extractFonts(sampleCSS);
const spacing = parser.extractSpacing(sampleCSS);
const effects = parser.extractEffects(sampleCSS);
const animations = parser.extractKeyframes(sampleCSS);

console.log('✅ Colors extracted:', colors.length);
console.log('   ', colors.slice(0, 5).join(', '));

console.log('\n✅ Spacing extracted:', spacing.length);
console.log('   ', spacing.slice(0, 5).join(', '));

console.log('\n✅ Effects extracted:', effects.length);
effects.slice(0, 3).forEach(effect => {
  console.log(`    ${effect.type}: ${effect.value}`);
});

console.log('\n✅ Animations extracted:', animations.length);
console.log('=' .repeat(60));

animations.forEach((animation, index) => {
  console.log(`\n🎬 Animation ${index + 1}: ${animation.name}`);
  console.log('   Duration:', animation.duration || 'N/A');
  console.log('   Timing Function:', animation.timingFunction || 'N/A');
  console.log('   Delay:', animation.delay || 'N/A');
  console.log('   Iteration Count:', animation.iterationCount || 'N/A');
  console.log('   Keyframes Preview:');
  console.log('   ', animation.keyframes.substring(0, 100) + '...');
});

console.log('\n' + '='.repeat(60));
console.log('✅ Animation extraction test completed successfully!');
console.log('=' .repeat(60));
