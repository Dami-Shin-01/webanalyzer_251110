const StaticAnalyzer = require('../StaticAnalyzer');

describe('StaticAnalyzer - Integration Tests', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new StaticAnalyzer({ timeout: 10000 });
  });

  describe('Color Extraction Integration', () => {
    test('should extract colors from CSS content', () => {
      // Simulate CSS data as returned by fetchCSS
      const cssData = {
        content: `
          body {
            background-color: #FFFFFF;
            color: #333333;
          }
          .button {
            background: linear-gradient(to right, #FF0000, #00FF00);
            border: 1px solid rgba(0, 123, 255, 0.8);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #F5F5F5;
            color: rgb(51, 51, 51);
          }
        `,
        filesDownloaded: 1,
        filesFailed: 0,
        errors: []
      };

      const tokens = analyzer.parseTokens(cssData);

      // Verify colors are extracted
      expect(tokens.colors).toBeDefined();
      expect(Array.isArray(tokens.colors)).toBe(true);
      expect(tokens.colors.length).toBeGreaterThan(0);

      // Verify specific colors are present
      expect(tokens.colors).toContain('#FFFFFF');
      expect(tokens.colors).toContain('#333333');
      expect(tokens.colors).toContain('#FF0000');
      expect(tokens.colors).toContain('#00FF00');
      expect(tokens.colors).toContain('#F5F5F5');

      // Verify RGBA colors are normalized
      const rgbaColors = tokens.colors.filter(c => c.startsWith('rgba'));
      expect(rgbaColors.length).toBeGreaterThan(0);
    });

    test('should handle empty CSS content', () => {
      const cssData = {
        content: '',
        filesDownloaded: 0,
        filesFailed: 0,
        errors: []
      };

      const tokens = analyzer.parseTokens(cssData);

      expect(tokens.colors).toBeDefined();
      expect(tokens.colors).toEqual([]);
    });

    test('should handle CSS with no colors', () => {
      const cssData = {
        content: `
          .container {
            width: 100%;
            padding: 20px;
            margin: 0 auto;
          }
        `,
        filesDownloaded: 1,
        filesFailed: 0,
        errors: []
      };

      const tokens = analyzer.parseTokens(cssData);

      expect(tokens.colors).toBeDefined();
      expect(tokens.colors).toEqual([]);
    });

    test('should deduplicate colors across multiple CSS rules', () => {
      const cssData = {
        content: `
          .class1 { color: #FF0000; }
          .class2 { background: #FF0000; }
          .class3 { border-color: #ff0000; }
          .class4 { color: #F00; }
        `,
        filesDownloaded: 1,
        filesFailed: 0,
        errors: []
      };

      const tokens = analyzer.parseTokens(cssData);

      // All should be normalized to the same color
      expect(tokens.colors).toContain('#FF0000');
      expect(tokens.colors.filter(c => c === '#FF0000').length).toBe(1);
    });

    test('should return all token categories', () => {
      const cssData = {
        content: '.test { color: #FF0000; }',
        filesDownloaded: 1,
        filesFailed: 0,
        errors: []
      };

      const tokens = analyzer.parseTokens(cssData);

      // Verify all token categories exist
      expect(tokens).toHaveProperty('colors');
      expect(tokens).toHaveProperty('fonts');
      expect(tokens).toHaveProperty('spacing');
      expect(tokens).toHaveProperty('effects');
      expect(tokens).toHaveProperty('animations');

      // Colors should have data, others should be empty (not yet implemented)
      expect(tokens.colors.length).toBeGreaterThan(0);
      expect(tokens.fonts).toEqual([]);
      expect(tokens.spacing).toEqual([]);
      expect(tokens.effects).toEqual([]);
      expect(tokens.animations).toEqual([]);
    });
  });
});
