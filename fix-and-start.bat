@echo off
echo 🔧 Fixing Excel Analytics Platform...

REM Kill any existing Node.js processes
echo Stopping existing servers...
taskkill /F /IM node.exe 2>nul

REM Go to project root
cd /d "C:\Users\abhii\OneDrive\Desktop\ExcelAnalyticsPlatform\ExcelAnalyticsPlatform"

echo 📦 Installing/updating dependencies...

REM Install backend dependencies
cd backend
echo Installing backend dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Backend npm install failed
    pause
    exit /b 1
)

REM Install frontend dependencies
cd ..\frontend
echo Installing frontend dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Frontend npm install failed
    pause
    exit /b 1
)

echo 🎨 Building Tailwind CSS...
call npx tailwindcss -i ./src/App.css -o ./src/output.css --watch &

REM Go back to root
cd ..

echo 🚀 Starting servers...

REM Start MongoDB (if not running)
echo Starting MongoDB...
start /B mongod 2>nul

REM Wait a bit for MongoDB to start
timeout /t 3 /nobreak >nul

REM Start backend server in new window
echo Starting backend server...
start "Excel Analytics - Backend" cmd /k "cd /d backend && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend server in new window  
echo Starting frontend server...
start "Excel Analytics - Frontend" cmd /k "cd /d frontend && npm start"

echo ✅ Both servers are starting...
echo 📱 Frontend will open at: http://localhost:3000
echo 🔧 Backend API at: http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul