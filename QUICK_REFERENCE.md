# Quick Reference Guide

## For Developers

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd project-snapshot

# Backend setup
cd backend
npm install
cp .env.example .env
npm start

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm start
```

### Common Commands

```bash
# Development
npm start              # Start dev server
npm test              # Run tests
npm run build         # Production build

# Testing
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report

# Deployment
vercel deploy         # Deploy frontend
railway up            # Deploy backend
```

### Environment Variables

**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
TIMEOUT=30000
```

### API Endpoints

```bash
# Health check
GET /health

# Analyze website
POST /api/analyze
{
  "url": "https://example.com",
  "options": {
    "includeDynamic": false,
    "timeout": 30000
  }
}
```

### Project Structure

```
project-snapshot/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server
│   │   ├── routes/             # API routes
│   │   ├── analyzers/          # Static/Dynamic analyzers
│   │   ├── parsers/            # CSS parser
│   │   ├── generators/         # Motion report generator
│   │   └── utils/              # Utilities
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main component
│   │   ├── components/         # UI components
│   │   ├── services/           # API service
│   │   └── utils/              # Utilities
│   └── package.json
└── docs/                       # Documentation
```

### Key Files

**Backend:**
- `server.js` - Express server setup
- `analyzers/StaticAnalyzer.js` - CSS analysis
- `analyzers/DynamicAnalyzer.js` - Motion detection
- `parsers/CSSParser.js` - Token extraction
- `utils/ErrorHandler.js` - Error handling

**Frontend:**
- `App.js` - Main application
- `components/DesignStudio.js` - Token mapping
- `utils/starterKitBuilder.js` - File generation
- `services/api.js` - API communication

### Common Tasks

**Add new token type:**
1. Update `CSSParser.js` with extraction logic
2. Update `StaticAnalyzer.js` to include new tokens
3. Update `DesignStudio.js` to display new tokens
4. Update `starterKitBuilder.js` to export new tokens

**Fix CORS issue:**
1. Check `FRONTEND_URL` in backend `.env`
2. Verify CORS configuration in `server.js`
3. Ensure URLs match exactly (no trailing slash)
4. Redeploy backend after changes

**Add new export format:**
1. Add builder function in `starterKitBuilder.js`
2. Update `ExportOptions.js` to include new format
3. Update `DesignStudio.js` to call new builder
4. Add to ZIP generation in `zipGenerator.js`

### Debugging

**Backend:**
```bash
# Enable debug logging
DEBUG=* npm start

# Check logs
tail -f logs/app.log

# Test endpoint
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**Frontend:**
```bash
# React DevTools
# Install browser extension

# Check console
# Open browser DevTools (F12)

# Network tab
# Monitor API calls
```

### Troubleshooting

**Port already in use:**
```bash
# Find process
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS error:**
```bash
# Check environment variables
echo $FRONTEND_URL  # Backend
echo $REACT_APP_API_URL  # Frontend

# Restart servers after changes
```

### Testing

**Run specific test:**
```bash
npm test -- CSSParser.test.js
```

**Update snapshots:**
```bash
npm test -- -u
```

**Coverage report:**
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Deployment

**Frontend (Vercel):**
```bash
vercel login
vercel
vercel --prod
```

**Backend (Railway):**
```bash
railway login
railway init
railway up
```

**Environment variables:**
```bash
# Vercel
vercel env add REACT_APP_API_URL

# Railway
railway variables set FRONTEND_URL=https://...
```

### Performance

**Profile backend:**
```bash
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt
```

**Profile frontend:**
- Chrome DevTools → Performance tab
- Record → Perform actions → Stop
- Analyze flame graph

**Check bundle size:**
```bash
npm run build
ls -lh build/static/js/*.js
```

### Security

**Audit dependencies:**
```bash
npm audit
npm audit fix
```

**Check for secrets:**
```bash
git secrets --scan
```

**Update dependencies:**
```bash
npm update
npm outdated
```

### Documentation

**Generate API docs:**
```bash
# JSDoc
npx jsdoc src -r -d docs

# Or use existing API_DOCUMENTATION.md
```

**Update README:**
```bash
# Edit README.md
# Commit changes
git add README.md
git commit -m "docs: update README"
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

### Useful Links

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Puppeteer Docs](https://pptr.dev)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)

---

## For Users

### Quick Start

1. Open https://your-app.vercel.app
2. Enter website URL
3. Click "분석 시작"
4. Map tokens
5. Export starter kit

### Tips

- Use semantic names: `primary-color` not `blue`
- Enable dynamic analysis for animation-heavy sites
- Check warnings for CORS issues
- Export in multiple formats for flexibility
- Use keyboard navigation: Tab, Enter, Space, Escape, Arrows
- Works on mobile, tablet, and desktop devices
- Supports screen readers and high contrast mode

### Troubleshooting

**Analysis fails:**
- Check if website is accessible
- Try a different website
- Disable dynamic analysis

**No tokens found:**
- Website may use inline styles
- Try a different page
- Check browser console

**Export fails:**
- Allow downloads in browser
- Disable ad blockers
- Try different browser

### Support

- Documentation: See USER_GUIDE.md
- Issues: GitHub Issues
- FAQ: See USER_GUIDE.md#faq

---

## Cheat Sheet

### HTTP Status Codes

- `200` - Success
- `400` - Bad request (invalid URL)
- `429` - Rate limit exceeded
- `500` - Server error

### Error Types

- `validation` - Invalid input
- `network` - Network error
- `timeout` - Request timeout
- `cors` - CORS restriction
- `parsing` - CSS parsing error

### Token Types

- `colors` - HEX, RGB, RGBA, HSL
- `fonts` - family, size, weight, lineHeight
- `spacing` - padding, margin, gap
- `effects` - shadows, filters
- `animations` - @keyframes

### Export Formats

- `CSS` - CSS variables (`:root`)
- `SCSS` - SCSS variables (`$`)
- `JSON` - JSON object

---

**Last Updated**: November 14, 2025
