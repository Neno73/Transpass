#!/bin/bash

# Kill any existing ngrok processes first
pkill -9 -f ngrok
sleep 2

# Start ngrok and send to a file
npx ngrok http 3003 > ngrok_output.txt 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start up
sleep 3

# Print the ngrok output
echo "Ngrok output:"
cat ngrok_output.txt

# Keep the script running to monitor ngrok
echo "Monitoring ngrok (PID: $NGROK_PID)..."
echo "Press Ctrl+C to stop"

# Keep the script running
while kill -0 $NGROK_PID 2>/dev/null; do
  sleep 1
done

echo "Ngrok process has ended"