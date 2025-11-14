# Setup Guide - Project Snapshot

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Start the server
npm start
```

The backend server will run on http://localhost:5000

**Available Endpoints:**
- `GET /health` - Health check endpoint
- `POST /api/analyze` - Website analysis endpoint (Mock data)

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already done)
npm install

# Start development server
npm start
```

The frontend will run on http://localhost:3000

## Testing the Mock API

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T07:33:29.654Z"
}
```

### Analysis Endpoint
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Expected response includes:
- Mock color tokens (HEX, RGB, RGBA)
- Mock font tokens (family, size, weight, lineHeight)
- Mock spacing values
- Mock effects (shadows)
- Mock animations (fadeIn, slideUp)

## Project Structure

```
project-snapshot/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server setup
│   │   └── routes/
│   │       └── analysis.js     # Mock API endpoint
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── README.md
└── SETUP.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
TIMEOUT=30000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Next Steps

Task 1 is complete! The following components are ready:

✅ Backend Express server with CORS
✅ Mock `/api/analyze` endpoint returning sample design tokens
✅ `/health` endpoint for health checks
✅ React frontend with basic structure
✅ Environment configuration for both services

**Next Task:** Implement URL input component and API integration (Task 2)
