const StaticAnalyzer = require('../StaticAnalyzer');
const CSSParser = require('../../parsers/CSSParser');

describe('StaticAnalyzer - Spacing and Effects Integration', () => {
  let analyzer;
  let parser;

  beforeEach(() => {
    analyzer = new StaticAnalyzer();
    parser = new CSSParser();
  });

  describe('Spacing Extraction Integration', () => {
    test('should extract spacing values from CSS content', () => {
      const css = `
        .container {
          padding: 20px;
          margin: 16px 24px;
        }
        .card {
          padding: 1rem 2rem;
          margin-bottom: 32px;
        }
        .grid {
          gap: 16px;
        }
      `;

      const spacing = parser.extractSpacing(css);

      expect(spacing.length).toBeGreaterThan(0);
      expect(spacing).toContain('20px');
      expect(spacing).toContain('16px');
      expect(spacing).toContain('24px');
      expect(spacing).toContain('1rem');
      expect(spacing).toContain('2rem');
      expect(spacing).toContain('32px');
    });

    test('should handle empty CSS content', () => {
      const spacing = parser.extractSpacing('');
      expect(spacing).toEqual([]);
    });

    test('should handle CSS with no spacing', () => {
      const css = `
        .box {
          color: red;
          font-size: 16px;
        }
      `;

      const spacing = parser.extractSpacing(css);
      expect(spacing).toEqual([]);
    });

    test('should deduplicate spacing values', () => {
      const css = `
        .box1 { padding: 16px; }
        .box2 { margin: 16px; }
        .box3 { gap: 16px; }
      `;

      const spacing = parser.extractSpacing(css);
      
      const count16px = spacing.filter(s => s === '16px').length;
      expect(count16px).toBe(1);
    });
  });

  describe('Effects Extraction Integration', () => {
    test('should extract effects from CSS content', () => {
      const css = `
        .card {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button {
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .image {
          filter: blur(5px);
        }
        .heading {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `;

      const effects = parser.extractEffects(css);

      expect(effects.length).toBeGreaterThan(0);
      
      const shadowEffects = effects.filter(e => e.type === 'shadow');
      const radiusEffects = effects.filter(e => e.type === 'radius');
      const filterEffects = effects.filter(e => e.type === 'filter');

      expect(shadowEffects.length).toBeGreaterThan(0);
      expect(radiusEffects.length).toBeGreaterThan(0);
      expect(filterEffects.length).toBeGreaterThan(0);
    });

    test('should handle empty CSS content', () => {
      const effects = parser.extractEffects('');
      expect(effects).toEqual([]);
    });

    test('should handle CSS with no effects', () => {
      const css = `
        .box {
          color: red;
          padding: 16px;
        }
      `;

      const effects = parser.extractEffects(css);
      expect(effects).toEqual([]);
    });

    test('should deduplicate identical effects', () => {
      const css = `
        .card1 { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .card2 { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
      `;

      const effects = parser.extractEffects(css);
      expect(effects.length).toBe(1);
    });
  });

  describe('Full Token Extraction', () => {
    test('should return all token categories including spacing and effects', () => {
      const cssData = {
        content: `
          body {
            color: #333;
            font-family: Arial;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            padding: 20px;
            margin: 0;
          }
          .card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 16px 24px;
          }
        `,
        filesDownloaded: 1
      };

      const tokens = analyzer.parseTokens(cssData);

      expect(tokens).toHaveProperty('colors');
      expect(tokens).toHaveProperty('fonts');
      expect(tokens).toHaveProperty('spacing');
      expect(tokens).toHaveProperty('effects');
      expect(tokens).toHaveProperty('animations');

      expect(tokens.colors.length).toBeGreaterThan(0);
      expect(tokens.fonts.length).toBeGreaterThan(0);
      expect(tokens.spacing.length).toBeGreaterThan(0);
      expect(tokens.effects.length).toBeGreaterThan(0);
    });

    test('should extract spacing and effects separately', () => {
      const cssData = {
        content: `
          .container {
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `,
        filesDownloaded: 1
      };

      const tokens = analyzer.parseTokens(cssData);

      expect(tokens.spacing).toContain('20px');
      
      const radiusEffect = tokens.effects.find(e => e.type === 'radius');
      const shadowEffect = tokens.effects.find(e => e.type === 'shadow');
      
      expect(radiusEffect).toBeDefined();
      expect(shadowEffect).toBeDefined();
    });
  });
});
