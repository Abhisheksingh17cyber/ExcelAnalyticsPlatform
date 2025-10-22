@echo off
echo ========================================
echo Excel Analytics Platform - Network Setup
echo ========================================
echo.

REM Get local IP address
echo Detecting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :ip_found
)

:ip_found
REM Trim leading spaces
for /f "tokens=* delims= " %%a in ("%LOCAL_IP%") do set LOCAL_IP=%%a

if "%LOCAL_IP%"=="" (
    echo ERROR: Could not detect local IP address.
    echo Please check your network connection.
    pause
    exit /b 1
)

echo.
echo Local IP Address detected: %LOCAL_IP%
echo.

REM Set environment variables for network access
set HOST=0.0.0.0
set REACT_APP_API_URL=http://%LOCAL_IP%:5000

echo ========================================
echo Starting Backend Server...
echo Backend will be accessible at: http://%LOCAL_IP%:5000
echo ========================================
echo.
start "Backend Server" cmd /k "cd backend && set HOST=%HOST% && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo ========================================
echo Starting Frontend Server...
echo Frontend will be accessible at: http://%LOCAL_IP%:3000
echo ========================================
echo.
start "Frontend Server" cmd /k "cd frontend && set HOST=0.0.0.0 && set REACT_APP_API_URL=%REACT_APP_API_URL% && npm start"

echo.
echo ========================================
echo SERVERS STARTING...
echo ========================================
echo.
echo Access the application from any device on your network:
echo.
echo   Frontend: http://%LOCAL_IP%:3000
echo   Backend:  http://%LOCAL_IP%:5000
echo.
echo For login page, use: http://%LOCAL_IP%:3000/simple-login
echo.
echo Make sure your firewall allows connections on ports 3000 and 5000
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
