@echo off
title LumiLore Mission Control Launcher
setlocal

echo ==============================================================================
echo                LUMILORE AGENCY FLEET - MISSION CONTROL LAUNCHER
echo ==============================================================================
echo.

:: 1. Verify Node.js availability
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js v18+ from https://nodejs.org and re-run this launcher.
    echo.
    pause
    exit /b 1
)

:: 2. Display Node version
for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [OK] Detected Node.js: %NODE_VERSION%

:: 3. Change to project directory
cd /d "%~dp0"
echo [OK] Workspace Directory: %CD%

:: 4. Start Mission Control Server in background window
echo.
echo [STARTING] Launching Mission Control Engine on http://localhost:3030 ...
start "LumiLore Mission Control Engine" /min node agents/agency-fleet/mission-control/server.mjs

:: 5. Wait for server to bind port
timeout /t 2 /nobreak >nul

:: 6. Launch default browser
echo [BROWSER] Opening Mission Control Studio in your default browser...
start http://localhost:3030

echo.
echo ==============================================================================
echo    MISSION CONTROL ACTIVE: http://localhost:3030
echo    To stop the server, close the minimized "LumiLore Mission Control Engine"
echo    command window or run: taskkill /FI "WINDOWTITLE eq LumiLore Mission Control Engine*"
echo ==============================================================================
echo.
timeout /t 5 >nul
exit /b 0

