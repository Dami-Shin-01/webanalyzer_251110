@echo off
REM Project Snapshot - Development Startup Script (Windows)
REM This script starts both frontend and backend in development mode

echo 🚀 Starting Project Snapshot Development Environment
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Copying from .env.example...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env - Please update if needed
)

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Copying from .env.example...
    copy frontend\.env.example frontend\.env
    echo ✅ Created frontend\.env - Please update if needed
)

echo.
echo 📦 Installing dependencies...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Dependencies installed
echo.
echo 🎯 Starting servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in new window
start "Project Snapshot Backend" cmd /k "cd backend && npm run dev"

REM Start frontend in new window
start "Project Snapshot Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servers started in separate windows
echo Close the command windows to stop the servers
pause
