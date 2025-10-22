@echo off
setlocal enabledelayedexpansion

echo =====================================
echo Excel Analytics Platform - Network Share Mode
echo =====================================
echo.

REM Get local IP address
echo Detecting your local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    REM Remove leading space
    set "ip=!ip:~1!"
    REM Check if it's a valid local network IP (not 127.0.0.1)
    echo !ip! | findstr /r "^192\.168\. ^10\. ^172\.1[6-9]\. ^172\.2[0-9]\. ^172\.3[0-1]\." >nul
    if !errorlevel! equ 0 (
        set "LOCAL_IP=!ip!"
        goto :found_ip
    )
)

:found_ip
if not defined LOCAL_IP (
    echo Warning: Could not detect local network IP address
    echo Defaulting to localhost
    set LOCAL_IP=localhost
)

echo.
echo =====================================
echo Your Local IP Address: %LOCAL_IP%
echo =====================================
echo.

REM Kill any existing processes on ports 3000 and 5000
echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM Check if MongoDB is running
echo.
echo Checking MongoDB service...
net start | findstr /C:"MongoDB" >nul
if errorlevel 1 (
    echo Warning: MongoDB service not detected
    echo Please make sure MongoDB is running before starting the servers
    echo.
) else (
    echo MongoDB is running ✓
    echo.
)

REM Start backend server
echo Starting Backend Server...
echo =====================================
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm start"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 >nul

REM Start frontend server
echo.
echo Starting Frontend Server...
echo =====================================
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "set HOST=0.0.0.0&& npm start"

echo.
echo =====================================
echo Servers are starting!
echo =====================================
echo.
echo Access on THIS device:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Access from OTHER devices on your network:
echo   Frontend: http://%LOCAL_IP%:3000
echo   Backend:  http://%LOCAL_IP%:5000
echo.
echo =====================================
echo.
echo IMPORTANT NOTES:
echo - Make sure your firewall allows connections on ports 3000 and 5000
echo - All devices must be on the same network
echo - The frontend will automatically connect to the backend
echo.
echo Press any key to exit this script...
echo (The servers will continue running in their own windows)
pause >nul
