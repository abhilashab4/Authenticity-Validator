#!/bin/bash

# Authenticity Validator - Development Startup Script
echo "🚀 Starting Authenticity Validator Development Environment..."

# Change to project root
cd "$(dirname "$0")"

# Git setup for database and QR files (ignore local changes but keep in repo)
echo "📝 Setting up git to ignore local changes to database and QR files..."
git update-index --skip-worktree backend/db.sqlite3 2>/dev/null || echo "   - db.sqlite3 already configured or doesn't exist"
git update-index --skip-worktree backend/qr.png 2>/dev/null || echo "   - qr.png already configured or doesn't exist"

# Check if required files exist
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Backend requirements.txt not found!"
    exit 1
fi

if [ ! -f "frontend/package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."

# Backend dependencies
if [ ! -d "backend/venv" ]; then
    echo "   Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

echo "   Installing/updating Python dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
cd ..

# Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "   Installing Node.js dependencies..."
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
fi

# Function to kill background processes on script exit
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🐍 Starting Django backend server..."
cd backend
source venv/bin/activate
python manage.py runserver 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "⚛️  Starting React frontend server..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for servers to start
sleep 3

echo ""
echo "✅ Development environment is ready!"
echo "   🐍 Backend:  http://localhost:8000"
echo "   ⚛️  Frontend: http://localhost:5173"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep script running and show live logs
tail -f backend.log frontend.log 2>/dev/null