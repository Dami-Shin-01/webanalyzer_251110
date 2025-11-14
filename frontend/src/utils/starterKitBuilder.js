/**
 * StarterKitBuilder - Utility for converting token mappings to various formats
 * and generating a downloadable starter kit
 */

/**
 * Convert token mappings to CSS custom properties format
 * @param {Object} tokenMappings - Token mappings by category
 * @param {boolean} includeUnnamed - Whether to include unnamed tokens
 * @returns {string} CSS content
 */
export function buildCSS(tokenMappings, includeUnnamed = false) {
  let css = ':root {\n';
  const lines = [];

  // Process colors
  if (tokenMappings.colors) {
    Object.entries(tokenMappings.colors).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('color', value);
        lines.push(`  --${tokenName}: ${value};`);
      }
    });
  }

  // Process fonts
  if (tokenMappings.fonts) {
    Object.entries(tokenMappings.fonts).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const font = parseFontKey(key);
        const tokenName = name || generateAutoName('font', key);
        lines.push(`  --${tokenName}-family: ${font.family};`);
        lines.push(`  --${tokenName}-size: ${font.size};`);
        lines.push(`  --${tokenName}-weight: ${font.weight};`);
        lines.push(`  --${tokenName}-line-height: ${font.lineHeight};`);
      }
    });
  }

  // Process spacing
  if (tokenMappings.spacing) {
    Object.entries(tokenMappings.spacing).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('spacing', value);
        lines.push(`  --${tokenName}: ${value};`);
      }
    });
  }

  // Process effects
  if (tokenMappings.effects) {
    Object.entries(tokenMappings.effects).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const effect = parseEffectKey(key);
        const tokenName = name || generateAutoName(effect.type, key);
        lines.push(`  --${tokenName}: ${effect.value};`);
      }
    });
  }

  css += lines.join('\n');
  css += '\n}\n';

  return css;
}

/**
 * Convert token mappings to SCSS variables format
 * @param {Object} tokenMappings - Token mappings by category
 * @param {boolean} includeUnnamed - Whether to include unnamed tokens
 * @returns {string} SCSS content
 */
export function buildSCSS(tokenMappings, includeUnnamed = false) {
  const lines = [];

  // Process colors
  if (tokenMappings.colors) {
    lines.push('// Colors');
    Object.entries(tokenMappings.colors).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('color', value);
        lines.push(`$${tokenName}: ${value};`);
      }
    });
    lines.push('');
  }

  // Process fonts
  if (tokenMappings.fonts) {
    lines.push('// Typography');
    Object.entries(tokenMappings.fonts).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const font = parseFontKey(key);
        const tokenName = name || generateAutoName('font', key);
        lines.push(`$${tokenName}-family: ${font.family};`);
        lines.push(`$${tokenName}-size: ${font.size};`);
        lines.push(`$${tokenName}-weight: ${font.weight};`);
        lines.push(`$${tokenName}-line-height: ${font.lineHeight};`);
      }
    });
    lines.push('');
  }

  // Process spacing
  if (tokenMappings.spacing) {
    lines.push('// Spacing');
    Object.entries(tokenMappings.spacing).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('spacing', value);
        lines.push(`$${tokenName}: ${value};`);
      }
    });
    lines.push('');
  }

  // Process effects
  if (tokenMappings.effects) {
    lines.push('// Effects');
    Object.entries(tokenMappings.effects).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const effect = parseEffectKey(key);
        const tokenName = name || generateAutoName(effect.type, key);
        lines.push(`$${tokenName}: ${effect.value};`);
      }
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Convert token mappings to JSON format
 * @param {Object} tokenMappings - Token mappings by category
 * @param {boolean} includeUnnamed - Whether to include unnamed tokens
 * @returns {string} JSON content
 */
export function buildJSON(tokenMappings, includeUnnamed = false) {
  const tokens = {
    colors: {},
    typography: {},
    spacing: {},
    effects: {}
  };

  // Process colors
  if (tokenMappings.colors) {
    Object.entries(tokenMappings.colors).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('color', value);
        tokens.colors[tokenName] = value;
      }
    });
  }

  // Process fonts
  if (tokenMappings.fonts) {
    Object.entries(tokenMappings.fonts).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const font = parseFontKey(key);
        const tokenName = name || generateAutoName('font', key);
        tokens.typography[tokenName] = {
          fontFamily: font.family,
          fontSize: font.size,
          fontWeight: font.weight,
          lineHeight: font.lineHeight
        };
      }
    });
  }

  // Process spacing
  if (tokenMappings.spacing) {
    Object.entries(tokenMappings.spacing).forEach(([value, name]) => {
      if (name || includeUnnamed) {
        const tokenName = name || generateAutoName('spacing', value);
        tokens.spacing[tokenName] = value;
      }
    });
  }

  // Process effects
  if (tokenMappings.effects) {
    Object.entries(tokenMappings.effects).forEach(([key, name]) => {
      if (name || includeUnnamed) {
        const effect = parseEffectKey(key);
        const tokenName = name || generateAutoName(effect.type, key);
        tokens.effects[tokenName] = {
          type: effect.type,
          value: effect.value
        };
      }
    });
  }

  return JSON.stringify(tokens, null, 2);
}

/**
 * Build animation CSS files
 * @param {Array} animations - Animation tokens
 * @param {Object} animationMappings - Animation name mappings
 * @param {boolean} includeUnnamed - Whether to include unnamed animations
 * @returns {Map<string, string>} Map of filename to CSS content
 */
export function buildAnimationCSS(animations, animationMappings, includeUnnamed = false) {
  const files = new Map();

  if (!animations || animations.length === 0) {
    return files;
  }

  animations.forEach(animation => {
    const mappedName = animationMappings[animation.name];
    if (mappedName || includeUnnamed) {
      const fileName = mappedName || animation.name;
      
      // Build CSS content with animation definition and usage example
      let css = `/* Animation: ${fileName} */\n`;
      css += `/* Original name: ${animation.name} */\n\n`;
      
      // Add the keyframes definition
      css += `${animation.keyframes}\n\n`;
      
      // Add usage example
      css += `/* Usage Example:\n`;
      css += `.element {\n`;
      css += `  animation-name: ${animation.name};\n`;
      
      if (animation.duration) {
        css += `  animation-duration: ${animation.duration};\n`;
      }
      if (animation.timingFunction) {
        css += `  animation-timing-function: ${animation.timingFunction};\n`;
      }
      if (animation.delay) {
        css += `  animation-delay: ${animation.delay};\n`;
      }
      if (animation.iterationCount) {
        css += `  animation-iteration-count: ${animation.iterationCount};\n`;
      }
      
      css += `}\n`;
      
      // Or shorthand
      if (animation.duration || animation.timingFunction) {
        css += `\n/* Shorthand: */\n`;
        css += `.element {\n`;
        css += `  animation: ${animation.name}`;
        if (animation.duration) css += ` ${animation.duration}`;
        if (animation.timingFunction) css += ` ${animation.timingFunction}`;
        if (animation.delay) css += ` ${animation.delay}`;
        if (animation.iterationCount) css += ` ${animation.iterationCount}`;
        css += `;\n}\n`;
      }
      
      css += `*/\n`;
      
      files.set(`${fileName}.css`, css);
    }
  });

  return files;
}

/**
 * Generate README.md content
 * @param {Object} metadata - Analysis metadata
 * @param {Object} tokenMappings - Token mappings
 * @returns {string} README content
 */
export function buildReadme(metadata, tokenMappings) {
  const colorCount = Object.keys(tokenMappings.colors || {}).length;
  const fontCount = Object.keys(tokenMappings.fonts || {}).length;
  const spacingCount = Object.keys(tokenMappings.spacing || {}).length;
  const effectCount = Object.keys(tokenMappings.effects || {}).length;
  const animationCount = Object.keys(tokenMappings.animations || {}).length;
  const motionReportCount = metadata.motionReportCount || 0;

  return `# Design System Starter Kit

Generated by Project Snapshot

## Source
- **URL**: ${metadata.analyzedUrl || 'N/A'}
- **Generated**: ${metadata.timestamp ? new Date(metadata.timestamp).toLocaleString('ko-KR') : new Date().toLocaleString('ko-KR')}

## Contents

This starter kit contains design tokens extracted from the analyzed website.

### Token Summary
- **Colors**: ${colorCount} tokens
- **Typography**: ${fontCount} tokens
- **Spacing**: ${spacingCount} tokens
- **Effects**: ${effectCount} tokens
- **Animations**: ${animationCount} tokens
${motionReportCount > 0 ? `- **Motion Reports**: ${motionReportCount} reports\n` : ''}

## File Structure

\`\`\`
design_system/
├── tokens.css          # CSS custom properties
├── tokens.scss         # SCSS variables
└── tokens.json         # JSON format
${animationCount > 0 || motionReportCount > 0 ? `
motion_library/
${animationCount > 0 ? `├── css/
│   └── [animation files]
` : ''}${motionReportCount > 0 ? `└── motion_reports/
    └── [motion report markdown files]
` : ''}` : ''}
\`\`\`

## Usage

### CSS
\`\`\`css
/* Import the tokens */
@import './design_system/tokens.css';

/* Use in your styles */
.my-element {
  color: var(--primary-color);
  font-family: var(--heading-font-family);
}
\`\`\`

### SCSS
\`\`\`scss
// Import the tokens
@import './design_system/tokens';

// Use in your styles
.my-element {
  color: $primary-color;
  font-family: $heading-font-family;
}
\`\`\`

### JavaScript/JSON
\`\`\`javascript
import tokens from './design_system/tokens.json';

// Access tokens
const primaryColor = tokens.colors.primary;
\`\`\`

## Customization

Feel free to modify these tokens to match your project's needs. This is a starting point based on the analyzed website.

---

Generated with ❤️ by Project Snapshot
`;
}

/**
 * Helper function to parse font key back to font object
 * @param {string} key - Font key in format "family-size-weight-lineHeight"
 * @returns {Object} Font object
 */
function parseFontKey(key) {
  const parts = key.split('-');
  return {
    family: parts[0],
    size: parts[1],
    weight: parts[2],
    lineHeight: parts[3]
  };
}

/**
 * Helper function to parse effect key back to effect object
 * @param {string} key - Effect key in format "type-value"
 * @returns {Object} Effect object
 */
function parseEffectKey(key) {
  const separatorIndex = key.indexOf('-');
  return {
    type: key.substring(0, separatorIndex),
    value: key.substring(separatorIndex + 1)
  };
}

/**
 * Generate automatic token name for unnamed tokens
 * @param {string} category - Token category
 * @param {string} value - Token value
 * @returns {string} Generated name
 */
export function generateAutoName(category, value) {
  switch (category) {
    case 'color':
      return generateColorName(value);
    case 'font':
      return generateFontName(value);
    case 'spacing':
      return generateSpacingName(value);
    case 'shadow':
    case 'border-radius':
    case 'opacity':
      return generateEffectName(category, value);
    default:
      // Fallback to hash-based name
      const hash = value.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0);
      const shortHash = Math.abs(hash).toString(36).substring(0, 6);
      return `${category}-${shortHash}`;
  }
}

/**
 * Generate meaningful color name
 * @param {string} color - Color value (hex, rgb, etc.)
 * @returns {string} Generated color name
 */
function generateColorName(color) {
  // Convert to hex if possible
  const hexMatch = color.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
  if (hexMatch) {
    const hex = hexMatch[1].length === 3 
      ? hexMatch[1].split('').map(c => c + c).join('')
      : hexMatch[1];
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Determine color name based on RGB values
    const colorName = getColorNameFromRGB(r, g, b);
    const lightness = getLightnessLevel(r, g, b);
    
    return `${colorName}-${lightness}`;
  }
  
  // Fallback for other formats
  const hash = Math.abs(color.split('').reduce((acc, char) => 
    ((acc << 5) - acc) + char.charCodeAt(0), 0)).toString(36).substring(0, 4);
  return `color-${hash}`;
}

/**
 * Get color name from RGB values
 */
function getColorNameFromRGB(r, g, b) {
  // Grayscale
  if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
    return 'gray';
  }
  
  // Determine dominant color
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  if (max - min < 30) return 'gray';
  
  if (r === max && g === min) return 'red';
  if (r === max && b === min) return 'orange';
  if (g === max && b === min) return 'green';
  if (g === max && r === min) return 'cyan';
  if (b === max && r === min) return 'blue';
  if (b === max && g === min) return 'purple';
  
  // More nuanced detection
  if (r > g && r > b) {
    if (g > b) return 'orange';
    return 'red';
  }
  if (g > r && g > b) {
    if (r > b) return 'yellow';
    return 'green';
  }
  if (b > r && b > g) {
    if (r > g) return 'purple';
    return 'blue';
  }
  
  return 'gray';
}

/**
 * Get lightness level (100-900 scale)
 */
function getLightnessLevel(r, g, b) {
  const lightness = (r + g + b) / 3;
  
  if (lightness > 230) return '100';
  if (lightness > 200) return '200';
  if (lightness > 170) return '300';
  if (lightness > 140) return '400';
  if (lightness > 110) return '500';
  if (lightness > 80) return '600';
  if (lightness > 50) return '700';
  if (lightness > 25) return '800';
  return '900';
}

/**
 * Generate meaningful font name
 */
function generateFontName(fontKey) {
  const font = parseFontKey(fontKey);
  const size = parseFloat(font.size);
  
  // Size-based naming
  let sizeName = 'md';
  if (size <= 12) sizeName = 'xs';
  else if (size <= 14) sizeName = 'sm';
  else if (size <= 16) sizeName = 'base';
  else if (size <= 18) sizeName = 'lg';
  else if (size <= 24) sizeName = 'xl';
  else if (size <= 32) sizeName = '2xl';
  else if (size <= 48) sizeName = '3xl';
  else sizeName = '4xl';
  
  return `text-${sizeName}`;
}

/**
 * Generate meaningful spacing name
 */
function generateSpacingName(spacing) {
  const value = parseFloat(spacing);
  
  // Convert to rem-like scale (assuming 16px base)
  const scale = Math.round(value / 4);
  
  if (scale === 0) return 'spacing-0';
  if (scale <= 1) return 'spacing-1';
  if (scale <= 2) return 'spacing-2';
  if (scale <= 3) return 'spacing-3';
  if (scale <= 4) return 'spacing-4';
  if (scale <= 6) return 'spacing-6';
  if (scale <= 8) return 'spacing-8';
  if (scale <= 12) return 'spacing-12';
  if (scale <= 16) return 'spacing-16';
  return `spacing-${scale}`;
}

/**
 * Generate meaningful effect name
 */
function generateEffectName(type, value) {
  const cleanType = type.replace('-', '');
  const hash = Math.abs(value.split('').reduce((acc, char) => 
    ((acc << 5) - acc) + char.charCodeAt(0), 0)).toString(36).substring(0, 3);
  return `${cleanType}-${hash}`;
}

/**
 * Build motion report markdown files
 * @param {Array} motionReports - Motion report objects from dynamic analysis
 * @returns {Map<string, string>} Map of filename to markdown content
 */
export function buildMotionReports(motionReports) {
  const files = new Map();

  if (!motionReports || motionReports.length === 0) {
    return files;
  }

  motionReports.forEach((report) => {
    const markdown = generateMotionReportMarkdown(report);
    const filename = `${report.id}.md`;
    files.set(filename, markdown);
  });

  return files;
}

/**
 * Generate markdown content for a single motion report
 * @param {Object} report - Motion report object
 * @returns {string} Markdown content
 */
function generateMotionReportMarkdown(report) {
  let markdown = `# ${report.id}\n\n`;
  
  markdown += `## 설명\n\n`;
  markdown += `${report.description}\n\n`;
  
  markdown += `## 애니메이션 정보\n\n`;
  markdown += `- **요소**: \`${report.element}\`\n`;
  markdown += `- **트리거**: ${getTriggerDisplayName(report.trigger)}\n`;
  markdown += `- **지속 시간**: ${report.duration}ms\n`;
  markdown += `- **Easing**: ${report.easing}\n\n`;
  
  markdown += `## 속성 변화\n\n`;
  report.properties.forEach(prop => {
    markdown += `- **${prop.property}**: \`${prop.from}\` → \`${prop.to}\`\n`;
  });
  markdown += `\n`;
  
  markdown += `## 재구현 코드\n\n`;
  
  markdown += `### CSS @keyframes\n\n`;
  markdown += `\`\`\`css\n`;
  markdown += report.codeSnippets.css;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Web Animation API (JavaScript)\n\n`;
  markdown += `\`\`\`javascript\n`;
  markdown += report.codeSnippets.js;
  markdown += `\`\`\`\n\n`;
  
  if (report.codeSnippets.gsap) {
    markdown += `### GSAP (선택적)\n\n`;
    markdown += `\`\`\`javascript\n`;
    markdown += report.codeSnippets.gsap;
    markdown += `\`\`\`\n\n`;
  }
  
  markdown += `## 사용 방법\n\n`;
  markdown += `1. 위의 코드 스니펫 중 하나를 선택하여 프로젝트에 복사합니다.\n`;
  markdown += `2. 요소 선택자(\`${report.element}\`)를 실제 프로젝트의 선택자로 변경합니다.\n`;
  markdown += `3. 필요에 따라 duration, easing 등의 값을 조정합니다.\n`;
  markdown += `4. CSS 방식의 경우 스타일시트에 추가하고, JavaScript 방식의 경우 스크립트 파일에 추가합니다.\n\n`;
  
  markdown += `---\n\n`;
  markdown += `*Generated by Project Snapshot*\n`;
  
  return markdown;
}

/**
 * Get display name for trigger type
 * @param {string} trigger - Trigger type
 * @returns {string} Display name
 */
function getTriggerDisplayName(trigger) {
  const displayNames = {
    'scroll': '스크롤',
    'hover': '호버',
    'load': '페이지 로드'
  };
  return displayNames[trigger] || trigger;
}
