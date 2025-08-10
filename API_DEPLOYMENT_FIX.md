# 🔧 API Deployment Fix - 404 Error

## Current Issue
`https://mavrix-insurance-api.vercel.app/` returns 404 (Not Found)

## Root Cause
You have two separate Vercel projects trying to deploy from the same repository:
- `mavrix-insurance` (Frontend)
- `mavrix-insurance-api` (Backend)

This creates conflicts because both are trying to use the same `vercel.json` configuration.

## 🎯 Solution Options

### Option 1: Use Single Deployment (Recommended)

**Delete the separate API project and use the main project:**

1. **In Vercel Dashboard:**
   - Go to your `mavrix-insurance-api` project
   - Go to Settings → General
   - Click "Delete Project"
   - Confirm deletion

2. **Update your frontend API calls:**
   - Change from: `https://mavrix-insurance-api.vercel.app`
   - Change to: `https://mavrix-insurance.vercel.app`

3. **Set environment variable:**
   ```
   REACT_APP_API_URL=https://mavrix-insurance.vercel.app
   ```

4. **Test the API:**
   - Visit: `https://mavrix-insurance.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"InsureTrack server is running"}`

### Option 2: Create Separate API Repository

**If you want to keep separate deployments:**

1. **Create new repository:** `mavrix-insurance-api`
2. **Copy only server files:**
   ```
   server/
   api-vercel.json (rename to vercel.json)
   ```
3. **Deploy to Vercel** as new project
4. **Set environment variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=insuretrack
   NODE_ENV=production
   ```

## 🚨 Immediate Fix (5 minutes)

### Step 1: Check Current Vercel Projects
1. Go to Vercel dashboard
2. List all your projects
3. Identify which ones are failing

### Step 2: Choose Your Approach
- **Single Project**: Delete `mavrix-insurance-api`, use only `mavrix-insurance`
- **Separate Projects**: Create new repository for API

### Step 3: Update Configuration
Based on your choice, use the appropriate `vercel.json`:

**For Single Project (current setup):**
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
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**For Separate API Project:**
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

## 🧪 Test After Fix

### Single Project Test:
- Frontend: `https://mavrix-insurance.vercel.app`
- API: `https://mavrix-insurance.vercel.app/api/health`

### Separate Projects Test:
- Frontend: `https://mavrix-insurance.vercel.app`
- API: `https://mavrix-insurance-api.vercel.app`

## 📋 Environment Variables

### For Single Project:
```
REACT_APP_API_URL=https://mavrix-insurance.vercel.app
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=insuretrack
NODE_ENV=production
```

### For Separate Projects:
**Frontend:**
```
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
```

**Backend:**
```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=insuretrack
NODE_ENV=production
```

## 🎯 Expected Results

After fixing:
- ✅ No more 404 errors
- ✅ API accessible at correct URL
- ✅ Frontend can connect to API
- ✅ All functionality works

## 🆘 If Still Failing

1. **Check Vercel logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Test locally** first: `cd server && npm start`
4. **Consider alternative platforms** (Railway, Render, Heroku)
