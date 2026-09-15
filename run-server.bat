@echo off
title Adventurous Nobel Dev Server

echo ==============================================
echo Starting Adventurous Nobel Development Server
echo ==============================================

echo.
echo [1/2] Checking for existing server on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr "LISTENING" ^| findstr ":3000"') do (
    echo Found process %%a on port 3000. Terminating...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [2/2] Starting Next.js server...
call npm run dev

pause
