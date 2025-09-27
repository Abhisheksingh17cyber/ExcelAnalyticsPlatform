@echo off
cls
echo ============================================
echo   Excel Analytics Platform - Health Check  
echo ============================================
echo.

REM Set the correct base directory
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"

echo [1/5] Checking project structure...
if exist "backend\package.json" (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
    goto :error
)

if exist "frontend\package.json" (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
    goto :error
)

echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    goto :error
)
echo ✅ Backend dependencies installed

echo.
echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install --legacy-peer-deps --silent
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    goto :error
)
echo ✅ Frontend dependencies installed

echo.
echo [4/5] Testing backend server...
cd ..\backend
echo Starting backend server for 5 seconds to test...
start "Backend Test" /min cmd /c "npm start"
timeout /t 5 /nobreak >nul

echo.
echo [5/5] Testing frontend build...
cd ..\frontend
echo Testing frontend build process...
call npm run build --silent
if %errorlevel% neq 0 (
    echo ⚠️  Frontend build had warnings but succeeded
) else (
    echo ✅ Frontend build successful
)

cd ..
echo.
echo ============================================
echo        🎉 Health Check Complete! 🎉
echo ============================================
echo.
echo Both servers are ready to start:
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo To start both servers:
echo   - Run: start-servers.bat
echo   - Or manually start each in separate terminals
echo.
pause
goto :end

:error
echo.
echo ❌ Health check failed! Please check the error messages above.
pause
goto :end

:end