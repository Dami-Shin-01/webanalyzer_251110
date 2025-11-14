/**
 * Test script for MotionReportGenerator
 */

const MotionReportGenerator = require('./src/generators/MotionReportGenerator');

// Test data
const observedAnimations = [
  {
    id: 'animation-1',
    element: '.fade-in',
    trigger: 'scroll',
    properties: [
      { property: 'opacity', from: '0', to: '1' },
      { property: 'transform', from: 'translateY(20px)', to: 'translateY(0)' }
    ],
    duration: 600,
    easing: 'ease'
  }
];

console.log('Testing MotionReportGenerator...\n');

// Generate reports
const reports = MotionReportGenerator.generateReports(observedAnimations);

console.log(`Generated ${reports.length} reports\n`);

if (reports.length > 0) {
  const report = reports[0];
  console.log('Report ID:', report.id);
  console.log('Description:', report.description);
  console.log('\nCSS Snippet:');
  console.log(report.codeSnippets.css);
  console.log('\nMarkdown:');
  console.log(MotionReportGenerator.generateMarkdown(report));
}
