/**
 * Tests for CSS animation extraction functionality
 * Tests @keyframes parsing, animation property extraction, and AnimationToken creation
 */

const CSSParser = require('../CSSParser');

describe('CSSParser - Animation Extraction', () => {
  let parser;

  beforeEach(() => {
    parser = new CSSParser();
  });

  describe('extractKeyframes', () => {
    test('should extract simple @keyframes rule', () => {
      const css = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(1);
      expect(animations[0].name).toBe('fadeIn');
      expect(animations[0].keyframes).toContain('@keyframes fadeIn');
      expect(animations[0].keyframes).toContain('opacity: 0');
      expect(animations[0].keyframes).toContain('opacity: 1');
    });

    test('should extract @keyframes with percentage keyframes', () => {
      const css = `
        @keyframes slideIn {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(1);
      expect(animations[0].name).toBe('slideIn');
      expect(animations[0].keyframes).toContain('0%');
      expect(animations[0].keyframes).toContain('50%');
      expect(animations[0].keyframes).toContain('100%');
      expect(animations[0].keyframes).toContain('translateX');
    });

    test('should extract multiple @keyframes rules', () => {
      const css = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(3);
      expect(animations.map(a => a.name)).toEqual(['fadeIn', 'slideUp', 'bounce']);
    });

    test('should handle vendor-prefixed @keyframes', () => {
      const css = `
        @-webkit-keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @-moz-keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(2);
      expect(animations[0].name).toBe('spin');
      expect(animations[1].name).toBe('pulse');
    });

    test('should deduplicate animations with same name', () => {
      const css = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @-webkit-keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(1);
      expect(animations[0].name).toBe('fadeIn');
    });

    test('should handle complex keyframes with multiple properties', () => {
      const css = `
        @keyframes complexAnimation {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            color: #FF0000;
          }
          50% {
            opacity: 0.5;
            transform: translateY(10px) scale(0.95);
            color: #00FF00;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            color: #0000FF;
          }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(1);
      expect(animations[0].name).toBe('complexAnimation');
      expect(animations[0].keyframes).toContain('opacity');
      expect(animations[0].keyframes).toContain('transform');
      expect(animations[0].keyframes).toContain('color');
    });

    test('should handle animation names with hyphens and underscores', () => {
      const css = `
        @keyframes fade-in-up {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide_down_animation {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toHaveLength(2);
      expect(animations[0].name).toBe('fade-in-up');
      expect(animations[1].name).toBe('slide_down_animation');
    });

    test('should return empty array for CSS without animations', () => {
      const css = `
        .button {
          color: red;
          padding: 10px;
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations).toEqual([]);
    });

    test('should return empty array for empty or invalid input', () => {
      expect(parser.extractKeyframes('')).toEqual([]);
      expect(parser.extractKeyframes(null)).toEqual([]);
      expect(parser.extractKeyframes(undefined)).toEqual([]);
    });
  });

  describe('extractAnimationProperty', () => {
    test('should extract animation-duration property', () => {
      const css = `
        .element {
          animation-name: fadeIn;
          animation-duration: 300ms;
        }
      `;

      const duration = parser.extractAnimationProperty(css, 'fadeIn', 'animation-duration');

      expect(duration).toBe('300ms');
    });

    test('should extract animation-timing-function property', () => {
      const css = `
        .element {
          animation-name: slideIn;
          animation-timing-function: ease-in-out;
        }
      `;

      const timing = parser.extractAnimationProperty(css, 'slideIn', 'animation-timing-function');

      expect(timing).toBe('ease-in-out');
    });

    test('should extract properties from animation shorthand', () => {
      const css = `
        .element {
          animation: fadeIn 500ms ease-in-out 100ms infinite;
        }
      `;

      const duration = parser.extractAnimationProperty(css, 'fadeIn', 'animation-duration');
      const timing = parser.extractAnimationProperty(css, 'fadeIn', 'animation-timing-function');

      expect(duration).toBe('500ms');
      expect(timing).toBe('ease-in-out');
    });

    test('should return null if animation name not found', () => {
      const css = `
        .element {
          animation-name: fadeIn;
          animation-duration: 300ms;
        }
      `;

      const duration = parser.extractAnimationProperty(css, 'nonExistent', 'animation-duration');

      expect(duration).toBeNull();
    });

    test('should return null if property not found', () => {
      const css = `
        .element {
          animation-name: fadeIn;
        }
      `;

      const duration = parser.extractAnimationProperty(css, 'fadeIn', 'animation-duration');

      expect(duration).toBeNull();
    });
  });

  describe('parseAnimationShorthand', () => {
    test('should parse duration from shorthand', () => {
      const shorthand = 'fadeIn 300ms ease-in-out';
      const duration = parser.parseAnimationShorthand(shorthand, 'animation-duration');

      expect(duration).toBe('300ms');
    });

    test('should parse timing function from shorthand', () => {
      const shorthand = 'fadeIn 300ms ease-in-out';
      const timing = parser.parseAnimationShorthand(shorthand, 'animation-timing-function');

      expect(timing).toBe('ease-in-out');
    });

    test('should parse delay from shorthand', () => {
      const shorthand = 'fadeIn 300ms ease-in-out 100ms';
      const delay = parser.parseAnimationShorthand(shorthand, 'animation-delay');

      expect(delay).toBe('100ms');
    });

    test('should parse iteration count from shorthand', () => {
      const shorthand = 'fadeIn 300ms ease-in-out 100ms infinite';
      const iteration = parser.parseAnimationShorthand(shorthand, 'animation-iteration-count');

      expect(iteration).toBe('infinite');
    });

    test('should handle cubic-bezier timing function', () => {
      const shorthand = 'fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1)';
      const timing = parser.parseAnimationShorthand(shorthand, 'animation-timing-function');

      expect(timing).toContain('cubic-bezier');
    });

    test('should return null for missing properties', () => {
      const shorthand = 'fadeIn ease-in-out';
      const duration = parser.parseAnimationShorthand(shorthand, 'animation-duration');

      expect(duration).toBeNull();
    });
  });

  describe('AnimationToken structure', () => {
    test('should create AnimationToken with all properties', () => {
      const css = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .element {
          animation: fadeIn 500ms ease-in-out 100ms 2;
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations[0]).toMatchObject({
        name: 'fadeIn',
        keyframes: expect.stringContaining('@keyframes fadeIn')
      });
      expect(animations[0]).toHaveProperty('duration');
      expect(animations[0]).toHaveProperty('timingFunction');
    });

    test('should handle AnimationToken with minimal properties', () => {
      const css = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;

      const animations = parser.extractKeyframes(css);

      expect(animations[0]).toMatchObject({
        name: 'fadeIn',
        keyframes: expect.stringContaining('@keyframes fadeIn')
      });
      // Optional properties should be undefined if not found
      expect(animations[0].duration).toBeUndefined();
      expect(animations[0].timingFunction).toBeUndefined();
    });
  });
});
