# Implementation Plan

- [x] 1. 프로젝트 초기 설정 및 Mock API 서버 구축




  - 백엔드와 프론트엔드 프로젝트 디렉토리 구조 생성
  - Node.js/Express 기본 서버 설정 (CORS, body-parser 포함)
  - `/api/analyze` Mock 엔드포인트 구현 (고정된 샘플 데이터 반환)
  - `/health` 헬스체크 엔드포인트 구현
  - React 프로젝트 초기화 및 기본 구조 설정
  - _Requirements: 1.1, 1.4_

- [x] 2. 프론트엔드 URL 입력 및 API 연동





  - URLInput 컴포넌트 구현 (입력 필드, 분석 버튼)
  - URL 유효성 검증 로직 구현 (HTTP/HTTPS 프로토콜 체크)
  - Axios를 사용한 `/api/analyze` API 호출 로직 구현
  - App 컴포넌트에서 분석 상태 관리 (isAnalyzing, analysisResult, error)
  - _Requirements: 1.1, 1.5_

- [x] 3. 진행 상태 표시 UI 구현





  - ProgressIndicator 컴포넌트 구현
  - 분석 단계별 상태 메시지 표시 (HTML 다운로드, CSS 파싱 등)
  - 로딩 애니메이션 추가
  - 분석 중 입력 필드 비활성화 처리
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. 디자인 스튜디오 UI - 토큰 매핑 인터페이스





  - DesignStudio 컴포넌트 기본 레이아웃 구현
  - TokenSection 컴포넌트 구현 (재사용 가능한 토큰 섹션)
  - 색상 토큰 매핑 UI (색상 미리보기 + 입력 필드)
  - 폰트 토큰 매핑 UI (폰트 정보 표시 + 입력 필드)
  - 토큰 매핑 상태 관리 (tokenMappings state)
  - 실시간 미리보기 기능 구현
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
- [x] 5. 내보내기 옵션 및 스타터 킷 생성




- [ ] 5. 내보내기 옵션 및 스타터 킷 생성

  - ExportOptions 컴포넌트 구현 (이름 없는 토큰 처리 옵션)
  - StarterKitBuilder 헬퍼 함수 구현 (buildCSS, buildSCSS, buildJSON)
  - CSS 변수 형식 변환 로직 (`:root { --token-name: value; }`)
  - SCSS 변수 형식 변환 로직 (`$token-name: value;`)
  - JSON 형식 변환 로직
  - JSZip을 사용한 ZIP 파일 생성 및 다운로드 기능
  - README.md 파일 생성 로직
  - _Requirements: 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5_
-

- [x] 6. 백엔드 정적 분석 - HTML/CSS 다운로드 및 CORS 검증




  - StaticAnalyzer 클래스 기본 구조 생성
  - Axios를 사용한 HTML 다운로드 로직 구현
  - Cheerio를 사용한 `<link rel="stylesheet">` 추출
  - CSS 파일 URL 목록 다운로드 및 병합
  - 타임아웃 설정 (30초)
  - 네트워크 오류 처리 (실패한 파일 건너뛰기)
  - **CORS 오류 감지 및 처리 로직 구현**
  - **실제 레퍼런스 사이트 10개로 아키텍처 유효성 검증**
  - _Requirements: 1.1, 8.1, 8.3, 8.5_
  - _Note: 이 단계에서 CORS 문제가 심각하면 브라우저 확장 프로그램 아키텍처로 전환 고려_

- [x] 7. 백엔드 정적 분석 - CSS 파싱 및 색상 추출





  - CSSParser 클래스 생성
  - HEX 색상 추출 정규식 구현 (`#[0-9A-Fa-f]{3,6}`)
  - RGB(A) 색상 추출 정규식 구현
  - 중복 제거 로직 구현
  - 색상 값 정규화 (대소문자, 축약형 처리)
  - Mock API의 색상 데이터를 실제 추출 결과로 교체
  - _Requirements: 1.2_

- [x] 7.1 색상 추출 로직 단위 테스트

  - 다양한 색상 형식 테스트 케이스 작성 (HEX, RGB, RGBA)
  - 중복 제거 로직 검증
  - 색상 정규화 로직 검증
  - 엣지 케이스 테스트 (잘못된 형식, 빈 CSS)
  - _Requirements: 1.2_
-

- [x] 8. 백엔드 정적 분석 - 타이포그래피 추출




  - font-family 추출 정규식 구현
  - font-size 추출 정규식 구현
  - font-weight 추출 정규식 구현
  - line-height 추출 정규식 구현
  - FontToken 객체 생성 및 중복 제거
  - Mock API의 폰트 데이터를 실제 추출 결과로 교체
  - _Requirements: 1.3_

- [x] 8.1 타이포그래피 추출 로직 단위 테스트

  - 다양한 폰트 선언 형식 테스트
  - 폰트 크기 단위 테스트 (px, rem, em)
  - FontToken 객체 생성 검증
  - _Requirements: 1.3_
-

- [x] 9. 백엔드 정적 분석 - 간격 및 효과 추출




  - padding/margin 값 추출 정규식 구현
  - border-radius 값 추출 정규식 구현
  - box-shadow 값 추출 정규식 구현
  - 간격 값 정규화 (단위 통일)
  - EffectToken 객체 생성
  - 프론트엔드에 간격/효과 토큰 섹션 추가
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9.1 간격 및 효과 추출 로직 단위 테스트

  - 다양한 간격 값 형식 테스트
  - box-shadow 복잡한 값 파싱 검증
  - 정규화 로직 테스트
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. 백엔드 정적 분석 - CSS 애니메이션 추출





  - @keyframes 규칙 추출 정규식 구현
  - 애니메이션 이름 및 전체 정의 파싱
  - AnimationToken 객체 생성
  - 프론트엔드에 애니메이션 토큰 섹션 추가
  - StarterKitBuilder에 buildAnimationCSS 함수 구현
  - 개별 애니메이션 CSS 파일 생성 로직
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 10.1 애니메이션 추출 로직 단위 테스트

  - @keyframes 파싱 검증
  - 복잡한 애니메이션 정의 테스트
  - AnimationToken 생성 검증
  - _Requirements: 4.1, 4.2_

- [x] 11. 오류 처리 및 사용자 피드백




  - ErrorHandler 클래스 구현
  - 네트워크 오류 처리 및 사용자 메시지
  - 파싱 오류 처리
  - 프론트엔드 오류 표시 UI 구현
  - 오류 로깅 (서버 측)
  - _Requirements: 1.5, 8.1, 8.2, 8.4_
-

- [x] 12. 백엔드 동적 분석 - Puppeteer 설정




  - Puppeteer 설치 및 기본 설정
  - DynamicAnalyzer 클래스 생성
  - 헤드리스 브라우저 실행 로직
  - 페이지 로드 및 기본 네비게이션
  - 브라우저 오류 처리 (실패 시 정적 분석만 반환)
  - _Requirements: 5.1, 8.2_
- [x] 13. 백엔드 동적 분석 - 모션 관찰 로직




- [ ] 13. 백엔드 동적 분석 - 모션 관찰 로직

  - page.evaluate()를 사용한 클라이언트 측 스크립트 주입
  - IntersectionObserver를 사용한 스크롤 트리거 감지
  - getComputedStyle을 사용한 스타일 변화 기록
  - requestAnimationFrame을 사용한 프레임별 속성 추적
  - opacity, transform 속성 변화 기록
  - ObservedAnimation 데이터 구조 생성
  - _Requirements: 5.2, 5.3_
-

- [x] 14. 백엔드 동적 분석 - 모션 리포트 생성



  - 관찰된 애니메이션 데이터 분석
  - 트리거 조건, 지속 시간, 속성 변화 추출
  - CSS @keyframes 재구현 코드 스니펫 생성
  - Web Animation API 코드 스니펫 생성
  - GSAP 힌트 코드 생성 (선택적)
  - MotionReport Markdown 파일 생성
  - _Requirements: 5.4, 5.5_


- [x] 15. 프론트엔드 모션 리포트 통합



  - 동적 분석 옵션 UI 추가 (체크박스)
  - 모션 리포트 표시 섹션 구현
  - StarterKitBuilder에 buildMotionReports 함수 구현
  - ZIP 파일에 motion_reports 폴더 포함
  - 모션 리포트 미리보기 기능
  - _Requirements: 5.5_

- [x] 16. 보안 및 입력 검증





  - URLValidator 클래스 구현
  - 프로토콜 검증 (HTTP/HTTPS만 허용)
  - 로컬/사설 IP 차단 로직
  - URL 형식 검증
  - Express rate limiting 미들웨어 추가 (15분당 10회)
  - CORS 설정 (환경 변수 기반)
  - _Requirements: 1.5, 9.4_
-

- [x] 17. 반응형 디자인 및 UI 개선





  - 모바일/태블릿 반응형 레이아웃 구현
  - CSS Modules 또는 Styled Components 설정
  - 토큰 매핑 UI 스타일링
  - 색상 미리보기 개선
  - 접근성 개선 (키보드 네비게이션, ARIA 레이블)
  - _Requirements: 9.3_

- [x] 18. 배포 준비 및 환경 설정








  - 환경 변수 설정 (프론트엔드: REACT_APP_API_URL)
  - 환경 변수 설정 (백엔드: PORT, NODE_ENV, FRONTEND_URL, TIMEOUT)
  - 프론트엔드 빌드 스크립트 설정
  - 백엔드 프로덕션 설정 (로깅, 압축)
  - Vercel 배포 설정 파일 (vercel.json)
  - Railway/Render 배포 설정 파일
  - HTTPS 설정 확인
  - _Requirements: 9.1, 9.2, 9.4, 9.5_




- [x] 19. 프론트엔드 단위 테스트






  - URL 검증 로직 테스트
  - 토큰 매핑 로직 테스트
  - 파일 생성 함수 테스트 (buildCSS, buildSCSS, buildJSON)
  - _Requirements: All_

- [x] 19.1 통합 테스트



  - API 엔드포인트 테스트
  - 전체 분석 플로우 테스트 (샘플 HTML/CSS 사용)
  - 오류 시나리오 테스트

  --_Requirements: Al
l_
-

- [x] 20. 문서화 및 최종 점검






  - 프로젝트 README.md 작성
  - API 문서 작성
  - 사용자 가이드 작성
  - 코드 주석 추가
  - 성능 최적화 검토
  - _Requirements: All_
