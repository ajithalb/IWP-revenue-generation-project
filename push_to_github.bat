@echo off
TITLE Sasti Boutique - Push to GitHub
COLOR 0A

echo =====================================================================
echo    PUSHING SASTI BOUTIQUE TO GITHUB (MAIN BRANCH)
echo    Repository: https://github.com/ajithalb/IWP-revenue-generation-project
echo =====================================================================
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =====================================================================
    echo   [SUCCESS] All files and render.yaml are now on GitHub main branch!
    echo.
    echo   Next step:
    echo   1. Open your Render Dashboard at https://dashboard.render.com
    echo   2. Go to your Blueprints / Web Service for this repo
    echo   3. Click "Apply Blueprint" or "Manual Deploy" -> "Deploy latest commit"
    echo   4. Render will now detect render.yaml and deploy automatically!
    echo =====================================================================
) else (
    echo.
    echo [NOTE] If you were prompted for GitHub credentials, please complete
    echo the sign-in in your browser window and run this script again.
)

echo.
pause
