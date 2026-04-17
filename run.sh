#!/bin/bash

echo "================================="
echo " Starting DailyTracker Project   "
echo "================================="

# Trap keyboard interrupt (Ctrl+C) to gracefully shut down both servers
trap 'echo -e "\nShutting down both servers..."; kill %1 2>/dev/null; kill %2 2>/dev/null; exit 0' SIGINT SIGTERM

echo "[1/2] Starting Django Backend on http://localhost:8000..."
source venv/bin/activate
cd backend
python manage.py runserver &
BACKEND_PID=$!
cd ..

echo "[2/2] Starting React Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Everything is running! Press Ctrl+C to stop both servers."

# Wait for background processes to exit
wait $FRONTEND_PID
wait $BACKEND_PID
