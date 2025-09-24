@echo off
echo.
echo ========================================
echo Excel Analytics Platform - Status Check
echo ========================================
echo.

echo Checking project structure...
echo.

echo [Backend]
if exist "backend\package.json" (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
)

if exist "backend\server.js" (
    echo ✅ Backend server.js found
) else (
    echo ❌ Backend server.js missing
)

if exist "backend\.env" (
    echo ✅ Backend .env file found
) else (
    echo ⚠️  Backend .env file missing - create one with MongoDB URI and JWT secret
)

echo.
echo [Frontend]
if exist "frontend\package.json" (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
)

if exist "frontend\src\App.js" (
    echo ✅ Frontend App.js found
) else (
    echo ❌ Frontend App.js missing
)

if exist "frontend\tailwind.config.js" (
    echo ✅ Tailwind config found
) else (
    echo ❌ Tailwind config missing
)

echo.
echo [Dependencies Check]
cd backend
if exist "node_modules" (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Backend dependencies missing - run: cd backend && npm install
)

cd ..\frontend
if exist "node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies missing - run: cd frontend && npm install --legacy-peer-deps
)

cd ..

echo.
echo [Components Check]
if exist "frontend\src\components\Navbar.js" (
    echo ✅ Components copied successfully
) else (
    echo ❌ Components missing
)

if exist "frontend\src\contexts\AuthContext.js" (
    echo ✅ Contexts copied successfully
) else (
    echo ❌ Contexts missing
)

if exist "frontend\src\pages\Dashboard.js" (
    echo ✅ Pages copied successfully
) else (
    echo ❌ Pages missing
)

echo.
echo ========================================
echo Status check complete!
echo ========================================
echo.
echo To start the platform:
echo 1. Ensure MongoDB is running
echo 2. Run: start-servers.bat
echo 3. Open: http://localhost:3000
echo.
pause