import { buildCSS, buildSCSS, buildJSON, buildAnimationCSS, buildMotionReports, buildReadme } from '../starterKitBuilder';

describe('StarterKitBuilder', () => {
  const mockTokenMappings = {
    colors: {
      '#FF0000': 'primary-red',
      '#00FF00': 'success-green',
      '#0000FF': ''  // unnamed token
    },
    fonts: {
      'Arial-16px-400-1.5': 'body-text',
      'Helvetica-24px-700-1.2': ''  // unnamed token
    },
    spacing: {
      '8px': 'spacing-xs',
      '16px': 'spacing-sm'
    },
    effects: {
      'shadow-0 2px 4px rgba(0,0,0,0.1)': 'card-shadow'
    }
  };

  describe('buildCSS', () => {
    test('should generate CSS with named tokens only', () => {
      const css = buildCSS(mockTokenMappings, false);
      
      expect(css).toContain(':root {');
      expect(css).toContain('--primary-red: #FF0000;');
      expect(css).toContain('--success-green: #00FF00;');
      expect(css).not.toContain('#0000FF');
      expect(css).toContain('--body-text-family: Arial;');
      expect(css).toContain('--spacing-xs: 8px;');
    });

    test('should generate CSS with unnamed tokens when includeUnnamed is true', () => {
      const css = buildCSS(mockTokenMappings, true);
      
      expect(css).toContain('#0000FF');
      expect(css).toContain('Helvetica');
    });
  });

  describe('buildSCSS', () => {
    test('should generate SCSS with named tokens only', () => {
      const scss = buildSCSS(mockTokenMappings, false);
      
      expect(scss).toContain('// Colors');
      expect(scss).toContain('$primary-red: #FF0000;');
      expect(scss).toContain('$success-green: #00FF00;');
      expect(scss).not.toContain('#0000FF');
      expect(scss).toContain('// Typography');
      expect(scss).toContain('$body-text-family: Arial;');
    });

    test('should generate SCSS with unnamed tokens when includeUnnamed is true', () => {
      const scss = buildSCSS(mockTokenMappings, true);
      
      expect(scss).toContain('#0000FF');
    });
  });

  describe('buildJSON', () => {
    test('should generate JSON with named tokens only', () => {
      const json = buildJSON(mockTokenMappings, false);
      const parsed = JSON.parse(json);
      
      expect(parsed.colors['primary-red']).toBe('#FF0000');
      expect(parsed.colors['success-green']).toBe('#00FF00');
      expect(Object.keys(parsed.colors)).not.toContain('');
      expect(parsed.typography['body-text']).toBeDefined();
      expect(parsed.typography['body-text'].fontFamily).toBe('Arial');
    });

    test('should generate JSON with unnamed tokens when includeUnnamed is true', () => {
      const json = buildJSON(mockTokenMappings, true);
      const parsed = JSON.parse(json);
      
      expect(Object.keys(parsed.colors).length).toBeGreaterThan(2);
    });
  });

  describe('buildAnimationCSS', () => {
    test('should generate animation CSS files with mapped names', () => {
      const animations = [
        {
          name: 'fadeIn',
          keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
          duration: '300ms',
          timingFunction: 'ease-in-out'
        }
      ];
      const animationMappings = {
        fadeIn: 'fade-in-animation'
      };

      const files = buildAnimationCSS(animations, animationMappings, false);
      
      expect(files.size).toBe(1);
      expect(files.has('fade-in-animation.css')).toBe(true);
      const content = files.get('fade-in-animation.css');
      expect(content).toContain('@keyframes fadeIn');
      expect(content).toContain('Animation: fade-in-animation');
      expect(content).toContain('Usage Example');
      expect(content).toContain('animation-duration: 300ms');
      expect(content).toContain('animation-timing-function: ease-in-out');
    });

    test('should generate multiple animation files', () => {
      const animations = [
        {
          name: 'fadeIn',
          keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
        },
        {
          name: 'slideUp',
          keyframes: '@keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }'
        }
      ];
      const animationMappings = {
        fadeIn: 'fade-in',
        slideUp: 'slide-up'
      };

      const files = buildAnimationCSS(animations, animationMappings, false);
      
      expect(files.size).toBe(2);
      expect(files.has('fade-in.css')).toBe(true);
      expect(files.has('slide-up.css')).toBe(true);
    });

    test('should skip unnamed animations when includeUnnamed is false', () => {
      const animations = [
        {
          name: 'fadeIn',
          keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
        },
        {
          name: 'slideUp',
          keyframes: '@keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }'
        }
      ];
      const animationMappings = {
        fadeIn: 'fade-in'
        // slideUp is not mapped
      };

      const files = buildAnimationCSS(animations, animationMappings, false);
      
      expect(files.size).toBe(1);
      expect(files.has('fade-in.css')).toBe(true);
      expect(files.has('slideUp.css')).toBe(false);
    });

    test('should include unnamed animations when includeUnnamed is true', () => {
      const animations = [
        {
          name: 'fadeIn',
          keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
        },
        {
          name: 'slideUp',
          keyframes: '@keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }'
        }
      ];
      const animationMappings = {
        fadeIn: 'fade-in'
        // slideUp is not mapped
      };

      const files = buildAnimationCSS(animations, animationMappings, true);
      
      expect(files.size).toBe(2);
      expect(files.has('fade-in.css')).toBe(true);
      expect(files.has('slideUp.css')).toBe(true);
    });

    test('should return empty map for empty animations array', () => {
      const files = buildAnimationCSS([], {}, false);
      
      expect(files.size).toBe(0);
    });

    test('should handle animations with all optional properties', () => {
      const animations = [
        {
          name: 'complexAnimation',
          keyframes: '@keyframes complexAnimation { 0% { opacity: 0; } 100% { opacity: 1; } }',
          duration: '500ms',
          timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          delay: '100ms',
          iterationCount: 'infinite'
        }
      ];
      const animationMappings = {
        complexAnimation: 'complex'
      };

      const files = buildAnimationCSS(animations, animationMappings, false);
      const content = files.get('complex.css');
      
      expect(content).toContain('animation-duration: 500ms');
      expect(content).toContain('animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1)');
      expect(content).toContain('animation-delay: 100ms');
      expect(content).toContain('animation-iteration-count: infinite');
    });
  });

  describe('buildMotionReports', () => {
    test('should generate motion report markdown files', () => {
      const motionReports = [
        {
          id: 'animation-1',
          description: 'Fade in animation on scroll',
          element: '.hero-section',
          trigger: 'scroll',
          duration: 500,
          easing: 'ease',
          properties: [
            { property: 'opacity', from: '0', to: '1' }
          ],
          codeSnippets: {
            css: '@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }',
            js: 'element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });',
            gsap: 'gsap.to(".hero-section", { opacity: 1, duration: 0.5 });'
          }
        }
      ];

      const files = buildMotionReports(motionReports);
      
      expect(files.size).toBe(1);
      expect(files.has('animation-1.md')).toBe(true);
      
      const content = files.get('animation-1.md');
      expect(content).toContain('# animation-1');
      expect(content).toContain('Fade in animation on scroll');
      expect(content).toContain('.hero-section');
      expect(content).toContain('스크롤');
      expect(content).toContain('500ms');
      expect(content).toContain('opacity');
      expect(content).toContain('CSS @keyframes');
      expect(content).toContain('Web Animation API');
      expect(content).toContain('GSAP');
    });

    test('should generate multiple motion report files', () => {
      const motionReports = [
        {
          id: 'animation-1',
          description: 'First animation',
          element: '.element-1',
          trigger: 'scroll',
          duration: 500,
          easing: 'ease',
          properties: [{ property: 'opacity', from: '0', to: '1' }],
          codeSnippets: { css: '', js: '' }
        },
        {
          id: 'animation-2',
          description: 'Second animation',
          element: '.element-2',
          trigger: 'hover',
          duration: 300,
          easing: 'ease-in-out',
          properties: [{ property: 'transform', from: 'scale(1)', to: 'scale(1.1)' }],
          codeSnippets: { css: '', js: '' }
        }
      ];

      const files = buildMotionReports(motionReports);
      
      expect(files.size).toBe(2);
      expect(files.has('animation-1.md')).toBe(true);
      expect(files.has('animation-2.md')).toBe(true);
    });

    test('should return empty map for empty motion reports array', () => {
      const files = buildMotionReports([]);
      
      expect(files.size).toBe(0);
    });

    test('should handle motion reports without GSAP snippets', () => {
      const motionReports = [
        {
          id: 'animation-1',
          description: 'Simple animation',
          element: '.element',
          trigger: 'load',
          duration: 400,
          easing: 'ease',
          properties: [{ property: 'opacity', from: '0', to: '1' }],
          codeSnippets: {
            css: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
            js: 'element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });'
          }
        }
      ];

      const files = buildMotionReports(motionReports);
      const content = files.get('animation-1.md');
      
      expect(content).toContain('CSS @keyframes');
      expect(content).toContain('Web Animation API');
      expect(content).not.toContain('### GSAP');
    });
  });

  describe('buildReadme', () => {
    test('should generate README with metadata', () => {
      const metadata = {
        analyzedUrl: 'https://example.com',
        timestamp: '2025-11-13T10:00:00Z'
      };

      const readme = buildReadme(metadata, mockTokenMappings);
      
      expect(readme).toContain('Design System Starter Kit');
      expect(readme).toContain('https://example.com');
      expect(readme).toContain('Colors');
      expect(readme).toContain('Typography');
    });

    test('should include motion report count in README', () => {
      const metadata = {
        analyzedUrl: 'https://example.com',
        timestamp: '2025-11-13T10:00:00Z',
        motionReportCount: 3
      };

      const readme = buildReadme(metadata, mockTokenMappings);
      
      expect(readme).toContain('Motion Reports');
      expect(readme).toContain('3 reports');
      expect(readme).toContain('motion_reports');
    });
  });
});
