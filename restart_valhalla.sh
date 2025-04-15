#!/bin/bash

# Stop any running container named 'valhalla'
CONTAINER_ID=$(docker ps -q --filter "ancestor=valhalla")
if [ ! -z "$CONTAINER_ID" ]; then
    echo "Stopping existing container ($CONTAINER_ID)..."
    docker stop "$CONTAINER_ID"
    docker rm "$CONTAINER_ID"  # Optional: Remove the container after stopping
fi

# Rebuild the Docker image
echo "Building new image..."
docker build . -t valhalla

# Run the container with restart policy
echo "Starting container..."
docker run -d \
    --name valhalla \
    --restart unless-stopped \
    -p 6221:80 \
    valhalla

echo "Valhalla container restarted successfully!"
sudo docker build . -t valhalla
sudo docker run -d --restart unless-stopped -p 6221:80 valhalla