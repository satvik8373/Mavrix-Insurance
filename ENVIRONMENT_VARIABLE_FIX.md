# Environment Variable Fix for Vercel Deployment

## Problem
The Vercel deployment was failing with the error:
```
Environment Variable "REACT_APP_API_URL" references Secret "react_app_api_url", which does not exist.
```

## Root Cause
Both `client/vercel.json` and `server/vercel.json` were using the `@secret_name` syntax to reference environment variables that didn't exist as Vercel secrets.

## Solution Applied

### 1. Updated Client vercel.json
**Before:**
```json
{
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
```

**After:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Updated Server vercel.json
**Before:**
```json
{
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "DATABASE_NAME": "@database_name",
    "SMTP_HOST": "@smtp_host",
    "SMTP_PORT": "@smtp_port",
    "EMAIL_USER": "@email_user",
    "EMAIL_PASSWORD": "@email_password",
    "REMINDER_DAYS": "@reminder_days"
  }
}
```

**After:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## How to Set Environment Variables in Vercel

### Method 1: During Deployment (Recommended)
When running `vercel` command, you'll be prompted to set environment variables:

```bash
cd server
vercel
# Follow prompts to set MONGODB_URI, DATABASE_NAME, etc.

cd ../client
vercel
# Follow prompts to set REACT_APP_API_URL
```

### Method 2: Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable manually
4. Ensure **Production**, **Preview**, and **Development** are checked

## Required Environment Variables

### Server (Backend)
- `MONGODB_URI` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email app password
- `REMINDER_DAYS` - Days before expiry reminder

### Client (Frontend)
- `REACT_APP_API_URL` - Backend API URL (e.g., `https://your-server.vercel.app/api`)

## Important Notes

1. **Never use `@secret_name` syntax** in vercel.json files unless you've created the secrets first
2. **Environment variables are automatically encrypted** by Vercel for sensitive data
3. **Local development** still uses `.env` files
4. **Production deployment** uses Vercel dashboard environment variables

## Next Steps

1. ✅ **Fixed**: Removed secret references from vercel.json files
2. ✅ **Fixed**: Updated server vercel.json for proper serverless deployment
3. 🔄 **Deploy**: Run `vercel` in both client and server directories
4. ⚙️ **Configure**: Set environment variables during deployment prompts
5. 🧪 **Test**: Verify both applications work correctly

## Additional Fixes Applied

### Server Build Issue
- **Problem**: "No Output Directory named 'build' found after Build completed"
- **Solution**: Removed build script from server package.json
- **Solution**: Updated server vercel.json for serverless function deployment
- **Prevention**: Always deploy server from the `server/` directory

## Files Modified

- `client/vercel.json` - Removed env section
- `server/vercel.json` - Updated for serverless deployment
- `server/package.json` - Removed build script
- `VERCEL_DEPLOYMENT.md` - Updated deployment guide with troubleshooting
- `ENVIRONMENT_VARIABLE_FIX.md` - This file (created)

The project is now ready for successful Vercel deployment! 🚀
