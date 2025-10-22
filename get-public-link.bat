1@echo off
cls
echo =====================================================
echo   EXCEL ANALYTICS - GET PUBLIC LINK
echo =====================================================
echo.
echo This will deploy your app and give you a public link!
echo.
echo Choose your deployment option:
echo.
echo [1] Deploy to Vercel (Recommended - FREE)
echo [2] Deploy to Netlify (Alternative - FREE)
echo [3] Get Network IP for local testing
echo [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto network
if "%choice%"=="4" goto end

:vercel
echo.
echo ================================================
echo   DEPLOYING TO VERCEL
echo ================================================
echo.
echo Step 1: Checking if Vercel CLI is installed...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

echo.
echo Step 2: Building your app...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors.
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Vercel...
echo.
echo Please login when prompted and follow the instructions.
echo.
call vercel --prod

echo.
echo ================================================
echo   DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Your app is now live at the URL shown above!
echo Share that link with anyone to showcase your project.
echo.
goto end

:netlify
echo.
echo ================================================
echo   DEPLOYING TO NETLIFY
echo ================================================
echo.
echo Step 1: Checking if Netlify CLI is installed...
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Netlify CLI...
    call npm install -g netlify-cli
    echo.
    echo Netlify CLI installed successfully!
)

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Dependency installation failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 3: Building your app...
set CI=false
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors above.
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 4: Deploying to Netlify...
echo.
echo IMPORTANT: When prompted:
echo   1. Authorize with your GitHub/GitLab account or email
echo   2. Choose "Create & configure a new site"
echo   3. Team: Choose your team (or default)
echo   4. Site name: excel-analytics-platform (or your preferred name)
echo   5. Build directory will be automatically set to: frontend/build
echo.
echo Press any key when ready to deploy...
pause >nul

cd ..
call netlify deploy --prod

echo.
echo ================================================
echo   DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Your app is now live! Look for the "Website URL" above.
echo It should look like: https://excel-analytics-platform.netlify.app
echo.
echo Share that link to showcase your project!
echo.
echo Login credentials for demo:
echo   Admin: admin@demo.com / admin123
echo   User:  user@demo.com / user123
echo.
goto end

:network
echo.
echo ================================================
echo   NETWORK ACCESS SETUP
echo ================================================
echo.
echo Getting your computer's IP address...
echo.

REM Get IPv4 address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /r "IPv4"') do (
    set IP=%%a
    goto :gotip
)
:gotip
set IP=%IP:~1%

echo Your computer's IP address is: %IP%
echo.
echo ================================================
echo   ACCESS YOUR APP FROM OTHER DEVICES
echo ================================================
echo.
echo 1. Make sure all devices are on the SAME WiFi network
echo.
echo 2. On your phone or other laptop, open a browser and go to:
echo.
echo    http://%IP%:3000/simple-login
echo.
echo 3. Use these demo credentials:
echo    Admin: admin@demo.com / admin123
echo    User:  user@demo.com / user123
echo.
echo ================================================
echo.
echo Press any key to start the server with network access...
pause >nul

cd frontend
set HOST=0.0.0.0
echo.
echo Starting server on all network interfaces...
echo Access from this computer: http://localhost:3000/simple-login
echo Access from other devices: http://%IP%:3000/simple-login
echo.
npm start

goto end

:end
echo.
echo Press any key to exit...
pause >nul
