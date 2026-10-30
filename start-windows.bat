@echo off
cd /d "%~dp0"
where node >nul 2>&1 || (echo Node.js is required. & pause & exit /b 1)
call npm install
if errorlevel 1 (pause & exit /b 1)
call npm run dev
pause
