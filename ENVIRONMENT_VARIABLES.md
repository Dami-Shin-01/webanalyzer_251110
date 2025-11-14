# Environment Variables Documentation

This document describes all environment variables used in the Project Snapshot application.

## Frontend Environment Variables

### REACT_APP_API_URL

**Required**: Yes  
**Type**: String (URL)  
**Default**: `http://localhost:5000`  
**Description**: The base URL of the backend API server.

**Development Example**:
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Production Example**:
```bash
REACT_APP_API_URL=https://project-snapshot-backend.railway.app
```

**Notes**:
- Must include protocol (http:// or https://)
- Should NOT include trailing slash
- In production, must use HTTPS
- This variable is embedded at build time, so changes require rebuild

---

## Backend Environment Variables

### PORT

**Required**: No  
**Type**: Number  
**Default**: `5000`  
**Description**: The port number on which the server will listen.

**Development Example**:
```bash
PORT=5000
```

**Production Example**:
```bash
PORT=10000
```

**Notes**:
- Railway and Render automatically set this variable
- Use default for local development
- Must be between 1024-65535 for non-root users

---

### NODE_ENV

**Required**: No  
**Type**: String  
**Default**: `development`  
**Allowed Values**: `development`, `production`, `test`  
**Description**: Specifies the environment in which the application is running.

**Development Example**:
```bash
NODE_ENV=development
```

**Production Example**:
```bash
NODE_ENV=production
```

**Effects**:
- `production`: Enables compression, production logging, optimizations
- `development`: Enables detailed logging, hot reload support
- `test`: Used for running tests

**Notes**:
- Automatically set by most hosting platforms
- Affects logging format (morgan middleware)
- Affects error message verbosity

---

### FRONTEND_URL

**Required**: Yes (Production)  
**Type**: String (URL)  
**Default**: `http://localhost:3000`  
**Description**: The URL of the frontend application, used for CORS configuration.

**Development Example**:
```bash
FRONTEND_URL=http://localhost:3000
```

**Production Example**:
```bash
FRONTEND_URL=https://project-snapshot.vercel.app
```

**Notes**:
- Must match the exact origin of frontend requests
- Must include protocol (http:// or https://)
- Should NOT include trailing slash
- In production, must use HTTPS
- Critical for CORS to work correctly

---

### TIMEOUT

**Required**: No  
**Type**: Number (milliseconds)  
**Default**: `30000` (30 seconds)  
**Description**: Maximum time allowed for analysis operations.

**Development Example**:
```bash
TIMEOUT=30000
```

**Production Example**:
```bash
TIMEOUT=45000
```

**Notes**:
- Applies to HTTP requests and Puppeteer operations
- Increase for slower target websites
- Too high values may cause resource issues
- Recommended range: 15000-60000 (15-60 seconds)

---

## Setting Environment Variables

### Local Development

Create `.env` files in respective directories:

**Frontend (.env)**:
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env)**:
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
TIMEOUT=30000
```

### Vercel (Frontend)

#### Via Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `REACT_APP_API_URL` with production backend URL
3. Select "Production" environment
4. Save and redeploy

#### Via CLI:
```bash
vercel env add REACT_APP_API_URL production
# Enter value when prompted
```

### Railway (Backend)

#### Via Dashboard:
1. Go to your project → Variables tab
2. Click "New Variable"
3. Add each variable:
   - `FRONTEND_URL`: Your Vercel URL
   - `TIMEOUT`: 30000
   - `NODE_ENV`: production (usually auto-set)
4. Deploy

#### Via CLI:
```bash
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
railway variables set TIMEOUT=30000
```

### Render (Backend)

#### Via Dashboard:
1. Go to your service → Environment tab
2. Add environment variables:
   - `FRONTEND_URL`: Your Vercel URL
   - `TIMEOUT`: 30000
   - `NODE_ENV`: production
   - `PORT`: 10000 (or leave for auto-assignment)
3. Save and redeploy

---

## Environment Variable Validation

The application validates environment variables on startup:

### Backend Validation

```javascript
// Automatic validation in server.js
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const TIMEOUT = parseInt(process.env.TIMEOUT) || 30000;
```

### Frontend Validation

```javascript
// Automatic validation in api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## Troubleshooting

### Frontend can't connect to backend

**Problem**: CORS errors or connection refused

**Check**:
1. `REACT_APP_API_URL` is set correctly in frontend
2. `FRONTEND_URL` is set correctly in backend
3. Both URLs use same protocol (http or https)
4. No trailing slashes in URLs
5. Frontend was rebuilt after changing `REACT_APP_API_URL`

**Solution**:
```bash
# Frontend
cd frontend
# Update .env with correct REACT_APP_API_URL
npm run build  # Rebuild to apply changes

# Backend
# Update FRONTEND_URL in hosting platform
# Redeploy backend
```

### Environment variables not loading

**Problem**: Application uses default values instead of .env values

**Check**:
1. `.env` file exists in correct directory
2. `.env` file is not in `.gitignore` (it should be!)
3. Variable names are correct (case-sensitive)
4. No spaces around `=` sign
5. No quotes around values (unless value contains spaces)

**Solution**:
```bash
# Correct format
PORT=5000
FRONTEND_URL=http://localhost:3000

# Incorrect formats
PORT = 5000  # No spaces
PORT="5000"  # No quotes for numbers
```

### Changes not taking effect

**Problem**: Updated environment variables but no change

**Frontend**:
- Environment variables are embedded at build time
- Must rebuild: `npm run build`
- Restart dev server: `npm start`

**Backend**:
- Restart server to load new values
- In production, redeploy the service

---

## Security Best Practices

### DO:
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use different values for development and production
- ✅ Use HTTPS URLs in production
- ✅ Validate environment variables on startup
- ✅ Document all required variables
- ✅ Use `.env.example` as template

### DON'T:
- ❌ Commit `.env` files to Git
- ❌ Share production credentials
- ❌ Use production URLs in development
- ❌ Hardcode sensitive values in code
- ❌ Use wildcard (*) for CORS origin
- ❌ Expose internal URLs publicly

---

## Environment Variable Checklist

Before deploying to production:

- [ ] All required variables documented
- [ ] `.env.example` files up to date
- [ ] Production values configured on hosting platforms
- [ ] HTTPS URLs used in production
- [ ] CORS configured with specific origins
- [ ] Timeout values appropriate for use case
- [ ] No sensitive data in Git repository
- [ ] Environment variables validated on startup
- [ ] Deployment documentation includes variable setup
- [ ] Team members know how to access/update variables

---

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
