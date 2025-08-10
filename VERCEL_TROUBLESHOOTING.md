# 🔧 Vercel Deployment Troubleshooting Guide

## Current Issue
Both Vercel deployments are failing:
- `mavrix-insurance` (Frontend)
- `mavrix-insurance-api` (Backend)

## 🚨 Immediate Steps to Fix

### Step 1: Check Vercel Logs
1. Go to your Vercel dashboard
2. Click on the failed deployment
3. Go to "Functions" tab
4. Look for specific error messages

### Step 2: Try Different Deployment Strategies

#### Option A: Single Repository (Current Setup)
Use the current `vercel.json` for monorepo deployment.

#### Option B: Separate Repositories (Recommended for reliability)

**Frontend Repository:**
1. Create new repository: `mavrix-insurance-frontend`
2. Copy these files:
   ```
   src/
   public/
   package.json
   package-lock.json
   vercel-frontend.json (rename to vercel.json)
   ```
3. Deploy to Vercel

**Backend Repository:**
1. Create new repository: `mavrix-insurance-api`
2. Copy these files:
   ```
   server/
   api-vercel.json (rename to vercel.json)
   ```
3. Deploy to Vercel

### Step 3: Environment Variables Setup

#### For Frontend:
```
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
```

#### For Backend:
```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=insuretrack
NODE_ENV=production
```

## 🔍 Common Issues & Solutions

### Issue 1: Build Failures
**Symptoms:** Build process fails during npm install or build
**Solution:**
```bash
# Test locally first
npm install
npm run build
```

### Issue 2: Function Timeout
**Symptoms:** API calls timeout
**Solution:** 
- Check server startup time
- Ensure no blocking operations in startup

### Issue 3: Missing Dependencies
**Symptoms:** Module not found errors
**Solution:**
- Verify all dependencies in package.json
- Check if devDependencies are needed in production

### Issue 4: Environment Variables
**Symptoms:** Undefined environment variables
**Solution:**
- Set all required environment variables in Vercel dashboard
- Use fallback values in code

## 🛠️ Quick Fix Attempts

### Fix 1: Simplify vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Fix 2: Add Build Script
Add to root package.json:
```json
{
  "scripts": {
    "build": "react-scripts build",
    "vercel-build": "npm run build"
  }
}
```

### Fix 3: Check Node Version
Add to package.json:
```json
{
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## 📋 Step-by-Step Recovery

### 1. Test Locally
```bash
# Test frontend
npm install
npm start

# Test backend
cd server
npm install
npm start
```

### 2. Check Git Status
```bash
git status
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

### 3. Redeploy in Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to Deployments
4. Click "Redeploy"

### 4. Monitor Logs
- Watch the deployment logs in real-time
- Look for specific error messages
- Check function logs after deployment

## 🎯 Expected Success Indicators

### Frontend Success:
- ✅ Build completes without errors
- ✅ Static files generated in `build/` directory
- ✅ App accessible at `https://mavrix-insurance.vercel.app`

### Backend Success:
- ✅ Server starts without errors
- ✅ API accessible at `https://mavrix-insurance.vercel.app/api/health`
- ✅ Returns: `{"status":"OK","message":"InsureTrack server is running"}`

## 🆘 If All Else Fails

### Nuclear Option: Fresh Deployment
1. Delete both Vercel projects
2. Create new projects with separate repositories
3. Deploy frontend and backend separately
4. Connect them via environment variables

### Alternative: Use Different Platform
Consider deploying to:
- Netlify (Frontend)
- Railway (Backend)
- Render (Both)

## 📞 Next Steps

1. Check Vercel logs for specific error messages
2. Try the simplified vercel.json configuration
3. Consider separate repositories if issues persist
4. Test locally to ensure code works before deployment
