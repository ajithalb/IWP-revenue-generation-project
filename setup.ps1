# =====================================================================
# Sasti Boutique - One-Click Dependency Installer & Seeder (Windows)
# =====================================================================

Write-Host "Installing dependencies for Sasti Boutique..." -ForegroundColor Magenta

$rootPath = $PSScriptRoot
if (-not $rootPath) { $rootPath = Get-Location }

# 1. Root dependencies
Write-Host "`n[1/4] Installing Root Packages..." -ForegroundColor Cyan
npm install

# 2. Backend dependencies
Write-Host "`n[2/4] Installing Backend Packages (Express, SQLite, Bcrypt)..." -ForegroundColor Cyan
Push-Location "$rootPath\backend"
npm install
Pop-Location

# 3. Frontend dependencies
Write-Host "`n[3/4] Installing Frontend Packages (Vite, React, Lucide Icons, Axios)..." -ForegroundColor Cyan
Push-Location "$rootPath\frontend"
npm install
Pop-Location

# 4. Copy .env and seed database
Write-Host "`n[4/4] Setting up Environment & SQLite Database..." -ForegroundColor Cyan
if (-not (Test-Path "$rootPath\backend\.env")) {
    Copy-Item "$rootPath\backend\.env.example" "$rootPath\backend\.env"
}
Push-Location "$rootPath\backend"
npm run seed
Pop-Location

Write-Host "`nSetup complete! You can now launch Sasti Boutique by running: .\start.ps1 or double-clicking start.bat" -ForegroundColor Green
