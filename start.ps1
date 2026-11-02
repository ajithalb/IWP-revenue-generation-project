# =====================================================================
# Sasti Boutique - Windows PowerShell Startup Script
# Starts both Backend (Port 5001) and Frontend (Port 5173) locally
# =====================================================================

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "         SASTI BOUTIQUE - LOCAL LAUNCHER (POWERSHELL)" -ForegroundColor Yellow
Write-Host "    Ethnic Wear, Makeup Essentials & Bridal Makeup Booking" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ""

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please download and install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Exit
}

$rootPath = $PSScriptRoot
if (-not $rootPath) { $rootPath = Get-Location }

# 2. Check Backend .env
$envPath = Join-Path $rootPath "backend\.env"
$envExamplePath = Join-Path $rootPath "backend\.env.example"
if (-not (Test-Path $envPath)) {
    Write-Host "[INFO] Generating backend\.env from template..." -ForegroundColor Cyan
    Copy-Item $envExamplePath $envPath
}

# 3. Check Database Seed
$dbPath = Join-Path $rootPath "backend\database\sasti_boutique.db"
if (-not (Test-Path $dbPath)) {
    Write-Host "[INFO] Initializing SQLite database and seeding collections..." -ForegroundColor Cyan
    Push-Location (Join-Path $rootPath "backend")
    npm run seed
    Pop-Location
}

# 4. Start Backend Server
Write-Host "[1/2] Starting Sasti Boutique Backend on http://localhost:5001..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\backend'; npm start" -PassThru

Start-Sleep -Seconds 2

# 5. Start Frontend Server
Write-Host "[2/2] Starting Sasti Boutique Frontend on http://localhost:5173..." -ForegroundColor Cyan
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; npm run dev" -PassThru

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "  SASTI BOUTIQUE IS NOW RUNNING LOCALLY!" -ForegroundColor Green
Write-Host "  - Customer Storefront: http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend REST API:    http://localhost:5001/api" -ForegroundColor White
Write-Host "  - Health Check:        http://localhost:5001/api/health" -ForegroundColor White
Write-Host "  - Owner Admin Portal:  http://localhost:5173 (Click Owner Portal)" -ForegroundColor Yellow
Write-Host "  - Admin Credentials:   admin / Admin@Sasti2026" -ForegroundColor Yellow
Write-Host "  - Shop Phone:          7904871123" -ForegroundColor Cyan
Write-Host "  - Shop Email:          nisanth08.connect@gamil.com" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Launching http://localhost:5173 in your default browser..." -ForegroundColor Yellow

Start-Process "http://localhost:5173"
