# =====================================================================
# Sasti Boutique - One-Click Git Push to GitHub main branch
# =====================================================================

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "   PUSHING SASTI BOUTIQUE TO GITHUB (MAIN BRANCH)" -ForegroundColor Green
Write-Host "   Repository: https://github.com/ajithalb/IWP-revenue-generation-project" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  [SUCCESS] All files and render.yaml are now on GitHub main branch!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Next steps for Render.com:" -ForegroundColor Yellow
    Write-Host "  1. Open your Render Dashboard at https://dashboard.render.com" -ForegroundColor White
    Write-Host "  2. Go to your Blueprint or Web Service" -ForegroundColor White
    Write-Host "  3. Click 'Apply Blueprint' or 'Deploy latest commit'" -ForegroundColor White
    Write-Host "  4. Render will now build and launch your public HTTPS URL!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[NOTE] If you were prompted for GitHub credentials, please complete" -ForegroundColor Yellow
    Write-Host "the browser authorization window and re-run this command." -ForegroundColor Yellow
}

Write-Host ""
pause
