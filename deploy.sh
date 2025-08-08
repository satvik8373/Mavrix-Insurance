#!/bin/bash

# InsureTrack Deployment Script
# This script helps deploy the application to Vercel with proper configuration

set -e

echo "🚀 InsureTrack Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

print_status "Vercel CLI found"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment process..."

# Deploy Server
echo ""
echo "📦 Deploying Server..."
cd server

# Check if server has required files
if [ ! -f "server.js" ]; then
    print_error "Server files not found in server directory"
    exit 1
fi

print_status "Deploying server to Vercel..."
vercel --prod --yes

# Get the server URL
SERVER_URL=$(vercel ls --json | jq -r '.projects[] | select(.name | contains("api")) | .url' | head -1)
if [ -z "$SERVER_URL" ]; then
    print_warning "Could not automatically detect server URL. Please set it manually."
    SERVER_URL="https://your-server-url.vercel.app"
fi

print_status "Server deployed to: $SERVER_URL"

cd ..

# Deploy Client
echo ""
echo "📦 Deploying Client..."
cd client

# Check if client has required files
if [ ! -f "package.json" ]; then
    print_error "Client files not found in client directory"
    exit 1
fi

print_status "Deploying client to Vercel..."
vercel --prod --yes

cd ..

echo ""
echo "🔧 Environment Variables Setup"
echo "============================="

print_warning "IMPORTANT: You need to set environment variables in Vercel Dashboard"
echo ""
echo "For Server Project:"
echo "1. Go to Vercel Dashboard → Your Server Project → Settings → Environment Variables"
echo "2. Add the following variables:"
echo "   - MONGODB_URI (your MongoDB connection string)"
echo "   - EMAIL_USER (your email address)"
echo "   - EMAIL_PASSWORD (your email app password)"
echo "   - SMTP_HOST (smtp.gmail.com)"
echo "   - SMTP_PORT (587)"
echo "   - REMINDER_DAYS (7)"
echo ""
echo "For Client Project:"
echo "1. Go to Vercel Dashboard → Your Client Project → Settings → Environment Variables"
echo "2. Add:"
echo "   - REACT_APP_API_URL ($SERVER_URL)"
echo ""

print_status "Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Test the application"
echo "3. Check the troubleshooting guide if issues arise"
echo ""
echo "🔗 Useful URLs:"
echo "- Health Check: $SERVER_URL/api/health"
echo "- Debug Info: $SERVER_URL/api/debug"
echo ""
echo "📚 Documentation:"
echo "- Troubleshooting: TROUBLESHOOTING.md"
echo "- Environment Setup: ENVIRONMENT.md"
echo "- Deployment Guide: DEPLOYMENT.md"
