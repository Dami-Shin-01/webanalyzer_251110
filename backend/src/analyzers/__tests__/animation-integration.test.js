/**
 * Integration tests for animation extraction in StaticAnalyzer
 * Tests the full flow from CSS content to AnimationToken objects
 */

const CSSParser = require('../../parsers/CSSParser');

describe('Animation Extraction - Integration Tests', () => {
  let parser;

  beforeEach(() => {
    parser = new CSSParser();
  });

  test('should extract animations from real-world CSS', () => {
    const css = `
      /* Fade in animation */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Spin animation */
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Pulse animation */
      @-webkit-keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(0.95);
        }
      }

      /* Usage */
      .fade-element {
        animation: fadeIn 500ms ease-in-out;
      }

      .spinner {
        animation-name: spin;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      .pulse-element {
        animation: pulse 2s ease-in-out infinite;
      }
    `;

    const animations = parser.extractKeyframes(css);

    expect(animations).toHaveLength(3);
    
    // Check fadeIn animation
    const fadeIn = animations.find(a => a.name === 'fadeIn');
    expect(fadeIn).toBeDefined();
    expect(fadeIn.keyframes).toContain('opacity: 0');
    expect(fadeIn.keyframes).toContain('translateY(20px)');
    expect(fadeIn.duration).toBe('500ms');
    expect(fadeIn.timingFunction).toBe('ease-in-out');

    // Check spin animation
    const spin = animations.find(a => a.name === 'spin');
    expect(spin).toBeDefined();
    expect(spin.keyframes).toContain('rotate(0deg)');
    expect(spin.keyframes).toContain('rotate(360deg)');
    expect(spin.duration).toBe('1s');
    expect(spin.timingFunction).toBe('linear');
    expect(spin.iterationCount).toBe('infinite');

    // Check pulse animation
    const pulse = animations.find(a => a.name === 'pulse');
    expect(pulse).toBeDefined();
    expect(pulse.keyframes).toContain('scale(1)');
    expect(pulse.keyframes).toContain('scale(0.95)');
  });

  test('should handle complex animation with multiple keyframe stops', () => {
    const css = `
      @keyframes complexSlide {
        0% {
          opacity: 0;
          transform: translateX(-100%) scale(0.8);
          color: #FF0000;
        }
        25% {
          opacity: 0.3;
          transform: translateX(-50%) scale(0.9);
          color: #FF8800;
        }
        50% {
          opacity: 0.6;
          transform: translateX(0) scale(1);
          color: #FFFF00;
        }
        75% {
          opacity: 0.8;
          transform: translateX(50%) scale(1.1);
          color: #88FF00;
        }
        100% {
          opacity: 1;
          transform: translateX(100%) scale(1);
          color: #00FF00;
        }
      }

      .complex-element {
        animation: complexSlide 3s cubic-bezier(0.4, 0, 0.2, 1) 500ms 2;
      }
    `;

    const animations = parser.extractKeyframes(css);

    expect(animations).toHaveLength(1);
    expect(animations[0].name).toBe('complexSlide');
    expect(animations[0].keyframes).toContain('0%');
    expect(animations[0].keyframes).toContain('25%');
    expect(animations[0].keyframes).toContain('50%');
    expect(animations[0].keyframes).toContain('75%');
    expect(animations[0].keyframes).toContain('100%');
    expect(animations[0].keyframes).toContain('translateX');
    expect(animations[0].keyframes).toContain('scale');
    expect(animations[0].duration).toBe('3s');
  });

  test('should extract animations alongside other CSS tokens', () => {
    const css = `
      /* Colors */
      .primary { color: #FF0000; }
      .secondary { color: #00FF00; }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }

      /* Fonts */
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
      }

      /* Spacing */
      .container {
        padding: 20px;
        margin: 10px;
      }

      /* Effects */
      .card {
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 8px;
      }

      /* Animation usage */
      .animated {
        animation: fadeIn 300ms ease-out;
      }
    `;

    // Test all token types
    const colors = parser.extractColors(css);
    const fonts = parser.extractFonts(css);
    const spacing = parser.extractSpacing(css);
    const effects = parser.extractEffects(css);
    const animations = parser.extractKeyframes(css);

    // Verify colors
    expect(colors).toContain('#FF0000');
    expect(colors).toContain('#00FF00');

    // Verify fonts
    expect(fonts.length).toBeGreaterThan(0);

    // Verify spacing
    expect(spacing).toContain('20px');
    expect(spacing).toContain('10px');

    // Verify effects
    expect(effects.length).toBeGreaterThan(0);

    // Verify animations
    expect(animations).toHaveLength(2);
    expect(animations.map(a => a.name)).toEqual(['fadeIn', 'slideUp']);
  });

  test('should handle CSS with no animations', () => {
    const css = `
      .button {
        color: #FF0000;
        padding: 10px;
        border-radius: 4px;
      }

      .container {
        display: flex;
        gap: 20px;
      }
    `;

    const animations = parser.extractKeyframes(css);

    expect(animations).toEqual([]);
  });

  test('should handle malformed CSS gracefully', () => {
    const css = `
      @keyframes incomplete {
        from { opacity: 0;
      }

      @keyframes valid {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .element {
        animation: valid 300ms;
      }
    `;

    const animations = parser.extractKeyframes(css);

    // Should still extract the valid animation
    expect(animations.length).toBeGreaterThanOrEqual(1);
    const valid = animations.find(a => a.name === 'valid');
    expect(valid).toBeDefined();
  });

  test('should handle animations with vendor prefixes correctly', () => {
    const css = `
      @-webkit-keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }

      @-moz-keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }

      @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }

      .element {
        -webkit-animation: slideIn 500ms;
        -moz-animation: slideIn 500ms;
        animation: slideIn 500ms;
      }
    `;

    const animations = parser.extractKeyframes(css);

    // Should deduplicate animations with same name
    expect(animations).toHaveLength(1);
    expect(animations[0].name).toBe('slideIn');
  });

  test('should extract animation with from/to syntax', () => {
    const css = `
      @keyframes fadeOut {
        from {
          opacity: 1;
          visibility: visible;
        }
        to {
          opacity: 0;
          visibility: hidden;
        }
      }
    `;

    const animations = parser.extractKeyframes(css);

    expect(animations).toHaveLength(1);
    expect(animations[0].name).toBe('fadeOut');
    expect(animations[0].keyframes).toContain('from');
    expect(animations[0].keyframes).toContain('to');
    expect(animations[0].keyframes).toContain('opacity: 1');
    expect(animations[0].keyframes).toContain('opacity: 0');
  });

  test('should extract animation with percentage syntax', () => {
    const css = `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
    `;

    const animations = parser.extractKeyframes(css);

    expect(animations).toHaveLength(1);
    expect(animations[0].name).toBe('bounce');
    expect(animations[0].keyframes).toContain('0%');
    expect(animations[0].keyframes).toContain('50%');
    expect(animations[0].keyframes).toContain('100%');
  });
});
