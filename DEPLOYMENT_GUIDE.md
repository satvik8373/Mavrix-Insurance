# Vercel Deployment Guide - Fix 404 Error

## Issue
You're getting a 404 NOT_FOUND error for your production API at `https://mavrix-insurance-api.vercel.app/`

## Root Cause
The main issue was missing `vercel.json` configuration file, which is required for proper deployment of Express.js applications to Vercel.

## Solution Steps

### 1. Vercel Configuration (✅ Already Fixed)
The `vercel.json` file has been created with proper configuration:
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
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server/server.js"
    }
  ],
  "functions": {
    "server/server.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Environment Variables Setup
You need to configure environment variables in your Vercel dashboard:

1. Go to your Vercel dashboard
2. Select your project (`mavrix-insurance-api`)
3. Go to Settings → Environment Variables
4. Add the following variables:

#### Required Variables:
```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=insuretrack
```

#### Optional Variables (for email functionality):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
```

### 3. Redeploy Your Application
After adding the environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Deployments tab
4. Click "Redeploy" on your latest deployment

### 4. Test Your API
After redeployment, test these endpoints:

- **Root endpoint**: `https://mavrix-insurance-api.vercel.app/`
- **Health check**: `https://mavrix-insurance-api.vercel.app/api/health`
- **Insurance data**: `https://mavrix-insurance-api.vercel.app/api/insurance`

## API Endpoints Available

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint with API info |
| GET | `/api/health` | Health check |
| GET | `/api/insurance` | Get all insurance data |
| POST | `/api/insurance` | Add new insurance entry |
| PUT | `/api/insurance/:id` | Update insurance entry |
| DELETE | `/api/insurance/:id` | Delete insurance entry |
| POST | `/api/insurance/bulk` | Bulk add insurance data |
| GET | `/api/logs` | Get email logs |
| POST | `/api/send-reminders` | Send reminder emails |
| POST | `/api/send-single-reminder` | Send single reminder |

## Troubleshooting

### If you still get 404 errors:

1. **Check Vercel logs**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Functions tab
   - Check for any build or runtime errors

2. **Verify deployment**:
   - Make sure the `vercel.json` file is in the root directory
   - Ensure all files are committed and pushed to your repository

3. **Test locally first**:
   ```bash
   cd server
   npm install
   npm start
   ```

4. **Check environment variables**:
   - Verify all required environment variables are set in Vercel
   - Make sure there are no typos in variable names

### Common Issues:

1. **MongoDB Connection**: If you don't have MongoDB set up, the app will fall back to file-based storage
2. **Email Configuration**: If email credentials aren't set, email sending will be simulated
3. **Port Configuration**: Vercel automatically sets the PORT environment variable

## Expected Response Format

When the API is working correctly, you should see:

```json
{
  "status": "OK",
  "message": "InsureTrack API is running",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "insurance": "/api/insurance",
    "logs": "/api/logs",
    "debug": "/api/debug"
  }
}
```

## Next Steps

1. Set up your environment variables in Vercel
2. Redeploy your application
3. Test the root endpoint first
4. Then test your specific API endpoints
5. Update your frontend application to use the correct API URL

If you continue to have issues, check the Vercel function logs for specific error messages.
