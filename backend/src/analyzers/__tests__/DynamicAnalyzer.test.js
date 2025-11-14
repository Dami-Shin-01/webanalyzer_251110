/**
 * DynamicAnalyzer 단위 테스트
 * 
 * Puppeteer 기본 기능 및 오류 처리 검증
 */

const DynamicAnalyzer = require('../DynamicAnalyzer');

describe('DynamicAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new DynamicAnalyzer({ timeout: 10000 });
  });

  afterEach(async () => {
    // 브라우저 정리
    if (analyzer.browser) {
      await analyzer.closeBrowser();
    }
  });

  describe('브라우저 실행', () => {
    test('헤드리스 브라우저를 성공적으로 실행해야 함', async () => {
      const browser = await analyzer.launchBrowser();
      
      expect(browser).toBeDefined();
      expect(browser.isConnected()).toBe(true);
      
      await browser.close();
    });

    test('브라우저 실행 실패 시 적절한 오류를 던져야 함', async () => {
      // 잘못된 설정으로 브라우저 실행 시도
      const invalidAnalyzer = new DynamicAnalyzer({ timeout: 1 });
      
      await expect(invalidAnalyzer.launchBrowser()).rejects.toThrow();
    });
  });

  describe('페이지 로드', () => {
    test('유효한 URL을 성공적으로 로드해야 함', async () => {
      const browser = await analyzer.launchBrowser();
      const page = await browser.newPage();
      
      // 간단한 HTML 페이지 로드
      await expect(
        analyzer.loadPage(page, 'https://example.com')
      ).resolves.not.toThrow();
      
      await browser.close();
    }, 15000);

    test('잘못된 URL 로드 시 오류를 던져야 함', async () => {
      const browser = await analyzer.launchBrowser();
      const page = await browser.newPage();
      
      await expect(
        analyzer.loadPage(page, 'https://this-domain-does-not-exist-12345.com')
      ).rejects.toThrow('페이지 로드 실패');
      
      await browser.close();
    }, 15000);
  });

  describe('전체 분석 플로우', () => {
    test('유효한 URL에 대해 분석을 완료해야 함', async () => {
      const result = await analyzer.analyze('https://example.com');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    }, 20000);

    test('분석 실패 시 브라우저를 정리해야 함', async () => {
      await expect(
        analyzer.analyze('https://invalid-url-12345.com')
      ).rejects.toThrow();
      
      // 브라우저가 정리되었는지 확인
      expect(analyzer.browser).toBeNull();
    }, 15000);
  });

  describe('브라우저 정리', () => {
    test('브라우저를 안전하게 종료해야 함', async () => {
      const browser = await analyzer.launchBrowser();
      analyzer.browser = browser;
      
      await analyzer.closeBrowser();
      
      expect(analyzer.browser).toBeNull();
    });

    test('브라우저가 없을 때 closeBrowser 호출 시 오류가 발생하지 않아야 함', async () => {
      analyzer.browser = null;
      
      await expect(analyzer.closeBrowser()).resolves.not.toThrow();
    });
  });

  describe('가용성 확인', () => {
    test('Puppeteer가 사용 가능한지 확인해야 함', async () => {
      const isAvailable = await DynamicAnalyzer.isAvailable();
      
      expect(typeof isAvailable).toBe('boolean');
      expect(isAvailable).toBe(true);
    }, 15000);
  });

  describe('타임아웃 설정', () => {
    test('커스텀 타임아웃을 설정할 수 있어야 함', () => {
      const customAnalyzer = new DynamicAnalyzer({ timeout: 5000 });
      
      expect(customAnalyzer.timeout).toBe(5000);
    });

    test('기본 타임아웃은 30초여야 함', () => {
      const defaultAnalyzer = new DynamicAnalyzer();
      
      expect(defaultAnalyzer.timeout).toBe(30000);
    });
  });
});
