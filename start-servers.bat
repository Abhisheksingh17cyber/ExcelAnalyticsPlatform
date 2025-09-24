@echo off
echo Starting Excel Analytics Platform...
echo.

echo Starting MongoDB (make sure MongoDB is running)...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to continue...
pause >nul