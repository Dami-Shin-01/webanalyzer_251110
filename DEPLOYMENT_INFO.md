# 배포 정보 (Deployment Information)

## 🌐 배포된 URL

### Frontend (Vercel)
- **URL**: https://webanalyzer-251110.vercel.app (커스텀 도메인)
- **Dashboard**: https://vercel.com/daynashins-projects/frontend
- **Status**: ✅ 배포 완료 (환경 변수 적용)

### Backend (Render)
- **URL**: https://webanalyzer-backend.onrender.com
- **Health Check**: https://webanalyzer-backend.onrender.com/health
- **Status**: ✅ 배포 완료

---

## ⚙️ 환경 변수 설정

### Frontend (Vercel)
```
REACT_APP_API_URL=https://webanalyzer-backend.onrender.com
```

### Backend (Render)
```
NODE_ENV=production
PORT=10000
TIMEOUT=30000
FRONTEND_URL=https://webanalyzer-251110.vercel.app
```

**중요**: Backend의 `FRONTEND_URL`을 반드시 업데이트해주세요!

---

## 🔄 재배포 방법

### 자동 배포
```bash
git add .
git commit -m "Update message"
git push origin main
```

GitHub에 push하면 자동으로 재배포됩니다.

### 수동 배포 (Vercel CLI)
```bash
cd frontend
vercel --prod
```

---

## ✅ 배포 확인 체크리스트

- [ ] Backend Health Check 응답 확인
- [ ] Frontend 페이지 로드 확인
- [ ] Backend `FRONTEND_URL` 환경 변수 업데이트
- [ ] URL 입력 및 분석 기능 테스트
- [ ] CORS 에러 없는지 확인
- [ ] 모바일 반응형 확인

---

## 📝 다음 단계

1. **Backend 환경 변수 업데이트** ⚠️ 중요!
   - Render Dashboard → webanalyzer-backend → Environment
   - `FRONTEND_URL` = `https://webanalyzer-251110.vercel.app`
   - Save Changes (자동 재배포됨)

2. **Frontend 테스트**
   - https://webanalyzer-251110.vercel.app 접속
   - URL 입력 및 분석 기능 테스트

3. **커스텀 도메인 설정 (선택사항)**
   - Vercel Dashboard에서 Custom Domain 추가
   - DNS 설정

---

## 🐛 문제 해결

### Backend가 응답하지 않는 경우
- Render Free Plan은 15분 비활성 후 sleep 모드
- 첫 요청 시 30초~1분 소요 (정상)
- Render Dashboard에서 로그 확인

### CORS 에러
- Backend의 `FRONTEND_URL` 확인
- Frontend의 `REACT_APP_API_URL` 확인

### 배포 실패
- Vercel: Dashboard → Deployments → Logs 확인
- Render: Dashboard → Logs 확인

---

## 📊 모니터링

- **Vercel Analytics**: https://vercel.com/daynashins-projects/frontend/analytics
- **Render Metrics**: https://dashboard.render.com → webanalyzer-backend → Metrics

---

배포 날짜: 2025-11-14
