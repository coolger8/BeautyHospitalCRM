#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Beauty Hospital CRM System${NC}"

# Function to clean up background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all processes...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start backend in background
echo -e "${YELLOW}Starting backend server...${NC}"
cd backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo -e "${YELLOW}Starting frontend server...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a bit for servers to start
sleep 5

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}Backend server started successfully on http://localhost:3001${NC}"
else
    echo -e "${RED}Failed to start backend server. Check backend.log for details.${NC}"
    exit 1
fi

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}Frontend server started successfully on http://localhost:3000${NC}"
else
    echo -e "${RED}Failed to start frontend server. Check frontend.log for details.${NC}"
    exit 1
fi

echo -e "${GREEN}Beauty Hospital CRM System is running!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend API: http://localhost:3001${NC}"
echo -e "${GREEN}Backend gRPC: localhost:50051${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID