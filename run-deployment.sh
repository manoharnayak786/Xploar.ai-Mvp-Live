#!/bin/bash

# XPLOAR.AI V1.0.0 - Quick Deployment Launcher
# Run with: bash run-deployment.sh

echo "🚀 XPLOAR.AI V1.0.0 - DEPLOYMENT LAUNCHER"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if deployment script exists
if [ ! -f "deploy-xploar-ai.js" ]; then
    echo "❌ Deployment script not found. Please ensure deploy-xploar-ai.js exists."
    exit 1
fi

echo ""
echo "🎯 Starting XPLOAR.AI deployment..."
echo "======================================"
echo ""

# Run the deployment script
node deploy-xploar-ai.js "$@"
