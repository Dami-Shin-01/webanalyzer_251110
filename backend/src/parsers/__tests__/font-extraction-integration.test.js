/**
 * Integration test for font extraction
 * Verifies that fonts are extracted correctly from realistic CSS
 */

const CSSParser = require('../CSSParser');

describe('Font Extraction Integration', () => {
  let parser;

  beforeEach(() => {
    parser = new CSSParser();
  });

  test('should extract fonts from realistic CSS', () => {
    const css = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
      }
      
      h1 {
        font-family: Georgia, serif;
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
      }
      
      h2 {
        font-family: Georgia, serif;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.3;
      }
      
      .button {
        font: bold 14px/1 Arial, sans-serif;
      }
      
      .small-text {
        font-size: 0.875rem;
        line-height: 1.4;
      }
    `;
    
    const fonts = parser.extractFonts(css);
    
    // Should extract font tokens
    expect(fonts.length).toBeGreaterThan(0);
    
    // Each token should have all required properties
    fonts.forEach(font => {
      expect(font).toHaveProperty('family');
      expect(font).toHaveProperty('size');
      expect(font).toHaveProperty('weight');
      expect(font).toHaveProperty('lineHeight');
      
      expect(typeof font.family).toBe('string');
      expect(typeof font.size).toBe('string');
      expect(typeof font.weight).toBe('string');
      expect(typeof font.lineHeight).toBe('string');
    });
  });

  test('should extract font families correctly', () => {
    const css = `
      body { font-family: Arial, sans-serif; }
      h1 { font-family: "Helvetica Neue", Helvetica; }
      p { font-family: Georgia, serif; }
    `;
    
    const families = parser.extractFontFamilies(css);
    
    expect(families).toContain('Arial');
    expect(families).toContain('sans-serif');
    expect(families).toContain('Helvetica Neue');
    expect(families).toContain('Helvetica');
    expect(families).toContain('Georgia');
    expect(families).toContain('serif');
  });

  test('should extract font sizes with different units', () => {
    const css = `
      body { font-size: 16px; }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5em; }
      small { font-size: 87.5%; }
    `;
    
    const sizes = parser.extractFontSizes(css);
    
    expect(sizes).toContain('16px');
    expect(sizes).toContain('2rem');
    expect(sizes).toContain('1.5em');
    expect(sizes).toContain('87.5%');
  });

  test('should normalize font weights', () => {
    const css = `
      body { font-weight: normal; }
      strong { font-weight: bold; }
      h1 { font-weight: 700; }
      em { font-weight: lighter; }
    `;
    
    const weights = parser.extractFontWeights(css);
    
    expect(weights).toContain('400'); // normal
    expect(weights).toContain('700'); // bold
    expect(weights).toContain('300'); // lighter
  });

  test('should extract line heights', () => {
    const css = `
      body { line-height: 1.5; }
      h1 { line-height: 1.2; }
      p { line-height: 24px; }
      div { line-height: normal; }
    `;
    
    const lineHeights = parser.extractLineHeights(css);
    
    expect(lineHeights).toContain('1.5');
    expect(lineHeights).toContain('1.2');
    expect(lineHeights).toContain('24px');
    expect(lineHeights).toContain('normal');
  });

  test('should handle complex real-world CSS', () => {
    const css = `
      /* Base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.6;
        color: #333;
      }
      
      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 1rem;
      }
      
      h1 { font-size: 2.5rem; }
      h2 { font-size: 2rem; }
      h3 { font-size: 1.75rem; }
      
      p {
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      
      /* Components */
      .button {
        font: bold 14px/1 Arial, sans-serif;
        padding: 10px 20px;
      }
      
      .small {
        font-size: 0.875rem;
        line-height: 1.4;
      }
      
      .code {
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
      }
    `;
    
    const fonts = parser.extractFonts(css);
    
    // Should extract multiple font tokens
    expect(fonts.length).toBeGreaterThan(0);
    
    // Verify structure
    fonts.forEach(font => {
      expect(font).toHaveProperty('family');
      expect(font).toHaveProperty('size');
      expect(font).toHaveProperty('weight');
      expect(font).toHaveProperty('lineHeight');
    });
    
    // Extract individual properties
    const families = parser.extractFontFamilies(css);
    const sizes = parser.extractFontSizes(css);
    const weights = parser.extractFontWeights(css);
    const lineHeights = parser.extractLineHeights(css);
    
    // Verify we extracted various values
    expect(families.length).toBeGreaterThan(0);
    expect(sizes.length).toBeGreaterThan(0);
    expect(weights.length).toBeGreaterThan(0);
    expect(lineHeights.length).toBeGreaterThan(0);
    
    // Check for specific expected values
    expect(families).toContain('Arial');
    expect(sizes).toContain('16px');
    expect(weights).toContain('400');
    expect(weights).toContain('700');
    expect(lineHeights).toContain('1.6');
  });
});
