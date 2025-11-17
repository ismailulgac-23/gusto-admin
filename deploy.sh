#!/bin/bash

# Deploy script for ihale-admin
# This script installs dependencies, builds the project, and restarts PM2

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart admin || {
    echo "⚠️  PM2 process 'admin' not found. Starting new process..."
    pm2 start npm --name admin -- start
}

echo "✅ Deployment completed successfully!"
echo "📊 Checking PM2 status..."
pm2 status

