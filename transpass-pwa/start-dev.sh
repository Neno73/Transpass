#!/bin/bash

# Kill any existing ngrok sessions
pkill -f ngrok

# Start the Next.js development server in the background
npm run dev &

# Wait for the server to start
sleep 5

# Get the port from the output (default to 3000 if not found)
PORT=$(netstat -tlnp 2>/dev/null | grep node | grep -o ":300[0-9]" | grep -o "[0-9]\+")
PORT=${PORT:-3000}

echo "Next.js is running on port $PORT"

# Start ngrok to create a public HTTPS URL
npx ngrok http $PORT

# When ngrok is stopped, kill the development server
kill $(jobs -p)