# 배포 가이드 (Deployment Guide)

이 프로젝트는 Frontend와 Backend를 분리하여 배포합니다.

## 📋 배포 개요

- **Frontend**: Vercel (정적 사이트 호스팅)
- **Backend**: Render (Node.js 서버)

---

## 🚀 Backend 배포 (Render)

### 1단계: Render 계정 생성 및 로그인
1. [Render](https://render.com)에 접속
2. GitHub 계정으로 로그인

### 2단계: 새 Web Service 생성
1. Dashboard에서 "New +" 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결: `Dami-Shin-01/webanalyzer_251110`
4. 다음 설정 입력:

```
Name: webanalyzer-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 3단계: 환경 변수 설정
Environment Variables 섹션에서 다음 추가:

```
NODE_ENV=production
PORT=10000
TIMEOUT=30000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 4단계: 배포
- "Create Web Service" 클릭
- 배포 완료 후 URL 복사 (예: `https://webanalyzer-backend.onrender.com`)

---

## 🎨 Frontend 배포 (Vercel)

### 1단계: Vercel 계정 생성 및 로그인
1. [Vercel](https://vercel.com)에 접속
2. GitHub 계정으로 로그인

### 2단계: 프로젝트 Import
1. "Add New..." → "Project" 클릭
2. GitHub 저장소 선택: `Dami-Shin-01/webanalyzer_251110`
3. "Import" 클릭

### 3단계: 프로젝트 설정
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 4단계: 환경 변수 설정
Environment Variables 섹션에서 추가:

```
REACT_APP_API_URL=https://webanalyzer-backend.onrender.com
```

**중요**: Backend URL을 정확히 입력하세요 (2단계에서 복사한 URL)

### 5단계: 배포
- "Deploy" 클릭
- 배포 완료 후 Frontend URL 확인

---

## 🔄 Backend 환경 변수 업데이트

Frontend 배포 완료 후, Backend의 `FRONTEND_URL`을 업데이트해야 합니다:

1. Render Dashboard → 해당 Web Service 선택
2. "Environment" 탭
3. `FRONTEND_URL` 값을 Frontend URL로 변경
4. "Save Changes" → 자동 재배포

---

## ✅ 배포 확인

### Backend 확인
```bash
curl https://webanalyzer-backend.onrender.com/health
```

응답: `{"status":"ok","timestamp":"..."}`

### Frontend 확인
브라우저에서 Frontend URL 접속하여 정상 작동 확인

---

## 🔧 CLI를 통한 배포 (선택사항)

### Vercel CLI 설치 및 배포
```bash
npm install -g vercel

# Frontend 디렉토리로 이동
cd frontend

# 로그인
vercel login

# 배포
vercel --prod
```

### Render CLI 배포
Render는 Git push 시 자동 배포됩니다.

---

## 📝 배포 후 체크리스트

- [ ] Backend health check 응답 확인
- [ ] Frontend 페이지 로드 확인
- [ ] URL 입력 및 분석 기능 테스트
- [ ] 에러 처리 확인
- [ ] 내보내기 기능 테스트
- [ ] 모바일 반응형 확인

---

## 🐛 문제 해결

### Backend 배포 실패
- Render 로그 확인: Dashboard → Logs
- `package.json`의 dependencies 확인
- Node 버전 호환성 확인

### Frontend 배포 실패
- Vercel 로그 확인: Deployment → View Function Logs
- 환경 변수 설정 확인
- Build 명령어 확인

### CORS 에러
- Backend의 `FRONTEND_URL` 환경 변수 확인
- Frontend의 `REACT_APP_API_URL` 확인

---

## 🔄 재배포

### 자동 배포
- `main` 브랜치에 push하면 자동으로 재배포됩니다

### 수동 배포
- **Vercel**: Dashboard → Deployments → Redeploy
- **Render**: Dashboard → Manual Deploy → Deploy latest commit

---

## 📊 모니터링

### Vercel
- Analytics: 트래픽 및 성능 모니터링
- Logs: 실시간 로그 확인

### Render
- Metrics: CPU, 메모리 사용량
- Logs: 서버 로그 확인

---

## 💰 비용

- **Vercel Free Plan**: 월 100GB 대역폭
- **Render Free Plan**: 월 750시간 (비활성 시 자동 sleep)

**참고**: Render Free Plan은 15분 비활성 후 sleep 모드로 전환되며, 첫 요청 시 재시작에 30초~1분 소요됩니다.
