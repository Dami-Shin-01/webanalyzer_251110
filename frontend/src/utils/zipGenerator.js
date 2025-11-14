import JSZip from 'jszip';
import { buildCSS, buildSCSS, buildJSON, buildAnimationCSS, buildMotionReports, buildReadme } from './starterKitBuilder';

/**
 * Generate and download a ZIP file containing the design system starter kit
 * @param {Object} tokenMappings - Token mappings by category
 * @param {Array} animations - Animation tokens (optional)
 * @param {Array} motionReports - Motion reports from dynamic analysis (optional)
 * @param {Object} metadata - Analysis metadata
 * @param {boolean} includeUnnamed - Whether to include unnamed tokens
 * @returns {Promise<void>}
 */
export async function generateAndDownloadZip(tokenMappings, animations = [], motionReports = [], metadata = {}, includeUnnamed = false) {
  const zip = new JSZip();

  // Create design_system folder
  const designSystemFolder = zip.folder('design_system');

  // Generate and add CSS file
  const cssContent = buildCSS(tokenMappings, includeUnnamed);
  designSystemFolder.file('tokens.css', cssContent);

  // Generate and add SCSS file
  const scssContent = buildSCSS(tokenMappings, includeUnnamed);
  designSystemFolder.file('tokens.scss', scssContent);

  // Generate and add JSON file
  const jsonContent = buildJSON(tokenMappings, includeUnnamed);
  designSystemFolder.file('tokens.json', jsonContent);

  // Add animations if present
  if (animations && animations.length > 0) {
    const motionLibraryFolder = zip.folder('motion_library');
    const cssFolder = motionLibraryFolder.folder('css');

    const animationFiles = buildAnimationCSS(
      animations,
      tokenMappings.animations || {},
      includeUnnamed
    );

    animationFiles.forEach((content, filename) => {
      cssFolder.file(filename, content);
    });
  }

  // Add motion reports if present
  if (motionReports && motionReports.length > 0) {
    const motionLibraryFolder = zip.folder('motion_library');
    const reportsFolder = motionLibraryFolder.folder('motion_reports');

    const reportFiles = buildMotionReports(motionReports);

    reportFiles.forEach((content, filename) => {
      reportsFolder.file(filename, content);
    });
  }

  // Generate and add README
  const readmeContent = buildReadme(metadata, tokenMappings);
  zip.file('README.md', readmeContent);

  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  downloadBlob(blob, 'project-snapshot-kit.zip');
}

/**
 * Helper function to trigger file download in browser
 * @param {Blob} blob - File blob
 * @param {string} filename - Download filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
