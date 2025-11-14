import JSZip from 'jszip';
import { buildCSS, buildSCSS, buildJSON, buildAnimationCSS, buildMotionReports, buildReadme } from './starterKitBuilder';

/**
 * Generate and download a ZIP file containing the design system starter kit
 * @param {Object} tokenMappings - Token mappings by category
 * @param {Object} allTokens - All extracted tokens
 * @param {Array} animations - Animation tokens (optional)
 * @param {Array} motionReports - Motion reports from dynamic analysis (optional)
 * @param {Object} metadata - Analysis metadata
 * @param {boolean} includeUnnamed - Whether to include unnamed tokens
 * @returns {Promise<void>}
 */
export async function generateAndDownloadZip(tokenMappings, allTokens = {}, animations = [], motionReports = [], metadata = {}, includeUnnamed = false) {
  // If includeUnnamed is true, merge all tokens into tokenMappings with empty names
  const completeTokenMappings = { ...tokenMappings };
  
  if (includeUnnamed) {
    // Add all colors
    if (allTokens.colors) {
      completeTokenMappings.colors = completeTokenMappings.colors || {};
      allTokens.colors.forEach(color => {
        if (!(color in completeTokenMappings.colors)) {
          completeTokenMappings.colors[color] = ''; // Empty name will trigger auto-generation
        }
      });
    }
    
    // Add all fonts
    if (allTokens.fonts) {
      completeTokenMappings.fonts = completeTokenMappings.fonts || {};
      allTokens.fonts.forEach(font => {
        const key = `${font.family}-${font.size}-${font.weight}-${font.lineHeight}`;
        if (!(key in completeTokenMappings.fonts)) {
          completeTokenMappings.fonts[key] = '';
        }
      });
    }
    
    // Add all spacing
    if (allTokens.spacing) {
      completeTokenMappings.spacing = completeTokenMappings.spacing || {};
      allTokens.spacing.forEach(spacing => {
        if (!(spacing in completeTokenMappings.spacing)) {
          completeTokenMappings.spacing[spacing] = '';
        }
      });
    }
    
    // Add all effects
    if (allTokens.effects) {
      completeTokenMappings.effects = completeTokenMappings.effects || {};
      allTokens.effects.forEach(effect => {
        const key = `${effect.type}-${effect.value}`;
        if (!(key in completeTokenMappings.effects)) {
          completeTokenMappings.effects[key] = '';
        }
      });
    }
  }
  const zip = new JSZip();

  // Create design_system folder
  const designSystemFolder = zip.folder('design_system');

  // Generate and add CSS file
  const cssContent = buildCSS(completeTokenMappings, includeUnnamed);
  designSystemFolder.file('tokens.css', cssContent);

  // Generate and add SCSS file
  const scssContent = buildSCSS(completeTokenMappings, includeUnnamed);
  designSystemFolder.file('tokens.scss', scssContent);

  // Generate and add JSON file
  const jsonContent = buildJSON(completeTokenMappings, includeUnnamed);
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
  const readmeContent = buildReadme(metadata, completeTokenMappings);
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
