#!/bin/bash

# Determine if we should run in dual mode
DUAL_MODE=true
NEXT_PORT=3000
VITE_PORT=5000

if [ "$1" == "--next-only" ]; then
  DUAL_MODE=false
fi

if [ "$1" == "--help" ]; then
  echo "Usage: ./start-all.sh [options]"
  echo ""
  echo "Options:"
  echo "  --next-only    Run only the Next.js server"
  echo "  --help         Show this help message"
  exit 0
fi

# Function to kill background processes on script exit
cleanup() {
  echo "Cleaning up..."
  if [ ! -z "$NEXT_PID" ]; then
    kill $NEXT_PID 2>/dev/null
  fi
  if [ ! -z "$VITE_PID" ]; then
    kill $VITE_PID 2>/dev/null
  fi
  exit 0
}

# Register the cleanup function for these signals
trap cleanup EXIT INT TERM

# Start Next.js development server
echo "Starting Next.js development server on port $NEXT_PORT..."
npx next dev -p $NEXT_PORT &
NEXT_PID=$!

# Start Vite development server if in dual mode
if [ "$DUAL_MODE" = true ]; then
  echo "Starting Vite development server on port $VITE_PORT..."
  npm run dev &
  VITE_PID=$!
  
  echo ""
  echo "=== Development servers running ==="
  echo "Next.js: http://localhost:$NEXT_PORT"
  echo "Vite:    http://localhost:$VITE_PORT"
  echo "=============================="
  echo "Press Ctrl+C to stop both servers"
else
  echo ""
  echo "=== Development servers running ==="
  echo "Next.js: http://localhost:$NEXT_PORT"
  echo "=============================="
  echo "Press Ctrl+C to stop the server"
fi

# Keep script running until Ctrl+C
wait