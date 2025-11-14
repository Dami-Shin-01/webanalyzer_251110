# Project Snapshot 🎨

> 웹사이트 디자인 시스템 자동 분석 도구

레퍼런스 웹사이트의 URL을 입력하면 디자인 토큰(색상, 폰트, 간격 등)과 애니메이션을 자동으로 추출하여 즉시 사용 가능한 디자인 시스템 스타터 킷을 생성합니다.

## ✨ 주요 기능

- **정적 분석**: CSS 파일에서 색상, 폰트, 간격, 효과, 애니메이션 자동 추출
- **동적 분석**: 헤드리스 브라우저로 JavaScript 기반 모션 관찰 및 재구현 가이드 생성
- **토큰 매핑**: 추출된 값에 의미 있는 이름 부여 (향상된 색상 미리보기 포함)
- **다중 포맷 내보내기**: CSS, SCSS, JSON 형식으로 스타터 킷 생성
- **즉시 다운로드**: ZIP 파일로 패키징하여 프로젝트에 바로 적용
- **반응형 UI**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 사용자 경험
- **접근성**: WCAG 준수, 키보드 네비게이션, 스크린 리더 지원

## 🎯 사용 사례

- 레퍼런스 사이트의 디자인 시스템을 빠르게 분석하고 싶을 때
- 수동으로 개발자 도구를 열어 CSS 값을 복사하는 시간을 절약하고 싶을 때
- 일관된 디자인 토큰 시스템을 구축하고 싶을 때
- 복잡한 애니메이션을 재구현하는 방법을 알고 싶을 때

## 📁 프로젝트 구조

```
project-snapshot/
├── backend/                    # Node.js/Express API 서버
│   ├── src/
│   │   ├── server.js          # Express 서버 설정
│   │   ├── routes/            # API 라우트
│   │   ├── analyzers/         # 정적/동적 분석기
│   │   ├── parsers/           # CSS 파서
│   │   ├── generators/        # 모션 리포트 생성기
│   │   └── utils/             # 유틸리티 (검증, 오류 처리)
│   └── package.json
├── frontend/                   # React 웹 애플리케이션
│   ├── src/
│   │   ├── App.js             # 메인 앱 컴포넌트
│   │   ├── components/        # UI 컴포넌트
│   │   ├── services/          # API 통신
│   │   └── utils/             # 스타터 킷 빌더
│   └── package.json
├── .kiro/specs/               # 프로젝트 명세서
├── DEPLOYMENT.md              # 배포 가이드
├── ENVIRONMENT_VARIABLES.md   # 환경 변수 문서
├── PRODUCTION_CHECKLIST.md    # 프로덕션 체크리스트
└── README.md                  # 이 파일
```

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Git

### 자동 설치 및 실행

**Windows:**
```bash
start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

이 스크립트는 자동으로:
- 환경 변수 파일 생성
- 의존성 설치
- 백엔드와 프론트엔드 서버 동시 실행

### 수동 설치

#### 1. 백엔드 설정

```bash
cd backend
npm install
cp .env.example .env
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

#### 2. 프론트엔드 설정

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

애플리케이션이 http://localhost:3000 에서 실행됩니다.

### 설치 확인

1. 브라우저에서 http://localhost:3000 접속
2. URL 입력 필드에 `https://example.com` 입력
3. "분석 시작" 버튼 클릭
4. 분석 결과 확인

## 📖 사용 방법

### 기본 사용법

1. **URL 입력**: 분석하고 싶은 웹사이트 URL 입력
2. **분석 시작**: "분석 시작" 버튼 클릭
3. **진행 상태 확인**: 실시간 분석 진행 상황 모니터링
4. **토큰 매핑**: 추출된 디자인 값에 의미 있는 이름 부여
5. **내보내기**: 원하는 형식(CSS/SCSS/JSON) 선택 후 다운로드

### 고급 기능

#### 동적 분석 활성화

동적 분석을 활성화하면 JavaScript로 구현된 애니메이션도 분석합니다:
- 스크롤 트리거 효과
- 호버 애니메이션
- 페이지 로드 애니메이션

#### 이름 없는 토큰 처리

- **제외**: 이름을 지정하지 않은 토큰은 스타터 킷에 포함하지 않음
- **포함**: 자동 생성된 이름으로 모든 토큰 포함

### 생성되는 스타터 킷 구조

```
project-snapshot-kit.zip
├── design_system/
│   ├── tokens.css          # CSS 변수 형식
│   ├── tokens.scss         # SCSS 변수 형식
│   └── tokens.json         # JSON 형식
├── motion_library/
│   ├── css/
│   │   └── *.css          # 추출된 CSS 애니메이션
│   └── js_motion_reports/
│       └── *.md           # 동적 애니메이션 재구현 가이드
└── README.md              # 사용 가이드
```

## 🏗️ 아키텍처

### 시스템 구성

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ HTTPS   │   Backend   │  HTTP   │   Target    │
│  (React)    │────────▶│  (Express)  │────────▶│   Website   │
│             │◀────────│             │◀────────│             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │
      │                       │
      ▼                       ▼
  Token Mapping         Static Analysis
  Starter Kit          Dynamic Analysis
   Generation           (Puppeteer)
```

### 주요 컴포넌트

**Frontend:**
- `URLInput`: URL 입력 및 검증
- `ProgressIndicator`: 분석 진행 상태 표시
- `DesignStudio`: 토큰 매핑 인터페이스
- `ExportOptions`: 내보내기 옵션 선택
- `StarterKitBuilder`: 스타터 킷 생성 및 다운로드

**Backend:**
- `StaticAnalyzer`: HTML/CSS 다운로드 및 파싱
- `CSSParser`: CSS 값 추출 (색상, 폰트, 간격, 효과, 애니메이션)
- `DynamicAnalyzer`: Puppeteer 기반 모션 관찰
- `MotionReportGenerator`: 애니메이션 재구현 가이드 생성
- `URLValidator`: URL 검증 및 보안 체크
- `ErrorHandler`: 통합 오류 처리

## 🔧 API 문서

자세한 API 문서는 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)를 참조하세요.

### 주요 엔드포인트

- `POST /api/analyze` - 웹사이트 분석
- `GET /health` - 헬스체크

## 🚀 배포

프로덕션 배포에 대한 자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요.

### 권장 배포 플랫폼

- **Frontend**: Vercel (자동 HTTPS, 무료 티어)
- **Backend**: Railway 또는 Render (자동 HTTPS, 무료 티어)

### 환경 변수

환경 변수 설정에 대한 자세한 내용은 [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)를 참조하세요.

## 🧪 테스트

### 테스트 실행

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### 테스트 커버리지

- 단위 테스트: CSS 파싱, 토큰 추출, URL 검증
- 통합 테스트: API 엔드포인트, 전체 분석 플로우
- 보안 테스트: 입력 검증, 레이트 리미팅

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Browser Automation**: Puppeteer
- **HTML Parsing**: Cheerio
- **HTTP Client**: Axios
- **Security**: Helmet, CORS, Express Rate Limit
- **Performance**: Compression (Gzip)
- **Logging**: Morgan

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **File Compression**: JSZip
- **Styling**: Responsive CSS with Flexbox/Grid
- **Accessibility**: ARIA labels, keyboard navigation, WCAG AA compliance

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **CI/CD**: GitHub Actions (optional)
- **Monitoring**: Built-in logging

## 📚 추가 문서

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API 상세 문서
- [USER_GUIDE.md](USER_GUIDE.md) - 사용자 가이드
- [DEPLOYMENT.md](DEPLOYMENT.md) - 배포 가이드
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) - 환경 변수 문서
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - 프로덕션 체크리스트

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 개발 상태

- [x] Task 1-16: 핵심 기능 구현 완료
- [x] Task 17: 반응형 UI 및 접근성 개선
- [x] Task 18: 배포 준비 및 환경 설정
- [x] Task 19: 테스트 구현
- [x] Task 20: 문서화 및 최종 점검

## ⚠️ 알려진 제한사항

- CORS 정책으로 인해 일부 웹사이트는 분석이 불가능할 수 있습니다
- 동적 분석은 서버 리소스를 많이 사용하므로 프로덕션 환경에서는 제한될 수 있습니다
- 매우 큰 CSS 파일(>5MB)은 분석 시간이 오래 걸릴 수 있습니다
- 레이트 리미팅: 15분당 10회 요청 제한

## ♿ 접근성 기능

- **키보드 네비게이션**: Tab, Enter, Space, Escape, Arrow 키 지원
- **스크린 리더**: ARIA 레이블 및 역할 정의
- **고대비 모드**: 시스템 설정 자동 감지 및 적용
- **모션 감소**: prefers-reduced-motion 지원
- **WCAG AA 준수**: 색상 대비, 터치 타겟 크기 최적화

## 🐛 문제 해결

일반적인 문제와 해결 방법:

### CORS 오류
- 대상 웹사이트가 CORS를 허용하지 않는 경우 발생
- 해결: 브라우저 확장 프로그램 사용 또는 다른 사이트 시도

### Puppeteer 실행 실패
- 서버 환경에서 헤드리스 브라우저 실행 권한 부족
- 해결: 동적 분석 비활성화 또는 서버 설정 조정

### 타임아웃 오류
- 대상 웹사이트 응답이 느린 경우
- 해결: `TIMEOUT` 환경 변수 증가 (기본 30초)

더 많은 문제 해결 방법은 [DEPLOYMENT.md](DEPLOYMENT.md)의 Troubleshooting 섹션을 참조하세요.

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👥 제작자

Project Snapshot - 웹 디자인 시스템 자동 분석 도구

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 사용합니다:
- React
- Express.js
- Puppeteer
- Cheerio
- JSZip

---

**문의사항이나 버그 리포트는 GitHub Issues를 이용해주세요.**
