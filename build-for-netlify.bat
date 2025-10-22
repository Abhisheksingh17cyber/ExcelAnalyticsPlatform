@echo off
cls
echo ================================================
echo   BUILDING APP FOR NETLIFY
echo ================================================
echo.
echo This will create the build folder for deployment...
echo.

cd frontend

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo Error installing dependencies!
    echo Trying with --legacy-peer-deps...
    call npm install --legacy-peer-deps
)

echo.
echo Step 2: Building the app...
set CI=false
set GENERATE_SOURCEMAP=false
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED!
    echo.
    echo Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ BUILD SUCCESSFUL!
echo ================================================
echo.
echo Your build folder is ready at:
echo   %CD%\build
echo.
echo 🎯 NEXT STEPS - Choose one:
echo.
echo METHOD 1 (EASIEST):
echo   1. Go to: https://app.netlify.com/drop
echo   2. Drag the 'frontend\build' folder onto the page
echo   3. Get your public link instantly!
echo.
echo METHOD 2 (CLI):
echo   1. Run: get-public-link.bat
echo   2. Choose option 2 for Netlify
echo   3. Follow the prompts
echo.
echo ================================================
echo.
pause
