@echo off
echo =====================================
echo Excel Analytics Platform - Starting Development Servers
echo =====================================

REM Kill any existing processes on ports 3000 and 5000
echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul

REM Wait a moment
timeout /t 2 >nul

REM Check if MongoDB is running
echo Checking MongoDB service...
net start | findstr /C:"MongoDB" >nul
if errorlevel 1 (
    echo Warning: MongoDB service not detected
    echo Please make sure MongoDB is running before starting the servers
) else (
    echo MongoDB is running ✓
)

echo.
echo Starting Backend Server (Port 5000)...
echo =====================================
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform\backend"
start "Backend Server" cmd /k "npm start"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 >nul

echo.
echo Starting Frontend Server (Port 3000)...
echo ========================================
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform\frontend"
start "Frontend Server" cmd /k "npm start"

echo.
echo =====================================
echo Both servers are starting!
echo =====================================
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo =====================================
echo.
echo Press any key to exit this script...
echo (The servers will continue running in their own windows)
pause >nul