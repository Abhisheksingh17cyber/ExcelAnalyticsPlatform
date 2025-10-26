@echo off
cls
echo.
echo ===============================================
echo    EXCEL ANALYTICS PLATFORM - TEAM DEMO
echo ===============================================
echo.
echo Preparing network-accessible server...
echo.

cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"

echo Checking dependencies...
npm install express --silent

echo.
echo Building latest version...
cd frontend
call npm run build --silent
cd ..

echo.
echo ===============================================
echo     SERVER IS STARTING - TEAM ACCESS READY!
echo ===============================================
echo.
echo SHARE THIS WITH YOUR TEAM:
echo Network URL: http://192.168.29.230:8080/simple-login
echo.
echo LOGIN CREDENTIALS:
echo Admin: admin@demo.com / admin123
echo User:  user@demo.com / user123
echo.
echo ===============================================
echo    Press Ctrl+C to stop the server
echo ===============================================
echo.

node serve-network.js

pause