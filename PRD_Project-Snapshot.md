# PRD(제품 요구 사항 문서): "스냅샷" (Project Snapshot)

| 항목 | 내용 |
| --- | --- |
| **프로젝트명** | "스냅샷" (Project Snapshot): 웹사이트 디컨스트럭터 & 스타터 킷 |
| **문서 버전** | v1.0 (최초 기획안) |
| **작성자** | (사용자 본인) |
| **최종 목표** | 레퍼런스 웹사이트의 디자인 시스템(토큰)과 모션(애니메이션)을 분석/관찰하여, 즉시 사용 가능한 '디자인 시스템 스타터 킷'과 '모션 재구현 가이드'를 생성하는 개인용 생산성 도구 개발. |

---

## 1. 핵심 목적 (Problem & Solution)

* **Problem:** 웹 디자이너/개발자가 레퍼런스 사이트를 분석할 때, 개발자 도구(F12)를 열어 수동으로 CSS 값(색상, 폰트, 간격)을 복사하고, 애니메이션을 '눈대중'으로 추측하는 데 과도한 시간을 소모한다.
* **Solution:** 이 과정을 자동화한다. URL 입력만으로 사이트의 정적 스타일과 동적 모션을 '관찰'하고, 이를 '재사용 가능한 코드(스타터 킷)'와 '수치화된 문서(모션 리포트)'로 즉시 제공하여, 지루한 분석 시간을 줄이고 창의적인 본연의 업무에 집중하도록 돕는다.

## 2. 타겟 유저
* **Primary User:** 본인 (웹 디자이너 겸 개발자)
* **Use Case:** 클라이언트 프로젝트 또는 개인 프로젝트 진행 시, 레퍼런스 사이트의 디자인과 인터랙션을 빠르고 정확하게 학습하여 내 프로젝트의 초기 세팅(부트스트래핑)에 활용한다.

## 3. 기술 스택 (Tech Stack)

| 구분 | 기술 | 목적 |
| --- | --- | --- |
| **Backend (분석 엔진)** | Node.js, Express.js | API 서버 구축 |
| | `cors` | 로컬 프론트엔드와의 API 통신 허용 |
| **Backend (정적 분석)** | `axios`, `cheerio` | URL의 HTML/CSS 파일 다운로드 및 파싱 |
| **Backend (동적 분석)** | `Puppeteer` / `Playwright` | 가상 브라우저 실행, 스크롤/호버 시뮬레이션 및 스타일 '관찰' |
| **Frontend (UI)** | React.js | '디자인 스튜디오' UI 구축 |
| **Frontend (API 통신)** | `axios` | 백엔드 API 호출 |
| **Frontend (파일 생성)**| `jszip` | 분석 결과를 `.zip` 스타터 킷으로 압축 및 다운로드 |

---

## 4. 핵심 기능 요구사항 (Features)

| ID | 기능명 | 상세 요구사항 (Gemini CLI 지시용) |
| --- | --- | --- |
| **F-01** | **백엔드: 정적 분석 API** | **(Phase 1)** Node.js/Express로 `/analyze` GET 엔드포인트 생성.<br/> `url` 쿼리 파라미터를 받음. |
| **F-01a** | HTML/CSS 수집 | `axios`로 `url`의 HTML을 로드.<br/> `cheerio`로 `<link rel="stylesheet">`의 `href` 속성 추출.<br/> 추출된 CSS 파일 URL들을 다시 `axios`로 가져와 하나의 텍스트로 병합. |
| **F-01b**| 정적 토큰 추출 | **(MVP)** 정규식(Regex)을 사용해 CSS 텍스트에서 모든 고유한 `HEX`, `rgb(a)` (색상), `font-family`, `font-size` (타이포) 값을 추출.<br/> **(Phase 3)** `padding`, `margin`, `border-radius`, `box-shadow` 값 추출 로직 추가.<br/> **(Phase 3)** `@keyframes` 블록 전체 추출 로직 추가. |
| **F-01c**| JSON 응답 | 추출된 모든 데이터를 (e.g., `{"colors": [...], "fonts": [...], "keyframes": [...]}`) JSON 형식으로 프론트엔드에 응답. |
| **F-02** | **프론트엔드: UI** | **(Phase 2)** React 앱 기본 설정. |
| **F-02a**| URL 입력부 | `input` (URL 입력창)과 `button` (분석 요청) UI 생성. |
| **F-02b**| API 연동 | '분석' 버튼 클릭 시 F-01 API를 호출하고, 반환된 JSON을 React State에 저장. |
| **F-02c**| 디자인 스튜디오 UI | State의 데이터를 기반으로 '추출된 값'(e.g., `#FF0000`)과 '토큰 이름 입력창'(e.g., `[ ]`)을 나란히 표시. (React `map` 함수 활용) |
| **F-03** | **프론트엔드: 스타터 킷** | **(Phase 2)** '내보내기' 버튼 UI 생성. |
| **F-03a**| 토큰 → 코드 변환 | 사용자가 F-02c에서 입력한 토큰 이름을 기반으로 CSS 변수 문자열 (e.g., `:root { --primary: #FF0000; }`) 및 JSON/SCSS 문자열 생성. |
| **F-03b**| ZIP 파일 생성 | `jszip` 라이브러리를 사용하여 변환된 문자열을 `tokens.css`, `tokens.json` 파일로 만들고, 이를 `design_system.zip` 파일로 압축하여 다운로드. |
| **F-04** | **백엔드: 동적 분석 엔진**| **(Phase 4)** F-01a의 `axios`/`cheerio` 로직을 `Puppeteer`로 대체/보강. |
| **F-04a**| 모션 관찰 로직 | `Puppeteer`의 `page.evaluate()` 내부에서 `IntersectionObserver` (스크롤 감지) 등을 활용.<br/> 요소가 뷰포트에 나타날 때 `getComputedStyle`과 `requestAnimationFrame`을 사용해 `opacity`, `transform` 등의 속성 변화를 시간대별로 기록(Observe). |
| **F-04b**| 모션 리포트 생성 | F-04a에서 기록된 데이터를 분석하여 '트리거', '지속 시간', '속성 변화(from/to)' 등을 포함하는 '모션 리포트' 데이터 구조(JSON) 생성. |
| **F-05** | **프론트엔드: 모션 킷** | **(Phase 4)** |
| **F-05a**| 모션 리포트 문서화 | F-04b의 리포트 데이터를 기반으로, 재구현을 위한 코드 스니펫 (CSS @keyframes, Web Animation API 추천안)이 포함된 마크다운(`.md`) 파일 내용 생성. |
| **F-05b**| ZIP에 모션 포함 | F-03b의 `jszip` 로직에, 생성된 `.md` 파일들을 `motion_reports/` 폴더에 포함하여 함께 압축. |

---

## 5. 단계별 구현 로드맵 (Gemini CLI 실행 순서)

### Phase 1: 백엔드 API (정적 분석 MVP)
* **목표:** URL을 주면 색상과 폰트 리스트를 JSON으로 반환하는 API 완성.
* **작업 순서 (CLI 프롬프트 단위):**
    1.  Node.js + Express + `cors` 기본 서버 코드 작성 (F-01)
    2.  `/analyze` 라우트 추가, `axios` `cheerio` 설치 및 HTML/CSS 링크 추출 로직 작성 (F-01a)
    3.  CSS 파일 내용 취합 및 `HEX`/`rgb` 값 추출 정규식(Regex) 작성 (F-01b MVP)
    4.  `font-family`/`font-size` 값 추출 정규식 작성 (F-01b MVP)
    5.  추출된 데이터를 JSON으로 응답 (F-01c)

### Phase 2: 프론트엔드 UI (MVP) 및 킷 내보내기
* **목표:** 1단계 API를 호출하고, 사용자가 토큰 이름을 입력하여 CSS/JSON 킷을 다운로드.
* **작업 순서 (CLI 프롬프트 단위):**
    1.  `create-react-app` 기반 React 앱 기본 설정 (F-02)
    2.  URL 입력창, 분석 버튼 UI 및 `axios` API 호출 로직 작성 (F-02a, F-02b)
    3.  '디자인 스튜디오' UI: API 결과(State)를 `map`으로 순회하며 값/입력창 렌더링 (F-02c)
    4.  `jszip` 설치 및 '내보내기' 버튼, `tokens.css` 파일 생성 로직 작성 (F-03, F-03a, F-03b)
    5.  (테스트) `tokens.json`, `tokens.scss` 파일 생성 로직 추가 (F-03a)

### Phase 3: 분석 기능 확장 (고도화)
* **목표:** 더 많은 CSS 토큰(간격, 그림자)과 CSS 애니메이션을 추출.
* **작업 순서 (CLI 프롬프트 단위):**
    1.  (백엔드) `spacing` (`padding`, `margin`), `effects` (`box-shadow`) 추출 정규식 추가 (F-01b)
    2.  (프론트엔드) 스튜디오 UI에 `spacing`, `effects` 섹션 추가 (F-02c)
    3.  (백엔드) `@keyframes` 추출 정규식 추가 (F-01b)
    4.  (프론트엔드) 내보내기 로직에 `animations.css` 파일 추가 (F-03b)

### Phase 4: 동적 모션 분석 (최종 단계)
* **목표:** JS 기반 애니메이션을 '관찰'하고 '리포트'를 생성하여 킷에 포함.
* **작업 순서 (CLI 프롬프트 단위):**
    1.  `Puppeteer` 설치 및 백엔드 F-01a 로직을 `Puppeteer`로 교체 (F-04)
    2.  `page.evaluate()` 내부에 `IntersectionObserver` 및 스타일 기록 로직 초안 작성 (F-04a)
    3.  기록된 데이터를 '모션 리포트' JSON 구조로 가공하는 함수 작성 (F-04b)
    4.  (프론트엔드) 내보내기 로직에 `motion-report.md` 파일 생성 로직 추가 (F-05a, F-05b)

## 6. 제약 조건 (Constraints)
* **인증:** 개인용 도구이므로 로그인, 인증(Authentication) 기능은 구현하지 않는다.
* **분석 대상:** 공개된 웹사이트(로그인 장벽이 없는)로 한정한다.
* **범위:** 소스 코드(React 컴포넌트 구조 등)가 아닌, 렌더링된 '결과물'을 분석/관찰한다.