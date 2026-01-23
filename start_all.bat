@echo off
SET NODE_PATH="C:\Program Files\nodejs"
SET PATH=%NODE_PATH%;%PATH%

echo 🚀 Starting Value OS Stack...

start "ValueOS Backend" cmd /k "cd backend && npm run dev"
start "ValueOS Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Services Launched!
echo    - Backend: http://localhost:3000
echo    - Frontend: http://localhost:5173
pause
