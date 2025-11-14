/**
 * DynamicAnalyzer - 헤드리스 브라우저를 사용한 동적 애니메이션 분석
 * 
 * Puppeteer를 사용하여 웹사이트를 실제로 로드하고
 * JavaScript로 구현된 동적 애니메이션을 관찰합니다.
 */

const puppeteer = require('puppeteer');
const MotionReportGenerator = require('../generators/MotionReportGenerator');

class DynamicAnalyzer {
  constructor(options = {}) {
    this.timeout = options.timeout || 30000; // 30초 기본 타임아웃
    this.browser = null;
  }

  /**
   * 웹사이트의 동적 애니메이션 분석
   * @param {string} url - 분석할 웹사이트 URL
   * @returns {Promise<MotionReport[]>} 생성된 모션 리포트 배열
   */
  async analyze(url) {
    try {
      console.log(`[DynamicAnalyzer] Starting dynamic analysis for: ${url}`);
      
      // 브라우저 실행
      this.browser = await this.launchBrowser();
      
      // 새 페이지 생성 및 로드
      const page = await this.browser.newPage();
      await this.loadPage(page, url);
      
      // 동적 애니메이션 관찰
      const observedAnimations = await this.observeAnimations(page);
      
      console.log(`[DynamicAnalyzer] Dynamic analysis completed successfully. Found ${observedAnimations.length} animations.`);
      
      // 모션 리포트 생성
      const motionReports = this.generateReports(observedAnimations);
      
      console.log(`[DynamicAnalyzer] Generated ${motionReports.length} motion reports.`);
      
      return motionReports;
      
    } catch (error) {
      console.error(`[DynamicAnalyzer] Error during dynamic analysis:`, error.message);
      throw error;
    } finally {
      // 브라우저 정리
      await this.closeBrowser();
    }
  }

  /**
   * 헤드리스 브라우저 실행
   * @returns {Promise<Browser>} Puppeteer 브라우저 인스턴스
   */
  async launchBrowser() {
    try {
      console.log('[DynamicAnalyzer] Launching headless browser...');
      
      const browser = await puppeteer.launch({
        headless: 'new', // 새로운 헤드리스 모드 사용
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // 공유 메모리 사용 안 함 (Docker 환경 대응)
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080' // 일관된 뷰포트 크기
        ],
        timeout: this.timeout
      });
      
      console.log('[DynamicAnalyzer] Browser launched successfully');
      return browser;
      
    } catch (error) {
      console.error('[DynamicAnalyzer] Failed to launch browser:', error.message);
      throw new Error(`브라우저 실행 실패: ${error.message}`);
    }
  }

  /**
   * 페이지 로드 및 기본 네비게이션
   * @param {Page} page - Puppeteer 페이지 인스턴스
   * @param {string} url - 로드할 URL
   */
  async loadPage(page, url) {
    try {
      console.log(`[DynamicAnalyzer] Loading page: ${url}`);
      
      // 페이지 로드 타임아웃 설정
      page.setDefaultTimeout(this.timeout);
      page.setDefaultNavigationTimeout(this.timeout);
      
      // 콘솔 메시지 로깅 (디버깅용)
      page.on('console', msg => {
        console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
      });
      
      // 페이지 오류 로깅
      page.on('pageerror', error => {
        console.error(`[Browser Error] ${error.message}`);
      });
      
      // 요청 실패 로깅
      page.on('requestfailed', request => {
        console.warn(`[Request Failed] ${request.url()}: ${request.failure().errorText}`);
      });
      
      // 페이지 로드 (networkidle2: 500ms 동안 네트워크 연결이 2개 이하일 때)
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: this.timeout
      });
      
      // 뷰포트 설정
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      });
      
      console.log('[DynamicAnalyzer] Page loaded successfully');
      
    } catch (error) {
      console.error('[DynamicAnalyzer] Failed to load page:', error.message);
      throw new Error(`페이지 로드 실패: ${error.message}`);
    }
  }

  /**
   * 페이지에서 동적 애니메이션 관찰
   * @param {Page} page - Puppeteer 페이지 인스턴스
   * @returns {Promise<ObservedAnimation[]>} 관찰된 애니메이션 배열
   */
  async observeAnimations(page) {
    try {
      console.log('[DynamicAnalyzer] Starting animation observation...');
      
      // 클라이언트 측 스크립트 주입 및 애니메이션 관찰
      const animations = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observedAnimations = [];
          const observedElements = new Set();
          const animationDuration = 3000; // 3초 동안 관찰
          
          // 관찰할 CSS 속성들
          const trackedProperties = [
            'opacity',
            'transform',
            'translateX',
            'translateY',
            'scale',
            'rotate'
          ];
          
          /**
           * 요소의 현재 스타일 스냅샷 생성
           */
          function captureStyleSnapshot(element) {
            const computed = window.getComputedStyle(element);
            return {
              opacity: computed.opacity,
              transform: computed.transform,
              display: computed.display,
              visibility: computed.visibility
            };
          }
          
          /**
           * 두 스타일 스냅샷 비교
           */
          function hasStyleChanged(before, after) {
            return before.opacity !== after.opacity ||
                   before.transform !== after.transform ||
                   before.display !== after.display ||
                   before.visibility !== after.visibility;
          }
          
          /**
           * 스타일 변화를 PropertyChange 배열로 변환
           */
          function extractPropertyChanges(before, after) {
            const changes = [];
            
            if (before.opacity !== after.opacity) {
              changes.push({
                property: 'opacity',
                from: before.opacity,
                to: after.opacity
              });
            }
            
            if (before.transform !== after.transform) {
              changes.push({
                property: 'transform',
                from: before.transform,
                to: after.transform
              });
            }
            
            if (before.display !== after.display) {
              changes.push({
                property: 'display',
                from: before.display,
                to: after.display
              });
            }
            
            if (before.visibility !== after.visibility) {
              changes.push({
                property: 'visibility',
                from: before.visibility,
                to: after.visibility
              });
            }
            
            return changes;
          }
          
          /**
           * 요소의 CSS 선택자 생성
           */
          function getElementSelector(element) {
            if (element.id) {
              return `#${element.id}`;
            }
            
            if (element.className && typeof element.className === 'string') {
              const classes = element.className.trim().split(/\s+/).slice(0, 2).join('.');
              if (classes) {
                return `${element.tagName.toLowerCase()}.${classes}`;
              }
            }
            
            return element.tagName.toLowerCase();
          }
          
          /**
           * requestAnimationFrame을 사용한 프레임별 속성 추적
           */
          function trackElementAnimation(element, trigger, startTime) {
            const selector = getElementSelector(element);
            const elementKey = `${selector}-${trigger}`;
            
            // 이미 관찰 중인 요소는 건너뛰기
            if (observedElements.has(elementKey)) {
              return;
            }
            observedElements.add(elementKey);
            
            const initialStyle = captureStyleSnapshot(element);
            let frameCount = 0;
            let hasChanges = false;
            let finalStyle = null;
            const maxFrames = 180; // 약 3초 (60fps 기준)
            
            function trackFrame() {
              frameCount++;
              
              const currentStyle = captureStyleSnapshot(element);
              
              if (hasStyleChanged(initialStyle, currentStyle)) {
                hasChanges = true;
                finalStyle = currentStyle;
              }
              
              // 계속 추적 (최대 프레임 수까지)
              if (frameCount < maxFrames) {
                requestAnimationFrame(trackFrame);
              } else if (hasChanges && finalStyle) {
                // 애니메이션 감지됨
                const changes = extractPropertyChanges(initialStyle, finalStyle);
                
                if (changes.length > 0) {
                  observedAnimations.push({
                    element: selector,
                    trigger: trigger,
                    properties: changes,
                    duration: frameCount * (1000 / 60), // 밀리초로 변환
                    timestamp: Date.now() - startTime
                  });
                }
              }
            }
            
            requestAnimationFrame(trackFrame);
          }
          
          // IntersectionObserver를 사용한 스크롤 트리거 감지
          const intersectionObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // 요소가 뷰포트에 진입할 때 추적 시작
                  trackElementAnimation(entry.target, 'scroll', Date.now());
                }
              });
            },
            {
              threshold: [0, 0.25, 0.5, 0.75, 1.0],
              rootMargin: '50px'
            }
          );
          
          // 페이지의 모든 요소 관찰
          const allElements = document.querySelectorAll('*');
          const elementsToObserve = Array.from(allElements).filter(el => {
            // 보이는 요소만 관찰
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          // 상위 100개 요소만 관찰 (성능 최적화)
          elementsToObserve.slice(0, 100).forEach(el => {
            intersectionObserver.observe(el);
          });
          
          // 페이지 로드 시 애니메이션 감지
          const startTime = Date.now();
          elementsToObserve.slice(0, 50).forEach(el => {
            trackElementAnimation(el, 'load', startTime);
          });
          
          // 스크롤 시뮬레이션
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight / 2,
              behavior: 'smooth'
            });
          }, 500);
          
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }, 1500);
          
          // 관찰 완료 후 결과 반환
          setTimeout(() => {
            intersectionObserver.disconnect();
            resolve(observedAnimations);
          }, animationDuration);
        });
      });
      
      console.log(`[DynamicAnalyzer] Observed ${animations.length} animations`);
      
      // ObservedAnimation 데이터 구조로 변환
      return animations.map((anim, index) => ({
        id: `animation-${index + 1}`,
        element: anim.element,
        trigger: anim.trigger,
        properties: anim.properties,
        duration: Math.round(anim.duration),
        timestamp: anim.timestamp,
        easing: 'ease' // 기본값 (실제 easing 감지는 복잡하므로 기본값 사용)
      }));
      
    } catch (error) {
      console.error('[DynamicAnalyzer] Error observing animations:', error.message);
      throw new Error(`애니메이션 관찰 실패: ${error.message}`);
    }
  }

  /**
   * 브라우저 종료 및 리소스 정리
   */
  async closeBrowser() {
    if (this.browser) {
      try {
        console.log('[DynamicAnalyzer] Closing browser...');
        await this.browser.close();
        this.browser = null;
        console.log('[DynamicAnalyzer] Browser closed successfully');
      } catch (error) {
        console.error('[DynamicAnalyzer] Error closing browser:', error.message);
      }
    }
  }

  /**
   * 관찰된 애니메이션 데이터를 모션 리포트로 변환
   * @param {ObservedAnimation[]} observedAnimations - 관찰된 애니메이션 배열
   * @returns {MotionReport[]} 생성된 모션 리포트 배열
   */
  generateReports(observedAnimations) {
    return MotionReportGenerator.generateReports(observedAnimations);
  }

  /**
   * 동적 분석 가능 여부 확인 (헬스체크)
   * @returns {Promise<boolean>} 사용 가능 여부
   */
  static async isAvailable() {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      await browser.close();
      return true;
    } catch (error) {
      console.error('[DynamicAnalyzer] Puppeteer not available:', error.message);
      return false;
    }
  }
}

module.exports = DynamicAnalyzer;
