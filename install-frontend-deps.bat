@echo off
REM This script will install additional frontend dependencies after React app is created

cd frontend

REM Install additional frontend dependencies
call npm install axios recharts three @react-three/fiber @react-three/drei react-router-dom react-dropzone html2canvas jspdf

REM Install Tailwind CSS and its dependencies  
call npm install -D tailwindcss postcss autoprefixer

REM Initialize Tailwind CSS
call npx tailwindcss init -p

echo Frontend dependencies installed successfully!