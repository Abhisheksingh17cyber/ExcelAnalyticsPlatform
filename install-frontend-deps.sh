#!/bin/bash
# This script will be run after React app is created to install additional dependencies

cd frontend

# Install additional frontend dependencies
npm install axios recharts three @react-three/fiber @react-three/drei react-router-dom react-dropzone html2canvas jspdf

# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p

echo "Frontend dependencies installed successfully!"