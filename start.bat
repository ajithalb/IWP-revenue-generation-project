@echo off
TITLE Sasti Boutique - Localhost Launcher
COLOR 0D

echo =====================================================================
echo           SASSTI BOUTIQUE - LOCAL LAUNCHER (WINDOWS)
echo       Ethnic Wear, Makeup Essentials & Bridal Makeup Booking
echo =====================================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/ (v18 or newer recommended).
    pause
    exit /b 1
)

echo [1/3] Checking environment & database...
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy backend\.env.example backend\.env >nul
)

if not exist "backend\database\sasti_boutique.db" (
    echo Seeding SQLite database with initial boutique collections...
    cd backend && npm run seed && cd ..
)

echo [2/3] Starting Sasti Boutique Backend on port 5001...
start "Sasti Boutique Backend Server (Port 5001)" cmd /k "cd backend && npm start"

:: Give backend 2 seconds to initialize
timeout /t 2 /nobreak >nul

echo [3/3] Starting Sasti Boutique Frontend on port 5173...
start "Sasti Boutique Frontend App (Port 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo =====================================================================
echo   SUCCESS! Sasti Boutique is now running locally:
echo   - Storefront Website: http://localhost:5173
echo   - Backend REST API:   http://localhost:5001/api
echo   - Admin Login:        http://localhost:5173 (click Owner Portal)
echo   - Default Admin:      admin / Admin@Sasti2026
echo   - Direct Support:     7904871123 / nisanth08.connect@gamil.com
echo =====================================================================
echo.
echo Opening website in your default browser...
start http://localhost:5173

pause
