@echo off
SET NODE_PATH="C:\Program Files\nodejs"

IF EXIST %NODE_PATH%\node.exe (
    SET PATH=%NODE_PATH%;%PATH%
    echo 📦 Installing Frontend Dependencies...
    call npm install
    
    echo 🚀 Starting Frontend Dev Server...
    call npm run dev
) ELSE (
    echo ❌ Node.js not found.
)
