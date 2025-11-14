/**
 * MotionReportGenerator 단위 테스트
 */

const MotionReportGenerator = require('../MotionReportGenerator');

describe('MotionReportGenerator', () => {
  describe('generateReports', () => {
    it('빈 배열을 받으면 빈 배열을 반환해야 함', () => {
      const result = MotionReportGenerator.generateReports([]);
      expect(result).toEqual([]);
    });

    it('null을 받으면 빈 배열을 반환해야 함', () => {
      const result = MotionReportGenerator.generateReports(null);
      expect(result).toEqual([]);
    });

    it('관찰된 애니메이션을 모션 리포트로 변환해야 함', () => {
      const observedAnimations = [
        {
          id: 'animation-1',
          element: '.fade-in',
          trigger: 'scroll',
          properties: [
            { property: 'opacity', from: '0', to: '1' }
          ],
          duration: 500,
          easing: 'ease'
        }
      ];

      const reports = MotionReportGenerator.generateReports(observedAnimations);
      
      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBe('animation-1');
      expect(reports[0].element).toBe('.fade-in');
      expect(reports[0].trigger).toBe('scroll');
      expect(reports[0].duration).toBe(500);
      expect(reports[0].codeSnippets).toHaveProperty('css');
      expect(reports[0].codeSnippets).toHaveProperty('js');
      expect(reports[0].codeSnippets).toHaveProperty('gsap');
    });
  });

  describe('generateDescription', () => {
    it('스크롤 트리거 애니메이션 설명을 생성해야 함', () => {
      const animation = {
        element: '.hero',
        trigger: 'scroll',
        properties: [
          { property: 'opacity', from: '0', to: '1' },
          { property: 'transform', from: 'translateY(20px)', to: 'translateY(0)' }
        ],
        duration: 600
      };

      const description = MotionReportGenerator.generateDescription(animation);
      
      expect(description).toContain('.hero');
      expect(description).toContain('스크롤 시');
      expect(description).toContain('opacity');
      expect(description).toContain('transform');
      expect(description).toContain('600ms');
    });
  });

  describe('generateCSSSnippet', () => {
    it('CSS @keyframes 코드를 생성해야 함', () => {
      const animation = {
        element: '.fade-in',
        properties: [
          { property: 'opacity', from: '0', to: '1' }
        ],
        duration: 500,
        easing: 'ease-in-out'
      };

      const css = MotionReportGenerator.generateCSSSnippet(animation);
      
      expect(css).toContain('@keyframes');
      expect(css).toContain('fade-in-animation');
      expect(css).toContain('from');
      expect(css).toContain('to');
      expect(css).toContain('opacity: 0');
      expect(css).toContain('opacity: 1');
      expect(css).toContain('500ms');
      expect(css).toContain('ease-in-out');
    });

    it('여러 속성 변화를 포함해야 함', () => {
      const animation = {
        element: '#hero',
        properties: [
          { property: 'opacity', from: '0', to: '1' },
          { property: 'transform', from: 'scale(0.8)', to: 'scale(1)' }
        ],
        duration: 800,
        easing: 'ease'
      };

      const css = MotionReportGenerator.generateCSSSnippet(animation);
      
      expect(css).toContain('opacity: 0');
      expect(css).toContain('opacity: 1');
      expect(css).toContain('transform: scale(0.8)');
      expect(css).toContain('transform: scale(1)');
    });
  });

  describe('generateJSSnippet', () => {
    it('스크롤 트리거용 Web Animation API 코드를 생성해야 함', () => {
      const animation = {
        element: '.card',
        properties: [
          { property: 'opacity', from: '0', to: '1' }
        ],
        duration: 400,
        easing: 'ease',
        trigger: 'scroll'
      };

      const js = MotionReportGenerator.generateJSSnippet(animation);
      
      expect(js).toContain('Web Animation API');
      expect(js).toContain('document.querySelector');
      expect(js).toContain('.card');
      expect(js).toContain('IntersectionObserver');
      expect(js).toContain('animate(keyframes, options)');
      expect(js).toContain('duration: 400');
    });

    it('호버 트리거용 코드를 생성해야 함', () => {
      const animation = {
        element: '.button',
        properties: [
          { property: 'transform', from: 'scale(1)', to: 'scale(1.1)' }
        ],
        duration: 200,
        easing: 'ease-out',
        trigger: 'hover'
      };

      const js = MotionReportGenerator.generateJSSnippet(animation);
      
      expect(js).toContain('mouseenter');
      expect(js).toContain('.button');
    });

    it('로드 트리거용 코드를 생성해야 함', () => {
      const animation = {
        element: '.logo',
        properties: [
          { property: 'opacity', from: '0', to: '1' }
        ],
        duration: 1000,
        easing: 'ease',
        trigger: 'load'
      };

      const js = MotionReportGenerator.generateJSSnippet(animation);
      
      expect(js).toContain('페이지 로드 시');
      expect(js).toContain('.logo');
      expect(js).toContain('animate(keyframes, options)');
    });
  });

  describe('generateGSAPSnippet', () => {
    it('스크롤 트리거용 GSAP 코드를 생성해야 함', () => {
      const animation = {
        element: '.section',
        properties: [
          { property: 'opacity', from: '0', to: '1' },
          { property: 'transform', from: 'translateY(50px)', to: 'translateY(0)' }
        ],
        duration: 1000,
        easing: 'ease',
        trigger: 'scroll'
      };

      const gsap = MotionReportGenerator.generateGSAPSnippet(animation);
      
      expect(gsap).toContain('import gsap');
      expect(gsap).toContain('ScrollTrigger');
      expect(gsap).toContain('gsap.to');
      expect(gsap).toContain('.section');
      expect(gsap).toContain('scrollTrigger');
      expect(gsap).toContain('duration: 1');
    });

    it('호버 트리거용 GSAP 코드를 생성해야 함', () => {
      const animation = {
        element: '.link',
        properties: [
          { property: 'opacity', from: '0.7', to: '1' }
        ],
        duration: 300,
        easing: 'ease-in',
        trigger: 'hover'
      };

      const gsap = MotionReportGenerator.generateGSAPSnippet(animation);
      
      expect(gsap).toContain('mouseenter');
      expect(gsap).toContain('.link');
    });
  });

  describe('convertToGSAPEasing', () => {
    it('CSS easing을 GSAP easing으로 변환해야 함', () => {
      expect(MotionReportGenerator.convertToGSAPEasing('ease')).toBe('power1.inOut');
      expect(MotionReportGenerator.convertToGSAPEasing('ease-in')).toBe('power1.in');
      expect(MotionReportGenerator.convertToGSAPEasing('ease-out')).toBe('power1.out');
      expect(MotionReportGenerator.convertToGSAPEasing('linear')).toBe('none');
    });

    it('알 수 없는 easing은 기본값을 반환해야 함', () => {
      expect(MotionReportGenerator.convertToGSAPEasing('unknown')).toBe('power1.inOut');
    });
  });

  describe('sanitizeAnimationName', () => {
    it('선택자를 유효한 애니메이션 이름으로 변환해야 함', () => {
      expect(MotionReportGenerator.sanitizeAnimationName('.fade-in')).toBe('fade-in-animation');
      expect(MotionReportGenerator.sanitizeAnimationName('#hero')).toBe('hero-animation');
      expect(MotionReportGenerator.sanitizeAnimationName('div.card')).toBe('div-card-animation');
    });

    it('특수 문자를 하이픈으로 변환해야 함', () => {
      expect(MotionReportGenerator.sanitizeAnimationName('.my__element')).toBe('my-element-animation');
      expect(MotionReportGenerator.sanitizeAnimationName('[data-animate]')).toBe('data-animate-animation');
    });
  });

  describe('generateMarkdown', () => {
    it('완전한 Markdown 리포트를 생성해야 함', () => {
      const report = {
        id: 'motion-1',
        description: '테스트 애니메이션',
        element: '.test',
        trigger: 'scroll',
        duration: 500,
        easing: 'ease',
        properties: [
          { property: 'opacity', from: '0', to: '1' }
        ],
        codeSnippets: {
          css: '@keyframes test { }',
          js: 'const element = document.querySelector(".test");',
          gsap: 'gsap.to(".test", { });'
        }
      };

      const markdown = MotionReportGenerator.generateMarkdown(report);
      
      expect(markdown).toContain('# motion-1');
      expect(markdown).toContain('## 설명');
      expect(markdown).toContain('테스트 애니메이션');
      expect(markdown).toContain('## 애니메이션 정보');
      expect(markdown).toContain('**요소**: `.test`');
      expect(markdown).toContain('**트리거**: 스크롤');
      expect(markdown).toContain('**지속 시간**: 500ms');
      expect(markdown).toContain('## 속성 변화');
      expect(markdown).toContain('**opacity**: `0` → `1`');
      expect(markdown).toContain('## 재구현 코드');
      expect(markdown).toContain('### CSS @keyframes');
      expect(markdown).toContain('### Web Animation API');
      expect(markdown).toContain('### GSAP');
      expect(markdown).toContain('## 사용 방법');
    });
  });

  describe('getTriggerDisplayName', () => {
    it('트리거 타입을 한글로 변환해야 함', () => {
      expect(MotionReportGenerator.getTriggerDisplayName('scroll')).toBe('스크롤');
      expect(MotionReportGenerator.getTriggerDisplayName('hover')).toBe('호버');
      expect(MotionReportGenerator.getTriggerDisplayName('load')).toBe('페이지 로드');
    });

    it('알 수 없는 트리거는 원본을 반환해야 함', () => {
      expect(MotionReportGenerator.getTriggerDisplayName('custom')).toBe('custom');
    });
  });
});
