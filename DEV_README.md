# Authenticity Validator

A full-stack certificate authenticity validation system built with Django (Backend) and React (Frontend).

## 🚀 Quick Start

### Option 1: One-Command Startup (Recommended)

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```batch
start.bat
```

**Using npm:**
```bash
npm start          # Linux/Mac
npm run start:windows  # Windows
```

### Option 2: Manual Setup

1. **Initial Setup (run once on new machines):**
   ```bash
   npm run setup
   # or manually:
   git update-index --skip-worktree backend/db.sqlite3
   git update-index --skip-worktree backend/qr.png
   ```

2. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start Servers:**
   ```bash
   # Terminal 1 - Backend
   npm run backend
   
   # Terminal 2 - Frontend  
   npm run frontend
   ```

## 📋 What the startup script does:

1. **Git Configuration**: Sets up `--skip-worktree` for `db.sqlite3` and `qr.png` files
2. **Dependency Management**: Installs Python and Node.js dependencies if needed
3. **Server Startup**: Starts both Django backend (port 8000) and React frontend (port 5173)
4. **Process Management**: Handles cleanup when you stop the script

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## 📁 Project Structure

```
Authenticity-Validator/
├── backend/           # Django backend
│   ├── db.sqlite3     # Database (ignored locally after setup)
│   ├── qr.png         # QR code file (ignored locally after setup)
│   └── manage.py
├── frontend/          # React frontend
│   ├── src/
│   └── package.json
├── start.sh           # Linux/Mac startup script
├── start.bat          # Windows startup script
└── package.json       # Root package.json with npm scripts
```

## 🛠️ Manual Commands

```bash
# Setup git ignore for database files
git update-index --skip-worktree backend/db.sqlite3
git update-index --skip-worktree backend/qr.png

# Undo git ignore (if needed)
git update-index --no-skip-worktree backend/db.sqlite3
git update-index --no-skip-worktree backend/qr.png

# Check which files are being ignored
git ls-files -v | grep "^S"
```

## 🐛 Troubleshooting

- **Port already in use**: Kill existing processes or change ports in the startup script
- **Python virtual environment issues**: Delete `backend/venv` folder and restart
- **Node modules issues**: Delete `frontend/node_modules` and run `npm install`
- **Database issues**: The `db.sqlite3` will be ignored locally but kept in repo for new clones

## 🔧 Development

The startup script automatically handles:
- Python virtual environment creation and activation
- Package installation and updates
- Both server startup with proper logging
- Graceful shutdown on Ctrl+C

Happy coding! 🎉