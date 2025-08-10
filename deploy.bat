@echo off
echo 🚀 Starting Insurance Alert Project Deployment to Vercel...
echo ==================================================

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
) else (
    echo ✅ Vercel CLI already installed
)

REM Check if user is logged in
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel...
    vercel login
) else (
    echo ✅ Already logged in to Vercel
)

REM Build the project
echo 🔨 Building project...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ==================================================
echo 🎉 Deployment completed!
echo 📱 Your app should now be live on Vercel!
echo 🔧 Don't forget to configure environment variables in the Vercel dashboard
echo 📖 Check DEPLOYMENT_GUIDE.md for next steps
pause
