#!/bin/bash

echo "🚀 Starting Insurance Alert Project Deployment to Vercel..."
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "=================================================="
echo "🎉 Deployment completed!"
echo "📱 Your app should now be live on Vercel!"
echo "🔧 Don't forget to configure environment variables in the Vercel dashboard"
echo "📖 Check DEPLOYMENT_GUIDE.md for next steps"
