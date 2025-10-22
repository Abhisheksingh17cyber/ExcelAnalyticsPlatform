#!/bin/bash

echo "========================================"
echo "Excel Analytics Platform - Network Setup"
echo "========================================"
echo ""

# Function to get local IP address
get_local_ip() {
    # Try different methods to get local IP
    if command -v ip &> /dev/null; then
        # Linux with ip command
        LOCAL_IP=$(ip route get 1 | awk '{print $7; exit}')
    elif command -v ifconfig &> /dev/null; then
        # Mac/BSD with ifconfig
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    elif command -v hostname &> /dev/null; then
        # Fallback to hostname
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    
    echo "$LOCAL_IP"
}

# Detect local IP address
echo "Detecting local IP address..."
LOCAL_IP=$(get_local_ip)

if [ -z "$LOCAL_IP" ]; then
    echo "ERROR: Could not detect local IP address."
    echo "Please check your network connection."
    exit 1
fi

echo ""
echo "Local IP Address detected: $LOCAL_IP"
echo ""

# Set environment variables for network access
export HOST=0.0.0.0
export REACT_APP_API_URL=http://$LOCAL_IP:5000

echo "========================================"
echo "Starting Backend Server..."
echo "Backend will be accessible at: http://$LOCAL_IP:5000"
echo "========================================"
echo ""

cd backend
HOST=$HOST npm start &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo "Waiting 5 seconds for backend to initialize..."
sleep 5

cd ../frontend
echo ""
echo "========================================"
echo "Starting Frontend Server..."
echo "Frontend will be accessible at: http://$LOCAL_IP:3000"
echo "========================================"
echo ""

HOST=0.0.0.0 REACT_APP_API_URL=$REACT_APP_API_URL npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "========================================"
echo "SERVERS RUNNING"
echo "========================================"
echo ""
echo "Access the application from any device on your network:"
echo ""
echo "  Frontend: http://$LOCAL_IP:3000"
echo "  Backend:  http://$LOCAL_IP:5000"
echo ""
echo "For login page, use: http://$LOCAL_IP:3000/simple-login"
echo ""
echo "To stop both servers, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Make sure your firewall allows connections on ports 3000 and 5000"
echo "========================================"
echo ""

# Wait for user input or keep script running
read -p "Press Enter to stop the servers and exit..."

# Stop servers
echo "Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "Servers stopped."
