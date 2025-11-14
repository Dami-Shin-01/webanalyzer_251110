/**
 * CSSParser - Extracts design tokens from CSS content
 * Handles color extraction, normalization, and deduplication
 */
class CSSParser {
  constructor() {
    // Regex patterns for color extraction
    this.hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
    this.rgbPattern = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g;
  }

  /**
   * Extract all unique colors from CSS content
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique, normalized color values
   */
  extractColors(css) {
    if (!css || typeof css !== 'string') {
      return [];
    }

    const colors = new Set();

    // Extract HEX colors
    const hexMatches = css.matchAll(this.hexPattern);
    for (const match of hexMatches) {
      const normalized = this.normalizeHexColor(match[0]);
      colors.add(normalized);
    }

    // Extract RGB(A) colors
    const rgbMatches = css.matchAll(this.rgbPattern);
    for (const match of rgbMatches) {
      const normalized = this.normalizeRgbColor(match[0]);
      colors.add(normalized);
    }

    return Array.from(colors).sort();
  }

  /**
   * Normalize HEX color values
   * - Convert to uppercase
   * - Expand 3-digit hex to 6-digit (#FFF -> #FFFFFF)
   * @param {string} hex - HEX color value
   * @returns {string} Normalized HEX color
   */
  normalizeHexColor(hex) {
    // Remove # and convert to uppercase
    let value = hex.replace('#', '').toUpperCase();

    // Expand 3-digit hex to 6-digit
    if (value.length === 3) {
      value = value.split('').map(char => char + char).join('');
    }

    return `#${value}`;
  }

  /**
   * Normalize RGB(A) color values
   * - Standardize spacing
   * - Remove unnecessary decimals in alpha
   * - Convert rgb to rgba format for consistency
   * @param {string} rgb - RGB(A) color value
   * @returns {string} Normalized RGB(A) color
   */
  normalizeRgbColor(rgb) {
    // Extract components
    const match = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
    
    if (!match) {
      return rgb;
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    // Always use rgba format for consistency
    // Remove trailing zeros from alpha
    const alphaStr = a === 1 ? '1' : a.toString();
    
    return `rgba(${r}, ${g}, ${b}, ${alphaStr})`;
  }

  /**
   * Extract font tokens from CSS content
   * @param {string} css - CSS content
   * @returns {Array<Object>} Array of font tokens
   */
  extractFonts(css) {
    if (!css || typeof css !== 'string') {
      return [];
    }

    const fontFamilies = this.extractFontFamilies(css);
    const fontSizes = this.extractFontSizes(css);
    const fontWeights = this.extractFontWeights(css);
    const lineHeights = this.extractLineHeights(css);

    // Create FontToken objects by combining unique values
    const fontTokens = [];
    const seenCombinations = new Set();

    // Extract font declarations (font-family, font-size, font-weight, line-height together)
    const fontDeclarationPattern = /(?:^|[^-\w])(?:font-family|font-size|font-weight|line-height)\s*:\s*([^;{}]+)/gi;
    const matches = css.matchAll(fontDeclarationPattern);
    
    // Track all property combinations found in the CSS
    const propertyMap = new Map();
    
    for (const match of matches) {
      const declaration = match[0];
      const property = declaration.match(/(?:font-family|font-size|font-weight|line-height)/i)[0].toLowerCase();
      const value = match[1].trim();
      
      if (!propertyMap.has(property)) {
        propertyMap.set(property, new Set());
      }
      propertyMap.get(property).add(value);
    }

    // Generate font tokens from unique combinations
    // For simplicity, create tokens from each unique font-family with common sizes/weights
    fontFamilies.forEach(family => {
      fontSizes.forEach(size => {
        fontWeights.forEach(weight => {
          lineHeights.forEach(lineHeight => {
            const token = {
              family,
              size,
              weight,
              lineHeight
            };
            
            const key = `${family}|${size}|${weight}|${lineHeight}`;
            if (!seenCombinations.has(key)) {
              fontTokens.push(token);
              seenCombinations.add(key);
            }
          });
        });
      });
    });

    // If we have too many combinations, simplify by creating tokens for each property separately
    if (fontTokens.length > 50) {
      const simplifiedTokens = [];
      const seen = new Set();
      
      // Create tokens with just family and size (most common combination)
      fontFamilies.forEach(family => {
        fontSizes.forEach(size => {
          const token = {
            family,
            size,
            weight: '400', // default
            lineHeight: 'normal' // default
          };
          const key = `${family}|${size}`;
          if (!seen.has(key)) {
            simplifiedTokens.push(token);
            seen.add(key);
          }
        });
      });
      
      return simplifiedTokens.slice(0, 30); // Limit to 30 most common
    }

    return fontTokens;
  }

  /**
   * Extract font-family values from CSS
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique font families
   */
  extractFontFamilies(css) {
    const families = new Set();
    
    // Match font-family declarations
    const fontFamilyPattern = /font-family\s*:\s*([^;{}]+)/gi;
    const matches = css.matchAll(fontFamilyPattern);
    
    for (const match of matches) {
      const value = match[1].trim();
      // Split by comma for multiple font families
      const familyList = value.split(',').map(f => f.trim());
      
      familyList.forEach(family => {
        // Remove quotes and normalize
        const normalized = family.replace(/['"]/g, '').trim();
        if (normalized && normalized !== 'inherit' && normalized !== 'initial' && normalized !== 'unset') {
          families.add(normalized);
        }
      });
    }
    
    // Also check shorthand font property
    const fontShorthandPattern = /\bfont\s*:\s*([^;{}]+)/gi;
    const shorthandMatches = css.matchAll(fontShorthandPattern);
    
    for (const match of shorthandMatches) {
      const value = match[1].trim();
      // Font shorthand: [style] [variant] [weight] [size]/[line-height] family
      // Extract family (last part after size)
      const parts = value.split(/\s+/);
      if (parts.length >= 2) {
        // Family is typically the last part(s)
        const familyPart = parts.slice(-1).join(' ');
        const familyList = familyPart.split(',').map(f => f.trim());
        
        familyList.forEach(family => {
          const normalized = family.replace(/['"]/g, '').trim();
          if (normalized && normalized !== 'inherit' && normalized !== 'initial' && normalized !== 'unset') {
            families.add(normalized);
          }
        });
      }
    }
    
    return Array.from(families).sort();
  }

  /**
   * Extract font-size values from CSS
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique font sizes
   */
  extractFontSizes(css) {
    const sizes = new Set();
    
    // Match font-size declarations
    const fontSizePattern = /font-size\s*:\s*([^;{}]+)/gi;
    const matches = css.matchAll(fontSizePattern);
    
    for (const match of matches) {
      const value = match[1].trim();
      // Validate it's a proper size value (number + unit)
      if (this.isValidSizeValue(value)) {
        sizes.add(value);
      }
    }
    
    // Also extract from shorthand font property
    const fontShorthandPattern = /\bfont\s*:\s*([^;{}]+)/gi;
    const shorthandMatches = css.matchAll(fontShorthandPattern);
    
    for (const match of shorthandMatches) {
      const value = match[1].trim();
      // Extract size from shorthand (typically before the family)
      const sizeMatch = value.match(/(\d+(?:\.\d+)?(?:px|em|rem|%|pt|vh|vw))/i);
      if (sizeMatch && this.isValidSizeValue(sizeMatch[1])) {
        sizes.add(sizeMatch[1]);
      }
    }
    
    return Array.from(sizes).sort();
  }

  /**
   * Extract font-weight values from CSS
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique font weights
   */
  extractFontWeights(css) {
    const weights = new Set();
    
    // Match font-weight declarations
    const fontWeightPattern = /font-weight\s*:\s*([^;{}]+)/gi;
    const matches = css.matchAll(fontWeightPattern);
    
    for (const match of matches) {
      const value = match[1].trim();
      // Normalize weight values
      const normalized = this.normalizeFontWeight(value);
      if (normalized) {
        weights.add(normalized);
      }
    }
    
    // Also extract from shorthand font property
    const fontShorthandPattern = /\bfont\s*:\s*([^;{}]+)/gi;
    const shorthandMatches = css.matchAll(fontShorthandPattern);
    
    for (const match of shorthandMatches) {
      const value = match[1].trim();
      // Extract weight from shorthand (keywords or numbers)
      const weightMatch = value.match(/\b(bold|bolder|lighter|normal|\d{3})\b/i);
      if (weightMatch) {
        const normalized = this.normalizeFontWeight(weightMatch[1]);
        if (normalized) {
          weights.add(normalized);
        }
      }
    }
    
    // Add default if none found
    if (weights.size === 0) {
      weights.add('400');
    }
    
    return Array.from(weights).sort();
  }

  /**
   * Extract line-height values from CSS
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique line heights
   */
  extractLineHeights(css) {
    const lineHeights = new Set();
    
    // Match line-height declarations
    const lineHeightPattern = /line-height\s*:\s*([^;{}]+)/gi;
    const matches = css.matchAll(lineHeightPattern);
    
    for (const match of matches) {
      const value = match[1].trim();
      // Validate line-height value
      if (this.isValidLineHeight(value)) {
        lineHeights.add(value);
      }
    }
    
    // Also extract from shorthand font property
    const fontShorthandPattern = /\bfont\s*:\s*([^;{}]+)/gi;
    const shorthandMatches = css.matchAll(fontShorthandPattern);
    
    for (const match of shorthandMatches) {
      const value = match[1].trim();
      // Extract line-height from shorthand (after size with /)
      const lineHeightMatch = value.match(/\/\s*([^\s]+)/);
      if (lineHeightMatch && this.isValidLineHeight(lineHeightMatch[1])) {
        lineHeights.add(lineHeightMatch[1]);
      }
    }
    
    // Add default if none found
    if (lineHeights.size === 0) {
      lineHeights.add('normal');
    }
    
    return Array.from(lineHeights).sort();
  }

  /**
   * Validate if a value is a proper size value
   * @param {string} value - Value to validate
   * @returns {boolean} True if valid size
   */
  isValidSizeValue(value) {
    if (!value) return false;
    
    // Check for valid CSS size units
    const validUnits = /^(\d+(?:\.\d+)?)(px|em|rem|%|pt|vh|vw|vmin|vmax|ch|ex)$/i;
    const keywords = /^(xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)$/i;
    
    return validUnits.test(value) || keywords.test(value);
  }

  /**
   * Normalize font-weight values
   * @param {string} weight - Font weight value
   * @returns {string|null} Normalized weight or null if invalid
   */
  normalizeFontWeight(weight) {
    if (!weight) return null;
    
    const value = weight.toLowerCase().trim();
    
    // Map keywords to numeric values
    const weightMap = {
      'normal': '400',
      'bold': '700',
      'bolder': '700',
      'lighter': '300'
    };
    
    if (weightMap[value]) {
      return weightMap[value];
    }
    
    // Validate numeric weights (100-900)
    const numericWeight = parseInt(value, 10);
    if (!isNaN(numericWeight) && numericWeight >= 100 && numericWeight <= 900 && numericWeight % 100 === 0) {
      return numericWeight.toString();
    }
    
    return null;
  }

  /**
   * Validate line-height value
   * @param {string} value - Line height value
   * @returns {boolean} True if valid
   */
  isValidLineHeight(value) {
    if (!value) return false;
    
    const trimmed = value.trim();
    
    // Keywords
    if (/^(normal|inherit|initial|unset)$/i.test(trimmed)) {
      return true;
    }
    
    // Unitless numbers
    if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
      return true;
    }
    
    // Values with units
    if (/^\d+(?:\.\d+)?(px|em|rem|%|pt|vh|vw)$/i.test(trimmed)) {
      return true;
    }
    
    return false;
  }

  /**
   * Extract spacing values from CSS content
   * @param {string} css - CSS content
   * @returns {Array<string>} Array of unique, normalized spacing values
   */
  extractSpacing(css) {
    if (!css || typeof css !== 'string') {
      return [];
    }

    const spacingValues = new Set();

    // Extract padding values
    const paddingPattern = /padding(?:-(?:top|right|bottom|left))?\s*:\s*([^;{}]+)/gi;
    const paddingMatches = css.matchAll(paddingPattern);
    
    for (const match of paddingMatches) {
      const values = this.parseSpacingValue(match[1]);
      values.forEach(val => spacingValues.add(val));
    }

    // Extract margin values
    const marginPattern = /margin(?:-(?:top|right|bottom|left))?\s*:\s*([^;{}]+)/gi;
    const marginMatches = css.matchAll(marginPattern);
    
    for (const match of marginMatches) {
      const values = this.parseSpacingValue(match[1]);
      values.forEach(val => spacingValues.add(val));
    }

    // Extract gap values (for flexbox/grid)
    const gapPattern = /(?:gap|column-gap|row-gap)\s*:\s*([^;{}]+)/gi;
    const gapMatches = css.matchAll(gapPattern);
    
    for (const match of gapMatches) {
      const values = this.parseSpacingValue(match[1]);
      values.forEach(val => spacingValues.add(val));
    }

    return Array.from(spacingValues).sort(this.compareSpacingValues.bind(this));
  }

  /**
   * Parse spacing value and extract individual values
   * @param {string} value - Spacing value (can be shorthand)
   * @returns {Array<string>} Array of normalized spacing values
   */
  parseSpacingValue(value) {
    if (!value) return [];
    
    const trimmed = value.trim();
    
    // Skip keywords and invalid values
    if (/^(auto|inherit|initial|unset|0)$/i.test(trimmed)) {
      return [];
    }

    const values = [];
    
    // Split by whitespace for shorthand values (e.g., "10px 20px")
    const parts = trimmed.split(/\s+/);
    
    for (const part of parts) {
      const normalized = this.normalizeSpacingValue(part);
      if (normalized) {
        values.push(normalized);
      }
    }
    
    return values;
  }

  /**
   * Normalize spacing value to consistent format
   * @param {string} value - Spacing value
   * @returns {string|null} Normalized value or null if invalid
   */
  normalizeSpacingValue(value) {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    // Skip keywords
    if (/^(auto|inherit|initial|unset)$/i.test(trimmed)) {
      return null;
    }
    
    // Match valid CSS length units
    const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|pt|cm|mm|in)$/i);
    
    if (match) {
      const number = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      
      // Skip zero values
      if (number === 0) {
        return null;
      }
      
      // Return normalized value
      return `${number}${unit}`;
    }
    
    return null;
  }

  /**
   * Compare spacing values for sorting
   * @param {string} a - First spacing value
   * @param {string} b - Second spacing value
   * @returns {number} Comparison result
   */
  compareSpacingValues(a, b) {
    // Extract numeric value and unit
    const parseValue = (val) => {
      const match = val.match(/^(-?\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|pt|cm|mm|in)$/i);
      if (!match) return { num: 0, unit: '' };
      return { num: parseFloat(match[1]), unit: match[2].toLowerCase() };
    };
    
    const aVal = parseValue(a);
    const bVal = parseValue(b);
    
    // Sort by unit first (px, rem, em, %, etc.)
    if (aVal.unit !== bVal.unit) {
      const unitOrder = ['px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax', 'ch', 'ex', 'pt', 'cm', 'mm', 'in'];
      const aIndex = unitOrder.indexOf(aVal.unit);
      const bIndex = unitOrder.indexOf(bVal.unit);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    
    // Then sort by numeric value
    return aVal.num - bVal.num;
  }

  /**
   * Extract effect tokens (shadows, filters) from CSS content
   * @param {string} css - CSS content
   * @returns {Array<Object>} Array of effect tokens
   */
  extractEffects(css) {
    if (!css || typeof css !== 'string') {
      return [];
    }

    const effects = [];
    const seenEffects = new Set();

    // Extract box-shadow values
    const boxShadowPattern = /box-shadow\s*:\s*([^;{}]+)/gi;
    const boxShadowMatches = css.matchAll(boxShadowPattern);
    
    for (const match of boxShadowMatches) {
      const value = match[1].trim();
      
      // Skip none keyword
      if (value.toLowerCase() === 'none') {
        continue;
      }
      
      const normalized = this.normalizeBoxShadow(value);
      const key = `shadow:${normalized}`;
      
      if (!seenEffects.has(key)) {
        effects.push({
          type: 'shadow',
          property: 'box-shadow',
          value: normalized
        });
        seenEffects.add(key);
      }
    }

    // Extract text-shadow values
    const textShadowPattern = /text-shadow\s*:\s*([^;{}]+)/gi;
    const textShadowMatches = css.matchAll(textShadowPattern);
    
    for (const match of textShadowMatches) {
      const value = match[1].trim();
      
      // Skip none keyword
      if (value.toLowerCase() === 'none') {
        continue;
      }
      
      const normalized = this.normalizeBoxShadow(value); // Same normalization logic
      const key = `text-shadow:${normalized}`;
      
      if (!seenEffects.has(key)) {
        effects.push({
          type: 'shadow',
          property: 'text-shadow',
          value: normalized
        });
        seenEffects.add(key);
      }
    }

    // Extract border-radius values
    const borderRadiusPattern = /border-radius\s*:\s*([^;{}]+)/gi;
    const borderRadiusMatches = css.matchAll(borderRadiusPattern);
    
    for (const match of borderRadiusMatches) {
      const value = match[1].trim();
      const normalized = this.normalizeBorderRadius(value);
      
      if (normalized) {
        const key = `radius:${normalized}`;
        
        if (!seenEffects.has(key)) {
          effects.push({
            type: 'radius',
            property: 'border-radius',
            value: normalized
          });
          seenEffects.add(key);
        }
      }
    }

    // Extract individual border-radius corners
    const cornerPattern = /border-(?:top-left|top-right|bottom-left|bottom-right)-radius\s*:\s*([^;{}]+)/gi;
    const cornerMatches = css.matchAll(cornerPattern);
    
    for (const match of cornerMatches) {
      const value = match[1].trim();
      const normalized = this.normalizeBorderRadius(value);
      
      if (normalized) {
        const key = `radius:${normalized}`;
        
        if (!seenEffects.has(key)) {
          effects.push({
            type: 'radius',
            property: 'border-radius',
            value: normalized
          });
          seenEffects.add(key);
        }
      }
    }

    // Extract filter values
    const filterPattern = /filter\s*:\s*([^;{}]+)/gi;
    const filterMatches = css.matchAll(filterPattern);
    
    for (const match of filterMatches) {
      const value = match[1].trim();
      
      // Skip none keyword
      if (value.toLowerCase() === 'none') {
        continue;
      }
      
      const key = `filter:${value}`;
      
      if (!seenEffects.has(key)) {
        effects.push({
          type: 'filter',
          property: 'filter',
          value: value
        });
        seenEffects.add(key);
      }
    }

    return effects;
  }

  /**
   * Normalize box-shadow value
   * @param {string} value - Box shadow value
   * @returns {string} Normalized value
   */
  normalizeBoxShadow(value) {
    if (!value) return '';
    
    // Trim and normalize whitespace
    return value.trim().replace(/\s+/g, ' ');
  }

  /**
   * Normalize border-radius value
   * @param {string} value - Border radius value
   * @returns {string|null} Normalized value or null if invalid
   */
  normalizeBorderRadius(value) {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    // Skip keywords
    if (/^(inherit|initial|unset)$/i.test(trimmed)) {
      return null;
    }
    
    // Validate it contains valid length units
    const validPattern = /^[\d.]+(?:px|em|rem|%|vh|vw)(?:\s+[\d.]+(?:px|em|rem|%|vh|vw))*$/i;
    
    if (validPattern.test(trimmed)) {
      return trimmed;
    }
    
    return null;
  }

  /**
   * Extract keyframe animations from CSS content
   * @param {string} css - CSS content
   * @returns {Array<Object>} Array of animation tokens
   */
  extractKeyframes(css) {
    if (!css || typeof css !== 'string') {
      return [];
    }

    const animations = [];
    const seenAnimations = new Set();

    // Regex to match @keyframes rules
    // Matches: @keyframes name { ... }
    // Handles both @keyframes and @-webkit-keyframes
    const keyframesPattern = /@(?:-webkit-|-moz-|-o-|-ms-)?keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/gi;
    
    let match;
    while ((match = keyframesPattern.exec(css)) !== null) {
      const animationName = match[1].trim();
      const keyframesBody = match[2].trim();
      const fullDefinition = match[0];

      // Skip if we've already seen this animation name
      if (seenAnimations.has(animationName)) {
        continue;
      }

      // Extract additional animation properties if they exist nearby
      const duration = this.extractAnimationProperty(css, animationName, 'animation-duration');
      const timingFunction = this.extractAnimationProperty(css, animationName, 'animation-timing-function');
      const delay = this.extractAnimationProperty(css, animationName, 'animation-delay');
      const iterationCount = this.extractAnimationProperty(css, animationName, 'animation-iteration-count');

      const animationToken = {
        name: animationName,
        keyframes: fullDefinition,
        duration: duration || undefined,
        timingFunction: timingFunction || undefined,
        delay: delay || undefined,
        iterationCount: iterationCount || undefined
      };

      animations.push(animationToken);
      seenAnimations.add(animationName);
    }

    return animations;
  }

  /**
   * Extract animation property value for a specific animation name
   * @param {string} css - CSS content
   * @param {string} animationName - Animation name to search for
   * @param {string} property - Property to extract (e.g., 'animation-duration')
   * @returns {string|null} Property value or null if not found
   */
  extractAnimationProperty(css, animationName, property) {
    // Look for the property in rules that use this animation
    // Pattern: animation-name: animationName; or animation: ... animationName ...;
    
    // First, try to find animation shorthand or animation-name that references this animation
    const animationNamePattern = new RegExp(
      `(?:animation(?:-name)?\\s*:[^;{]*\\b${animationName}\\b[^;{]*;)`,
      'gi'
    );
    
    const animationRuleMatch = css.match(animationNamePattern);
    if (!animationRuleMatch) {
      return null;
    }

    // Find the block containing this animation reference
    const blockPattern = new RegExp(
      `[^}]*(?:animation(?:-name)?\\s*:[^;{]*\\b${animationName}\\b[^;{]*;)[^}]*`,
      'gi'
    );
    
    const blockMatch = css.match(blockPattern);
    if (!blockMatch || blockMatch.length === 0) {
      return null;
    }

    // Search for the specific property in the block
    const propertyPattern = new RegExp(
      `${property}\\s*:\\s*([^;{}]+)`,
      'i'
    );
    
    for (const block of blockMatch) {
      const propMatch = block.match(propertyPattern);
      if (propMatch) {
        return propMatch[1].trim();
      }
    }

    // Also check animation shorthand property
    if (property === 'animation-duration' || 
        property === 'animation-timing-function' || 
        property === 'animation-delay' ||
        property === 'animation-iteration-count') {
      
      const shorthandPattern = new RegExp(
        `animation\\s*:\\s*([^;{}]+\\b${animationName}\\b[^;{}]*)`,
        'i'
      );
      
      for (const block of blockMatch) {
        const shorthandMatch = block.match(shorthandPattern);
        if (shorthandMatch) {
          return this.parseAnimationShorthand(shorthandMatch[1], property);
        }
      }
    }

    return null;
  }

  /**
   * Parse animation shorthand to extract specific property
   * @param {string} shorthand - Animation shorthand value
   * @param {string} property - Property to extract
   * @returns {string|null} Property value or null
   */
  parseAnimationShorthand(shorthand, property) {
    // Animation shorthand format:
    // animation: duration timing-function delay iteration-count direction fill-mode play-state name;
    
    const parts = shorthand.trim().split(/\s+/);
    
    // Duration is typically the first time value
    if (property === 'animation-duration') {
      const timeValue = parts.find(part => /^\d+(?:\.\d+)?m?s$/.test(part));
      return timeValue || null;
    }
    
    // Timing function (ease, linear, cubic-bezier, etc.)
    if (property === 'animation-timing-function') {
      const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
      const timing = parts.find(part => 
        timingFunctions.includes(part) || part.startsWith('cubic-bezier') || part.startsWith('steps')
      );
      return timing || null;
    }
    
    // Delay is typically the second time value
    if (property === 'animation-delay') {
      const timeValues = parts.filter(part => /^\d+(?:\.\d+)?m?s$/.test(part));
      return timeValues.length > 1 ? timeValues[1] : null;
    }
    
    // Iteration count (number or 'infinite')
    if (property === 'animation-iteration-count') {
      const iteration = parts.find(part => /^\d+$/.test(part) || part === 'infinite');
      return iteration || null;
    }
    
    return null;
  }

  /**
   * Generic deduplication utility
   * @param {Array} values - Array of values to deduplicate
   * @returns {Array} Deduplicated array
   */
  deduplicateValues(values) {
    return Array.from(new Set(values));
  }
}

module.exports = CSSParser;
