# Vercel Deployment Setup Guide

## Current Issue
You have **2 failing Vercel deployments**:
- `mavrix-insurance` (Frontend - React PWA)
- `mavrix-insurance-api` (Backend - Express API)

## Solution: Separate Deployments

### Option 1: Single Repository with Monorepo Setup (Recommended)

#### 1. Frontend Deployment (`mavrix-insurance.vercel.app`)
Use the current `vercel.json` configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 2. API-Only Deployment (`mavrix-insurance-api.vercel.app`)
Create a separate repository or use `api-vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/server.js"
    }
  ]
}
```

### Option 2: Separate Repositories (Alternative)

#### Frontend Repository
1. Create a new repository for the frontend
2. Copy only these files:
   - `src/`
   - `public/`
   - `package.json`
   - `package-lock.json`
   - `README.md`

#### API Repository
1. Create a new repository for the API
2. Copy only these files:
   - `server/`
   - `api-vercel.json` (rename to `vercel.json`)

## Environment Variables Setup

### For API Deployment (`mavrix-insurance-api.vercel.app`):
```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=insuretrack
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
```

### For Frontend Deployment (`mavrix-insurance.vercel.app`):
```
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
```

## Step-by-Step Fix

### 1. Fix Current Repository (Recommended)

1. **Commit the current changes**:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **In Vercel Dashboard**:
   - Go to your `mavrix-insurance` project
   - Go to Settings → General
   - Set "Root Directory" to `/` (if not already set)
   - Go to Settings → Environment Variables
   - Add the environment variables listed above

3. **Redeploy**:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

### 2. Test the Deployments

#### Test Frontend:
- Visit: `https://mavrix-insurance.vercel.app`
- Should show your React PWA

#### Test API:
- Visit: `https://mavrix-insurance.vercel.app/api/health`
- Should return: `{"status":"OK","message":"InsureTrack server is running"}`

### 3. Update Frontend API URL

In your React app, make sure the API calls point to the correct URL:

```javascript
// In your API service files
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mavrix-insurance.vercel.app';
```

## Troubleshooting

### If deployments still fail:

1. **Check Vercel logs**:
   - Go to your project in Vercel dashboard
   - Click on the failed deployment
   - Check the "Functions" tab for errors

2. **Common issues**:
   - Missing environment variables
   - Incorrect file paths in `vercel.json`
   - Missing dependencies

3. **Test locally first**:
   ```bash
   # Test frontend
   npm start
   
   # Test API
   cd server
   npm start
   ```

## Expected Results

After successful deployment:

- ✅ `mavrix-insurance.vercel.app` - Shows your React PWA
- ✅ `mavrix-insurance.vercel.app/api/health` - Returns API health status
- ✅ No more 404 errors
- ✅ Both deployments show "Success" in Vercel dashboard

## Next Steps

1. Fix the deployment configuration
2. Set up environment variables
3. Redeploy both projects
4. Test all endpoints
5. Update your frontend to use the correct API URLs
