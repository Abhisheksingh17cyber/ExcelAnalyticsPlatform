#!/bin/bash

echo "Starting Excel Analytics Platform..."
echo ""

echo "Starting MongoDB (make sure MongoDB is running)..."
echo ""

echo "Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"
echo "Waiting 3 seconds before starting frontend..."
sleep 3

cd ../frontend
echo "Starting Frontend Development Server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID (http://localhost:5000)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:3000)"
echo ""
echo "To stop both servers, run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user input
read -p "Press Enter to continue..."