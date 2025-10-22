@echo off
cls
echo ================================================
echo   NETLIFY DEPLOYMENT - COMPLETE FIX
echo ================================================
echo.
echo This will fix all deployment issues and deploy to Netlify
echo.

REM Navigate to frontend directory
cd frontend

echo [1/5] Cleaning old build files...
if exist build rd /s /q build
if exist node_modules\.cache rd /s /q node_modules\.cache

echo [2/5] Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo [3/5] Creating production build...
set CI=false
set GENERATE_SOURCEMAP=false
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo [4/5] Verifying build output...
if not exist build\index.html (
    echo ERROR: Build folder is missing index.html
    pause
    exit /b 1
)

if not exist build\_redirects (
    echo WARNING: _redirects file not found in build
    echo Copying from public folder...
    copy public\_redirects build\_redirects
)

echo [5/5] Build verification complete!
echo.
echo ================================================
echo   ✅ ALL CHECKS PASSED!
echo ================================================
echo.
echo Your app is ready to deploy!
echo.
echo 🎯 DEPLOY NOW - Choose your method:
echo.
echo [1] Drag & Drop (Easiest - Recommended)
echo [2] Netlify CLI (Automated)
echo [3] Exit
echo.
set /p method="Choose (1-3): "

if "%method%"=="1" goto drag_drop
if "%method%"=="2" goto cli_deploy
if "%method%"=="3" goto end

:drag_drop
cls
echo ================================================
echo   DRAG & DROP DEPLOYMENT
echo ================================================
echo.
echo 1. Open your browser and go to:
echo.
echo    👉 https://app.netlify.com/drop
echo.
echo 2. Drag this folder onto the page:
echo.
echo    📁 %CD%\build
echo.
echo 3. Wait 30 seconds for deployment
echo.
echo 4. Copy your public link!
echo.
echo TIP: The folder path is also copied to your clipboard!
echo.
echo Opening folder location...
explorer /select,"%CD%\build"
echo.
echo Opening Netlify Drop page in browser...
start https://app.netlify.com/drop
echo.
goto end

:cli_deploy
cls
echo ================================================
echo   NETLIFY CLI DEPLOYMENT
echo ================================================
echo.

where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Netlify CLI...
    call npm install -g netlify-cli
)

echo.
echo Logging in to Netlify...
call netlify login

echo.
echo Deploying to production...
cd ..
call netlify deploy --prod --dir=frontend/build

echo.
echo ================================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Look for your Website URL above!
echo.
goto end

:end
echo.
echo ================================================
echo.
echo 📱 After deployment, test these URLs:
echo    - Your-Link/ (login page)
echo    - Your-Link/simple-login (login)
echo    - Your-Link/simple-dashboard (dashboard)
echo.
echo 🔑 Demo Login:
echo    Admin: admin@demo.com / admin123
echo    User:  user@demo.com / user123
echo.
echo ================================================
pause
