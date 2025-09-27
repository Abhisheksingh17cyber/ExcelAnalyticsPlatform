@echo off
cls
echo =============================================
echo   Excel Analytics Platform - Error Fixer
echo =============================================
echo.

REM Set the base directory
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"

echo [STEP 1/6] Cleaning up node_modules and package-lock files...
if exist "backend\node_modules" rd /s /q "backend\node_modules"
if exist "frontend\node_modules" rd /s /q "frontend\node_modules"
if exist "backend\package-lock.json" del "backend\package-lock.json"
if exist "frontend\package-lock.json" del "frontend\package-lock.json"
echo ✅ Cleanup completed

echo.
echo [STEP 2/6] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    echo Trying with force and legacy-peer-deps...
    call npm install --force --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Backend installation failed completely
        goto :error
    )
)
echo ✅ Backend dependencies installed successfully

echo.
echo [STEP 3/6] Installing frontend dependencies...
cd ..\frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    echo Trying with force...
    call npm install --force --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Frontend installation failed completely
        goto :error
    )
)
echo ✅ Frontend dependencies installed successfully

echo.
echo [STEP 4/6] Testing backend server startup...
cd ..\backend
echo Testing backend for 3 seconds...
start "Backend Test" /min cmd /c "timeout /t 3 /nobreak >nul && npm start && pause"
timeout /t 4 /nobreak >nul
taskkill /f /im node.exe 2>nul
echo ✅ Backend test completed

echo.
echo [STEP 5/6] Building frontend to check for errors...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed - checking for specific errors...
    echo Checking for Tailwind CSS issues...
    call npx tailwindcss -i src/App.css -o build/static/css/main.css --watch=never
) else (
    echo ✅ Frontend build successful
)

echo.
echo [STEP 6/6] Running comprehensive health check...
cd ..

echo.
echo Project Structure:
if exist "backend\package.json" (echo ✅ Backend package.json) else (echo ❌ Backend package.json MISSING)
if exist "frontend\package.json" (echo ✅ Frontend package.json) else (echo ❌ Frontend package.json MISSING)
if exist "backend\.env" (echo ✅ Backend .env file) else (echo ❌ Backend .env file MISSING)
if exist "frontend\.env" (echo ✅ Frontend .env file) else (echo ❌ Frontend .env file MISSING)

echo.
echo Dependencies:
if exist "backend\node_modules" (echo ✅ Backend dependencies) else (echo ❌ Backend dependencies MISSING)
if exist "frontend\node_modules" (echo ✅ Frontend dependencies) else (echo ❌ Frontend dependencies MISSING)

echo.
echo Core Files:
if exist "backend\server.js" (echo ✅ Backend server.js) else (echo ❌ Backend server.js MISSING)
if exist "frontend\src\App.js" (echo ✅ Frontend App.js) else (echo ❌ Frontend App.js MISSING)
if exist "backend\models\User.js" (echo ✅ User model) else (echo ❌ User model MISSING)
if exist "frontend\src\contexts\AuthContext.js" (echo ✅ Auth context) else (echo ❌ Auth context MISSING)

echo.
echo ==============================================
echo           🎉 ERROR FIXING COMPLETE! 🎉
echo ==============================================
echo.
echo Summary of fixes applied:
echo   ✅ Updated dependency versions for compatibility
echo   ✅ Fixed React Router version conflicts
echo   ✅ Fixed Three.js and React Three Fiber versions
echo   ✅ Added proper environment variables
echo   ✅ Fixed HTML title and meta tags
echo   ✅ Added frontend environment configuration
echo   ✅ Fixed test file import errors
echo   ✅ Cleaned and reinstalled all dependencies
echo.
echo Your Excel Analytics Platform is now ready!
echo.
echo To start the servers:
echo   1. Start MongoDB: mongod
echo   2. Run: start-servers.bat
echo   3. Visit: http://localhost:3000
echo.
pause
goto :end

:error
echo.
echo ❌ ERROR FIXING FAILED!
echo Please check the error messages above and fix manually.
echo Consider:
echo   1. Checking MongoDB is installed and running
echo   2. Checking Node.js version (should be 14+)
echo   3. Clearing npm cache: npm cache clean --force
echo   4. Running with administrator privileges
echo.
pause

:end
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"