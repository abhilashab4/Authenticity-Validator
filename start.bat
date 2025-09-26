@echo off
setlocal EnableDelayedExpansion

REM Authenticity Validator - Development Startup Script (Windows)
echo 🚀 Starting Authenticity Validator Development Environment...

REM Change to project root
cd /d "%~dp0"

REM Git setup for database and QR files
echo 📝 Setting up git to ignore local changes to database and QR files...
git update-index --skip-worktree backend/db.sqlite3 2>nul || echo    - db.sqlite3 already configured or doesn't exist
git update-index --skip-worktree backend/qr.png 2>nul || echo    - qr.png already configured or doesn't exist

REM Check if required files exist
if not exist "backend\requirements.txt" (
    echo ❌ Backend requirements.txt not found!
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

REM Install dependencies if needed
echo 📦 Checking dependencies...

REM Backend dependencies
if not exist "backend\venv" (
    echo    Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

echo    Installing/updating Python dependencies...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
cd ..

REM Frontend dependencies
if not exist "frontend\node_modules" (
    echo    Installing Node.js dependencies...
    cd frontend
    npm install >nul 2>&1
    cd ..
)

REM Start backend server
echo 🐍 Starting Django backend server...
cd backend
call venv\Scripts\activate.bat
start "Backend Server" cmd /k "python manage.py runserver 8000"
cd ..

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend server
echo ⚛️ Starting React frontend server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Development environment is ready!
echo    🐍 Backend:  http://localhost:8000
echo    ⚛️ Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul