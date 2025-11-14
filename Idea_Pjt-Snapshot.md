# 서비스 기획안: "스냅샷" (Project Snapshot)
## 웹사이트 디컨스트럭터 & 스타터 킷

---

### 1. 서비스명 (가칭)
**"스냅샷: 웹사이트 디컨스트럭터 & 스타터 킷"** (Project Snapshot: Website Deconstructor & Starter Kit)

### 2. 서비스 핵심 컨셉 (Elevator Pitch)
"스냅샷"은 레퍼런스 웹사이트의 URL을 입력받아, 해당 사이트의 **정적 디자인 시스템(토큰)**과 **동적 모션(애니메이션)**을 분석/관찰하여, 개발자와 디자이너가 즉시 사용할 수 있는 **'디자인 시스템 스타터 킷'**과 **'모션 재구현 가이드'**를 생성해 주는 개인용 생산성 도구입니다.

### 3. 타겟 유저
* **프론트엔드 개발자:** 클라이언트가 제시한 레퍼런스 사이트와 유사한 스타일의 프로젝트를 빠르게 부트스트래핑(초기 세팅)해야 할 때
* **웹 디자이너:** 경쟁사 또는 훌륭한 레퍼런스 사이트의 디자인 시스템(색상, 폰트, 간격)과 인터랙션을 학습하고, 자신의 새 프로젝트에 적용해보고자 할 때
* **1인 개발자 / 프리랜서:** 디자인과 개발을 모두 담당하며, 레퍼런스 분석에 드는 시간을 획기적으로 줄이고 싶을 때

### 4. 핵심 사용자 시나리오 (User Flow)
1.  **[입력]** 사용자가 "스냅샷" 서비스에 접속하여 분석을 원하는 레퍼런스 웹사이트의 URL을 입력합니다.
2.  **[분석]** 시스템이 백그라운드에서 해당 URL을 스캔합니다.
    * **(정적 분석):** CSS 파일을 파싱하여 사용된 모든 색상, 폰트, 간격, 그림자 값 등을 추출합니다.
    * **(동적 분석):** 가상 브라우저(Headless Browser)를 실행시켜 스크롤, 호버 등과 같은 상호작용을 시뮬레이션하며 요소의 CSS 속성 변화(`transform`, `opacity` 등)를 '관찰'하고 '기록'합니다.
3.  **[정의]** "디자인 스튜디오" UI가 표시됩니다.
    * **(토큰 매핑):** 좌측에는 추출된 CSS 값(e.g., `#34A853`), 우측에는 사용자가 입력할 토큰 이름(e.g., `primary-green`) 입력란이 표시됩니다. 사용자가 직접 값에 '의미'를 부여합니다.
    * **(모션 검토):** 관찰된 JS/CSS 애니메이션 목록(e.g., '스크롤 시 페이드인 효과')이 표시됩니다. 사용자는 이 중 저장할 애니메이션을 선택합니다.
4.  **[내보내기]** 사용자가 '스타터 킷 생성' 버튼을 클릭합니다.
5.  **[결과물]** 정의된 토큰과 선택된 애니메이션이 포함된 `.zip` 파일을 다운로드합니다.

---

### 5. 서비스의 핵심 기능

#### 1. 정적 디자인 토큰 추출기
* 사이트에서 사용된 모든 고유한 CSS 값을 추출합니다.
    * **Colors:** `HEX`, `RGB(A)` 값
    * **Typography:** `font-family`, `font-size`, `font-weight`, `line-height`
    * **Spacing & Layout:** `padding`, `margin`, `border-radius` 등의 유의미한 값
    * **Effects:** `box-shadow`, `filter` 값

#### 2. 인터랙티브 토큰 매핑 스튜디오 (★핵심 가치★)
* 추출된 '값'을 '토큰'으로 승격시키는 핵심 UI입니다.
* 사용자는 `e.g., "16px"`라는 값에 `e.g., "spacing-md"` 또는 `e.g., "font-size-base"`라는 이름을 직접 부여합니다.
* 이 매핑 정보를 기반으로 최종 '스타터 킷'이 생성됩니다.

#### 3. CSS 애니메이션 라이브러리
* 분석된 사이트의 CSS 파일에서 `@keyframes` 규칙과 주요 `transition` 클래스를 추출합니다.
* 사용자가 "스튜디오"에서 이름을 부여하면(e.g., `pulse-effect`), 개별 `.css` 파일로 저장하여 라이브러리화 합니다.

#### 4. JS 모션 분석 엔진 (관찰 기반)
* Puppeteer, Playwright 등 헤드리스 브라우저 기술을 사용합니다.
* 스크롤, 호버 등의 이벤트를 시뮬레이션하며 특정 요소의 스타일 변화(`getComputedStyle`)를 시간대별로 기록합니다.
* **추출 대상:** `opacity`, `transform`(`translate`, `scale`, `rotate`), `filter` 등 애니메이션의 핵심 속성
* **분석:** 트리거(e.g., 뷰포트 진입), 지속 시간(duration), 속성 변화 값(from/to)을 분석합니다.

#### 5. 모션 재구현 가이드 (Motion Report)
* JS 모션 분석 엔진의 결과물입니다.
* 각 애니메이션 현상에 대해 다음과 같은 '리포트'를 생성하여 `markdown` 또는 `html` 파일로 제공합니다.
    * **관찰된 현상:** e.g., "요소가 30px 아래에서 위로 올라오며 투명도가 0에서 1로 변함"
    * **측정된 값:** e.g., "Duration: 600ms", "Easing: Ease-out (추정)"
    * **재구현 추천 코드 (Snippet):**
        * CSS `@keyframes` 추천안
        * Web Animation API (JS) 추천안
        * GSAP / Framer Motion 힌트 코드 (e.g., `gsap.from(...)`)

### 6. 최종 산출물 (The Starter Kit)
사용자가 다운로드하는 `.zip` 파일의 예시 구조입니다.



project-snapshot-kit/
├── 1. design_system/
│ ├── tokens.css (e.g., :root { --primary-color: #34A853; ... })
│ ├── tokens.scss (e.g., $primary-color: #34A853; ...)
│ ├── tokens.json (디자인 시스템 연동용)
│ └── tailwind.config.js (TailwindCSS용 테마 설정 파일 - 선택적)
│
├── 2. motion_library/
│ ├── css/ (CSS 애니메이션 라이브러리)
│ │ ├── pulse.css
│ │ └── slide-in.css
│ └── js_motion_reports/ (JS 애니메이션 재구현 가이드)
│ ├── scroll-fade-in.md
│ └── card-hover-effect.md
│
└── README.md (킷 사용 설명서)

