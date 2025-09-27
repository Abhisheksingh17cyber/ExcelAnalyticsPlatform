@echo off
cls
echo =============================================
echo      Excel Analytics - Issue Diagnosis
echo =============================================
echo.

cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"

echo [DIAGNOSIS 1] Checking System Requirements...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found or not in PATH
) else (
    echo ✅ Node.js found:
    node --version
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found
) else (
    echo ✅ npm found:
    npm --version
)

mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB not found in PATH (might be installed but not in PATH)
) else (
    echo ✅ MongoDB found:
    mongod --version | findstr "db version"
)

echo.
echo [DIAGNOSIS 2] Checking Project Structure...
if exist "backend" (
    echo ✅ Backend directory exists
    if exist "backend\package.json" (
        echo ✅ Backend package.json exists
    ) else (
        echo ❌ Backend package.json missing
    )
    if exist "backend\server.js" (
        echo ✅ Backend server.js exists
    ) else (
        echo ❌ Backend server.js missing
    )
    if exist "backend\.env" (
        echo ✅ Backend .env exists
    ) else (
        echo ❌ Backend .env missing
    )
) else (
    echo ❌ Backend directory missing
)

if exist "frontend" (
    echo ✅ Frontend directory exists
    if exist "frontend\package.json" (
        echo ✅ Frontend package.json exists
    ) else (
        echo ❌ Frontend package.json missing
    )
    if exist "frontend\src\App.js" (
        echo ✅ Frontend App.js exists
    ) else (
        echo ❌ Frontend App.js missing
    )
) else (
    echo ❌ Frontend directory missing
)

echo.
echo [DIAGNOSIS 3] Checking Dependencies...
if exist "backend\node_modules" (
    echo ✅ Backend node_modules exists
    cd backend
    echo Backend dependency status:
    npm list --depth=0 2>nul | findstr "express mongoose cors"
    cd ..
) else (
    echo ❌ Backend node_modules missing - run: cd backend && npm install
)

if exist "frontend\node_modules" (
    echo ✅ Frontend node_modules exists
    cd frontend
    echo Frontend dependency status:
    npm list --depth=0 2>nul | findstr "react react-dom react-router-dom"
    cd ..
) else (
    echo ❌ Frontend node_modules missing - run: cd frontend && npm install --legacy-peer-deps
)

echo.
echo [DIAGNOSIS 4] Testing MongoDB Connection...
echo Testing MongoDB connection on localhost:27017...
powershell -Command "try { $tcp = New-Object System.Net.Sockets.TcpClient('localhost', 27017); $tcp.Close(); echo '✅ MongoDB is running on port 27017' } catch { echo '❌ MongoDB is not running on port 27017' }"

echo.
echo [DIAGNOSIS 5] Port Availability...
echo Checking if required ports are available...
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is in use (might be React dev server)
) else (
    echo ✅ Port 3000 is available
)

netstat -an | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is in use (might be backend server)
) else (
    echo ✅ Port 5000 is available
)

echo.
echo [DIAGNOSIS 6] Environment Variables...
cd backend
if exist ".env" (
    echo ✅ Backend .env file exists
    echo Environment variables:
    findstr /V "JWT_SECRET" .env
    findstr /C:"JWT_SECRET" .env >nul && echo JWT_SECRET=***hidden***
) else (
    echo ❌ Backend .env file missing
)
cd ..

cd frontend
if exist ".env" (
    echo ✅ Frontend .env file exists
    echo Environment variables:
    type .env
) else (
    echo ❌ Frontend .env file missing
)
cd ..

echo.
echo =============================================
echo            DIAGNOSIS COMPLETE
echo =============================================
echo.
echo Based on the diagnosis above:
echo.
echo If you see any ❌ errors:
echo   1. Run: fix-all-errors.bat
echo   2. Or manually fix the reported issues
echo.
echo If everything shows ✅:
echo   1. Start MongoDB: mongod
echo   2. Run: start-servers.bat
echo   3. Visit: http://localhost:3000
echo.
pause