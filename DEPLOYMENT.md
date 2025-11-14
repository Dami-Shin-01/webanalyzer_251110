# Deployment Guide - Project Snapshot

This guide covers deploying the Project Snapshot application to production environments.

## Architecture Overview

- **Frontend**: React SPA deployed on Vercel
- **Backend**: Node.js/Express API deployed on Railway or Render
- **Communication**: HTTPS-only in production

## Prerequisites

- Node.js 18+ installed locally
- Git repository
- Accounts on:
  - Vercel (for frontend)
  - Railway or Render (for backend)

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
REACT_APP_API_URL=https://your-backend-domain.railway.app
```

**Vercel Configuration:**
- Set `REACT_APP_API_URL` in Vercel dashboard under Project Settings → Environment Variables
- Or use Vercel CLI: `vercel env add REACT_APP_API_URL`

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
TIMEOUT=30000
```

**Railway Configuration:**
- Set environment variables in Railway dashboard under Variables tab
- `NODE_ENV` is automatically set to `production`

**Render Configuration:**
- Set environment variables in Render dashboard under Environment tab
- Update `FRONTEND_URL` to match your Vercel deployment URL

## Deployment Steps

### 1. Deploy Backend (Railway)

#### Option A: Using Railway Dashboard

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the Node.js project
5. Set environment variables:
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `TIMEOUT`: 30000
6. Railway will automatically deploy using `railway.toml` configuration

#### Option B: Using Railway CLI

```bash
cd backend
railway login
railway init
railway up
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
```

### 2. Deploy Backend (Render - Alternative)

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render will detect `render.yaml` configuration
5. Set environment variables:
   - `FRONTEND_URL`: Your Vercel frontend URL
6. Click "Create Web Service"

### 3. Deploy Frontend (Vercel)

#### Option A: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect Create React App
5. Set environment variables:
   - `REACT_APP_API_URL`: Your Railway/Render backend URL
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts and set REACT_APP_API_URL when asked
```

### 4. Update CORS Configuration

After both deployments are complete:

1. Update backend `FRONTEND_URL` environment variable with actual Vercel URL
2. Update frontend `REACT_APP_API_URL` environment variable with actual Railway/Render URL
3. Redeploy both services to apply changes

## Build Scripts

### Frontend Build

```bash
cd frontend
npm install
npm run build
```

This creates an optimized production build in the `build/` directory.

### Backend Production Start

```bash
cd backend
npm install
NODE_ENV=production npm start
```

## HTTPS Configuration

### Automatic HTTPS

Both Vercel and Railway/Render provide automatic HTTPS:

- **Vercel**: Automatic SSL certificates via Let's Encrypt
- **Railway**: Automatic SSL on `*.railway.app` domains
- **Render**: Automatic SSL on `*.onrender.com` domains

### Custom Domains

#### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

#### Railway Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records (CNAME to Railway)
4. SSL certificate is automatically provisioned

## Health Checks

### Backend Health Check

```bash
curl https://your-backend-domain.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T10:00:00.000Z"
}
```

### Frontend Health Check

Visit your Vercel URL in a browser. The app should load without errors.

## Monitoring and Logs

### Railway Logs

```bash
railway logs
```

Or view in Railway dashboard under "Deployments" tab.

### Render Logs

View logs in Render dashboard under "Logs" tab.

### Vercel Logs

```bash
vercel logs
```

Or view in Vercel dashboard under "Deployments" → Select deployment → "Logs".

## Production Optimizations

### Backend Optimizations (Already Implemented)

- ✅ Gzip compression via `compression` middleware
- ✅ Security headers via `helmet` middleware
- ✅ Request logging via `morgan` middleware
- ✅ Rate limiting (10 requests per 15 minutes)
- ✅ Graceful shutdown handlers
- ✅ Error handling and logging

### Frontend Optimizations (Built-in)

- ✅ Code splitting
- ✅ Minification
- ✅ Asset optimization
- ✅ Cache headers for static assets

## Troubleshooting

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
1. Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
2. Ensure both URLs use HTTPS in production
3. Check browser console for specific CORS error
4. Redeploy backend after updating `FRONTEND_URL`

### Rate Limiting Issues

**Problem**: "Too many requests" error

**Solution**:
- Rate limit is 10 requests per 15 minutes per IP
- Wait 15 minutes or adjust rate limit in `backend/src/server.js`

### Puppeteer Issues on Railway/Render

**Problem**: Headless browser fails to launch

**Solution**:
- Railway/Render may have limitations with Puppeteer
- Consider using Puppeteer with `--no-sandbox` flag
- Or disable dynamic analysis in production if needed

### Build Failures

**Frontend Build Failure**:
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules build
npm install
npm run build
```

**Backend Build Failure**:
```bash
# Clear cache and reinstall
cd backend
rm -rf node_modules
npm install
```

## Security Checklist

- ✅ HTTPS enforced on both frontend and backend
- ✅ CORS properly configured with specific origin
- ✅ Rate limiting enabled
- ✅ Security headers via Helmet
- ✅ Input validation on all endpoints
- ✅ No sensitive data in logs
- ✅ Environment variables not committed to Git
- ✅ Dependencies regularly updated

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway Rollback

1. Go to Railway dashboard → Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Render Rollback

1. Go to Render dashboard → Deploys
2. Find previous working deployment
3. Click "Redeploy"

## Cost Estimates

### Free Tier Limits

- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Railway**: $5 free credit/month (~500 hours)
- **Render**: 750 hours/month free tier

### Scaling Considerations

- Backend is stateless and can scale horizontally
- Consider upgrading to paid tiers for:
  - Higher rate limits
  - More compute resources
  - Better performance for Puppeteer

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)

## Next Steps

After successful deployment:

1. Test all functionality in production
2. Monitor logs for errors
3. Set up uptime monitoring (e.g., UptimeRobot)
4. Configure custom domains if needed
5. Set up CI/CD for automatic deployments
