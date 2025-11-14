const CSSParser = require('../CSSParser');

describe('CSSParser - Color Extraction', () => {
  let parser;

  beforeEach(() => {
    parser = new CSSParser();
  });

  describe('extractColors', () => {
    test('should extract HEX colors from CSS', () => {
      const css = `
        .class1 { color: #FF0000; }
        .class2 { background: #00ff00; }
        .class3 { border-color: #0000FF; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors).toContain('#00FF00');
      expect(colors).toContain('#0000FF');
      expect(colors.length).toBe(3);
    });

    test('should extract 3-digit HEX colors and expand them', () => {
      const css = `
        .class1 { color: #F00; }
        .class2 { background: #0F0; }
        .class3 { border-color: #00F; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors).toContain('#00FF00');
      expect(colors).toContain('#0000FF');
      expect(colors.length).toBe(3);
    });

    test('should extract RGB colors from CSS', () => {
      const css = `
        .class1 { color: rgb(255, 0, 0); }
        .class2 { background: rgb(0, 255, 0); }
        .class3 { border-color: rgb(0, 0, 255); }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('rgba(255, 0, 0, 1)');
      expect(colors).toContain('rgba(0, 255, 0, 1)');
      expect(colors).toContain('rgba(0, 0, 255, 1)');
      expect(colors.length).toBe(3);
    });

    test('should extract RGBA colors from CSS', () => {
      const css = `
        .class1 { color: rgba(255, 0, 0, 0.5); }
        .class2 { background: rgba(0, 255, 0, 0.8); }
        .class3 { border-color: rgba(0, 0, 255, 1); }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('rgba(255, 0, 0, 0.5)');
      expect(colors).toContain('rgba(0, 255, 0, 0.8)');
      expect(colors).toContain('rgba(0, 0, 255, 1)');
      expect(colors.length).toBe(3);
    });

    test('should handle mixed color formats', () => {
      const css = `
        .class1 { color: #FF0000; }
        .class2 { background: rgb(0, 255, 0); }
        .class3 { border-color: rgba(0, 0, 255, 0.5); }
        .class4 { box-shadow: 0 0 10px #FFF; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors).toContain('rgba(0, 255, 0, 1)');
      expect(colors).toContain('rgba(0, 0, 255, 0.5)');
      expect(colors).toContain('#FFFFFF');
      expect(colors.length).toBe(4);
    });

    test('should deduplicate identical colors', () => {
      const css = `
        .class1 { color: #FF0000; }
        .class2 { background: #FF0000; }
        .class3 { border-color: #ff0000; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors.length).toBe(1);
    });

    test('should deduplicate 3-digit and 6-digit equivalent HEX colors', () => {
      const css = `
        .class1 { color: #F00; }
        .class2 { background: #FF0000; }
        .class3 { border-color: #ff0000; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors.length).toBe(1);
    });

    test('should handle RGB with varying whitespace', () => {
      const css = `
        .class1 { color: rgb(255,0,0); }
        .class2 { background: rgb( 255 , 0 , 0 ); }
        .class3 { border: rgb(255,  0,  0); }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('rgba(255, 0, 0, 1)');
      expect(colors.length).toBe(1);
    });

    test('should return empty array for empty CSS', () => {
      const colors = parser.extractColors('');
      expect(colors).toEqual([]);
    });

    test('should return empty array for null input', () => {
      const colors = parser.extractColors(null);
      expect(colors).toEqual([]);
    });

    test('should return empty array for undefined input', () => {
      const colors = parser.extractColors(undefined);
      expect(colors).toEqual([]);
    });

    test('should return empty array for CSS with no colors', () => {
      const css = `
        .class1 { font-size: 16px; }
        .class2 { margin: 10px; }
      `;
      
      const colors = parser.extractColors(css);
      expect(colors).toEqual([]);
    });

    test('should handle malformed color values gracefully', () => {
      const css = `
        .class1 { color: #GGGGGG; }
        .class2 { background: rgb(999, 999, 999); }
        .class3 { border: #FF0000; }
      `;
      
      const colors = parser.extractColors(css);
      
      // Should still extract valid colors
      expect(colors).toContain('#FF0000');
    });

    test('should extract colors from complex CSS with multiple properties', () => {
      const css = `
        body {
          background: linear-gradient(to right, #FF0000, #00FF00);
          color: #333;
        }
        .button {
          background-color: rgba(0, 123, 255, 0.8);
          border: 1px solid #007bff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors.length).toBeGreaterThan(0);
      expect(colors).toContain('#FF0000');
      expect(colors).toContain('#00FF00');
      expect(colors).toContain('#333333');
    });

    test('should normalize case for HEX colors', () => {
      const css = `
        .class1 { color: #ff0000; }
        .class2 { background: #FF0000; }
        .class3 { border: #Ff0000; }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('#FF0000');
      expect(colors.length).toBe(1);
    });

    test('should handle RGBA with decimal alpha values', () => {
      const css = `
        .class1 { color: rgba(255, 0, 0, 0.5); }
        .class2 { background: rgba(255, 0, 0, 0.50); }
        .class3 { border: rgba(255, 0, 0, 0.500); }
      `;
      
      const colors = parser.extractColors(css);
      
      expect(colors).toContain('rgba(255, 0, 0, 0.5)');
      expect(colors.length).toBe(1);
    });
  });

  describe('normalizeHexColor', () => {
    test('should convert HEX to uppercase', () => {
      expect(parser.normalizeHexColor('#ff0000')).toBe('#FF0000');
      expect(parser.normalizeHexColor('#Ff0000')).toBe('#FF0000');
    });

    test('should expand 3-digit HEX to 6-digit', () => {
      expect(parser.normalizeHexColor('#F00')).toBe('#FF0000');
      expect(parser.normalizeHexColor('#0F0')).toBe('#00FF00');
      expect(parser.normalizeHexColor('#00F')).toBe('#0000FF');
      expect(parser.normalizeHexColor('#FFF')).toBe('#FFFFFF');
      expect(parser.normalizeHexColor('#000')).toBe('#000000');
    });

    test('should keep 6-digit HEX as is (but uppercase)', () => {
      expect(parser.normalizeHexColor('#ff0000')).toBe('#FF0000');
      expect(parser.normalizeHexColor('#FF0000')).toBe('#FF0000');
    });
  });

  describe('normalizeRgbColor', () => {
    test('should convert RGB to RGBA format', () => {
      expect(parser.normalizeRgbColor('rgb(255, 0, 0)')).toBe('rgba(255, 0, 0, 1)');
      expect(parser.normalizeRgbColor('rgb(0, 255, 0)')).toBe('rgba(0, 255, 0, 1)');
    });

    test('should normalize RGBA spacing', () => {
      expect(parser.normalizeRgbColor('rgba(255,0,0,0.5)')).toBe('rgba(255, 0, 0, 0.5)');
      expect(parser.normalizeRgbColor('rgba( 255 , 0 , 0 , 0.5 )')).toBe('rgba(255, 0, 0, 0.5)');
    });

    test('should handle alpha value of 1', () => {
      expect(parser.normalizeRgbColor('rgba(255, 0, 0, 1)')).toBe('rgba(255, 0, 0, 1)');
      expect(parser.normalizeRgbColor('rgba(255, 0, 0, 1.0)')).toBe('rgba(255, 0, 0, 1)');
    });

    test('should preserve decimal alpha values', () => {
      expect(parser.normalizeRgbColor('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
      expect(parser.normalizeRgbColor('rgba(255, 0, 0, 0.75)')).toBe('rgba(255, 0, 0, 0.75)');
    });
  });

  describe('deduplicateValues', () => {
    test('should remove duplicate values', () => {
      const values = ['#FF0000', '#00FF00', '#FF0000', '#0000FF', '#00FF00'];
      const result = parser.deduplicateValues(values);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('#FF0000');
      expect(result).toContain('#00FF00');
      expect(result).toContain('#0000FF');
    });

    test('should handle empty array', () => {
      expect(parser.deduplicateValues([])).toEqual([]);
    });

    test('should handle array with no duplicates', () => {
      const values = ['#FF0000', '#00FF00', '#0000FF'];
      const result = parser.deduplicateValues(values);
      
      expect(result).toHaveLength(3);
    });
  });
});

describe('CSSParser - Typography Extraction', () => {
  let parser;

  beforeEach(() => {
    parser = new CSSParser();
  });

  describe('extractFonts', () => {
    test('should extract font tokens with all properties', () => {
      const css = `
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
        }
        h1 {
          font-family: "Helvetica Neue", Helvetica;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }
      `;
      
      const fonts = parser.extractFonts(css);
      
      expect(fonts.length).toBeGreaterThan(0);
      expect(fonts[0]).toHaveProperty('family');
      expect(fonts[0]).toHaveProperty('size');
      expect(fonts[0]).toHaveProperty('weight');
      expect(fonts[0]).toHaveProperty('lineHeight');
    });

    test('should return empty array for empty CSS', () => {
      const fonts = parser.extractFonts('');
      expect(fonts).toEqual([]);
    });

    test('should return empty array for null input', () => {
      const fonts = parser.extractFonts(null);
      expect(fonts).toEqual([]);
    });

    test('should handle CSS with no font properties', () => {
      const css = `
        .class1 { color: #FF0000; }
        .class2 { margin: 10px; }
      `;
      
      const fonts = parser.extractFonts(css);
      expect(fonts).toEqual([]);
    });
  });

  describe('extractFontFamilies', () => {
    test('should extract font-family values', () => {
      const css = `
        body { font-family: Arial, sans-serif; }
        h1 { font-family: "Helvetica Neue", Helvetica; }
        p { font-family: 'Georgia', serif; }
      `;
      
      const families = parser.extractFontFamilies(css);
      
      expect(families).toContain('Arial');
      expect(families).toContain('sans-serif');
      expect(families).toContain('Helvetica Neue');
      expect(families).toContain('Helvetica');
      expect(families).toContain('Georgia');
      expect(families).toContain('serif');
    });

    test('should remove quotes from font names', () => {
      const css = `
        body { font-family: "Arial", 'Helvetica', sans-serif; }
      `;
      
      const families = parser.extractFontFamilies(css);
      
      expect(families).toContain('Arial');
      expect(families).toContain('Helvetica');
      expect(families).not.toContain('"Arial"');
      expect(families).not.toContain("'Helvetica'");
    });

    test('should deduplicate font families', () => {
      const css = `
        body { font-family: Arial, sans-serif; }
        h1 { font-family: Arial, sans-serif; }
        p { font-family: Arial; }
      `;
      
      const families = parser.extractFontFamilies(css);
      
      const arialCount = families.filter(f => f === 'Arial').length;
      expect(arialCount).toBe(1);
    });

    test('should extract from shorthand font property', () => {
      const css = `
        body { font: 16px/1.5 Arial, sans-serif; }
        h1 { font: bold 32px Georgia; }
      `;
      
      const families = parser.extractFontFamilies(css);
      
      expect(families.length).toBeGreaterThan(0);
    });

    test('should filter out CSS keywords', () => {
      const css = `
        body { font-family: Arial, sans-serif; }
        h1 { font-family: inherit; }
        p { font-family: initial; }
        span { font-family: unset; }
      `;
      
      const families = parser.extractFontFamilies(css);
      
      expect(families).not.toContain('inherit');
      expect(families).not.toContain('initial');
      expect(families).not.toContain('unset');
      expect(families).toContain('Arial');
    });
  });

  describe('extractFontSizes', () => {
    test('should extract font-size values in px', () => {
      const css = `
        body { font-size: 16px; }
        h1 { font-size: 32px; }
        small { font-size: 12px; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('16px');
      expect(sizes).toContain('32px');
      expect(sizes).toContain('12px');
    });

    test('should extract font-size values in rem', () => {
      const css = `
        body { font-size: 1rem; }
        h1 { font-size: 2rem; }
        small { font-size: 0.875rem; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('1rem');
      expect(sizes).toContain('2rem');
      expect(sizes).toContain('0.875rem');
    });

    test('should extract font-size values in em', () => {
      const css = `
        body { font-size: 1em; }
        h1 { font-size: 2em; }
        small { font-size: 0.75em; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('1em');
      expect(sizes).toContain('2em');
      expect(sizes).toContain('0.75em');
    });

    test('should extract font-size values in percentage', () => {
      const css = `
        body { font-size: 100%; }
        h1 { font-size: 200%; }
        small { font-size: 87.5%; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('100%');
      expect(sizes).toContain('200%');
      expect(sizes).toContain('87.5%');
    });

    test('should extract from shorthand font property', () => {
      const css = `
        body { font: 16px/1.5 Arial; }
        h1 { font: bold 32px Georgia; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('16px');
      expect(sizes).toContain('32px');
    });

    test('should deduplicate font sizes', () => {
      const css = `
        body { font-size: 16px; }
        p { font-size: 16px; }
        div { font-size: 16px; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      const count16px = sizes.filter(s => s === '16px').length;
      expect(count16px).toBe(1);
    });

    test('should handle viewport units', () => {
      const css = `
        h1 { font-size: 5vw; }
        h2 { font-size: 3vh; }
      `;
      
      const sizes = parser.extractFontSizes(css);
      
      expect(sizes).toContain('5vw');
      expect(sizes).toContain('3vh');
    });
  });

  describe('extractFontWeights', () => {
    test('should extract numeric font-weight values', () => {
      const css = `
        body { font-weight: 400; }
        strong { font-weight: 700; }
        h1 { font-weight: 900; }
      `;
      
      const weights = parser.extractFontWeights(css);
      
      expect(weights).toContain('400');
      expect(weights).toContain('700');
      expect(weights).toContain('900');
    });

    test('should normalize keyword font-weight values', () => {
      const css = `
        body { font-weight: normal; }
        strong { font-weight: bold; }
        em { font-weight: lighter; }
      `;
      
      const weights = parser.extractFontWeights(css);
      
      expect(weights).toContain('400'); // normal
      expect(weights).toContain('700'); // bold
      expect(weights).toContain('300'); // lighter
    });

    test('should extract from shorthand font property', () => {
      const css = `
        body { font: normal 16px Arial; }
        h1 { font: bold 32px Georgia; }
      `;
      
      const weights = parser.extractFontWeights(css);
      
      expect(weights).toContain('400'); // normal
      expect(weights).toContain('700'); // bold
    });

    test('should deduplicate font weights', () => {
      const css = `
        body { font-weight: 400; }
        p { font-weight: normal; }
        div { font-weight: 400; }
      `;
      
      const weights = parser.extractFontWeights(css);
      
      const count400 = weights.filter(w => w === '400').length;
      expect(count400).toBe(1);
    });

    test('should add default weight if none found', () => {
      const css = `
        body { font-family: Arial; }
      `;
      
      const weights = parser.extractFontWeights(css);
      
      expect(weights).toContain('400');
    });
  });

  describe('extractLineHeights', () => {
    test('should extract unitless line-height values', () => {
      const css = `
        body { line-height: 1.5; }
        h1 { line-height: 1.2; }
        p { line-height: 1.6; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      expect(lineHeights).toContain('1.5');
      expect(lineHeights).toContain('1.2');
      expect(lineHeights).toContain('1.6');
    });

    test('should extract line-height values with units', () => {
      const css = `
        body { line-height: 24px; }
        h1 { line-height: 2rem; }
        p { line-height: 150%; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      expect(lineHeights).toContain('24px');
      expect(lineHeights).toContain('2rem');
      expect(lineHeights).toContain('150%');
    });

    test('should extract from shorthand font property', () => {
      const css = `
        body { font: 16px/1.5 Arial; }
        h1 { font: 32px/1.2 Georgia; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      expect(lineHeights).toContain('1.5');
      expect(lineHeights).toContain('1.2');
    });

    test('should handle normal keyword', () => {
      const css = `
        body { line-height: normal; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      expect(lineHeights).toContain('normal');
    });

    test('should deduplicate line heights', () => {
      const css = `
        body { line-height: 1.5; }
        p { line-height: 1.5; }
        div { line-height: 1.5; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      const count15 = lineHeights.filter(lh => lh === '1.5').length;
      expect(count15).toBe(1);
    });

    test('should add default line-height if none found', () => {
      const css = `
        body { font-family: Arial; }
      `;
      
      const lineHeights = parser.extractLineHeights(css);
      
      expect(lineHeights).toContain('normal');
    });
  });

  describe('normalizeFontWeight', () => {
    test('should convert normal to 400', () => {
      expect(parser.normalizeFontWeight('normal')).toBe('400');
    });

    test('should convert bold to 700', () => {
      expect(parser.normalizeFontWeight('bold')).toBe('700');
    });

    test('should convert bolder to 700', () => {
      expect(parser.normalizeFontWeight('bolder')).toBe('700');
    });

    test('should convert lighter to 300', () => {
      expect(parser.normalizeFontWeight('lighter')).toBe('300');
    });

    test('should accept valid numeric weights', () => {
      expect(parser.normalizeFontWeight('100')).toBe('100');
      expect(parser.normalizeFontWeight('400')).toBe('400');
      expect(parser.normalizeFontWeight('700')).toBe('700');
      expect(parser.normalizeFontWeight('900')).toBe('900');
    });

    test('should reject invalid numeric weights', () => {
      expect(parser.normalizeFontWeight('50')).toBeNull();
      expect(parser.normalizeFontWeight('450')).toBeNull();
      expect(parser.normalizeFontWeight('1000')).toBeNull();
    });

    test('should handle case insensitivity', () => {
      expect(parser.normalizeFontWeight('BOLD')).toBe('700');
      expect(parser.normalizeFontWeight('Normal')).toBe('400');
    });
  });

  describe('isValidSizeValue', () => {
    test('should validate px values', () => {
      expect(parser.isValidSizeValue('16px')).toBe(true);
      expect(parser.isValidSizeValue('1.5px')).toBe(true);
    });

    test('should validate rem values', () => {
      expect(parser.isValidSizeValue('1rem')).toBe(true);
      expect(parser.isValidSizeValue('1.5rem')).toBe(true);
    });

    test('should validate em values', () => {
      expect(parser.isValidSizeValue('1em')).toBe(true);
      expect(parser.isValidSizeValue('0.875em')).toBe(true);
    });

    test('should validate percentage values', () => {
      expect(parser.isValidSizeValue('100%')).toBe(true);
      expect(parser.isValidSizeValue('87.5%')).toBe(true);
    });

    test('should validate viewport units', () => {
      expect(parser.isValidSizeValue('5vw')).toBe(true);
      expect(parser.isValidSizeValue('3vh')).toBe(true);
      expect(parser.isValidSizeValue('2vmin')).toBe(true);
      expect(parser.isValidSizeValue('4vmax')).toBe(true);
    });

    test('should validate keyword values', () => {
      expect(parser.isValidSizeValue('small')).toBe(true);
      expect(parser.isValidSizeValue('medium')).toBe(true);
      expect(parser.isValidSizeValue('large')).toBe(true);
      expect(parser.isValidSizeValue('x-large')).toBe(true);
    });

    test('should reject invalid values', () => {
      expect(parser.isValidSizeValue('')).toBe(false);
      expect(parser.isValidSizeValue('invalid')).toBe(false);
      expect(parser.isValidSizeValue('16')).toBe(false);
      expect(parser.isValidSizeValue('px')).toBe(false);
    });
  });

  describe('isValidLineHeight', () => {
    test('should validate unitless numbers', () => {
      expect(parser.isValidLineHeight('1.5')).toBe(true);
      expect(parser.isValidLineHeight('1')).toBe(true);
      expect(parser.isValidLineHeight('2.5')).toBe(true);
    });

    test('should validate values with units', () => {
      expect(parser.isValidLineHeight('24px')).toBe(true);
      expect(parser.isValidLineHeight('1.5rem')).toBe(true);
      expect(parser.isValidLineHeight('150%')).toBe(true);
    });

    test('should validate keywords', () => {
      expect(parser.isValidLineHeight('normal')).toBe(true);
      expect(parser.isValidLineHeight('inherit')).toBe(true);
      expect(parser.isValidLineHeight('initial')).toBe(true);
    });

    test('should reject invalid values', () => {
      expect(parser.isValidLineHeight('')).toBe(false);
      expect(parser.isValidLineHeight('invalid')).toBe(false);
      expect(parser.isValidLineHeight('bold')).toBe(false);
    });
  });
});
