@echo off
SET NODE_PATH="C:\Program Files\nodejs"

echo 🔍 Checking for Node.js at %NODE_PATH%...

IF EXIST %NODE_PATH%\node.exe (
    echo ✅ Found Node.js
    
    REM Add Node.js to PATH for this session so subprocesses (like post-install scripts) work
    SET PATH=%NODE_PATH%;%PATH%

    echo 📦 Installing dependencies...
    call npm install
    
    echo 🗄️ Setting up SQLite Database...
    call npx prisma db push
    
    echo 🚀 Running ValueOS Demo...
    call npx ts-node scripts/demo_flow.ts
    
) ELSE (
    echo ❌ Node.js not found at default location. Please restart your editor/terminal to fix PATH.
)
pause
