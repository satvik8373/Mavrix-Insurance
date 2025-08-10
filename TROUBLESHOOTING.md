# 🔧 Troubleshooting Guide - 404 Server Issues

## 🚨 Current Issue
- **Client URL**: https://mavrix-insurance-4y55o8g1u-satvik8373s-projects.vercel.app/
- **Server URL**: https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/
- **Error**: 404 NOT_FOUND when accessing API endpoints

## 🔍 Debugging Steps

### 1. Test Server Health
Visit these URLs to check if the server is responding:

```
https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/api/health
https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/api/test
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 2. Test API Endpoints
Try these specific endpoints:

```
GET https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/api/insurance
GET https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/api/email/logs
POST https://mavrix-insurance-api-4y55o8g1u-satvik8373s-projects.vercel.app/api/auth/login
```

### 3. Check Vercel Deployment

#### Server Deployment Issues:
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your server project**: `mavrix-insurance-api`
3. **Check Deployment Logs**:
   - Look for build errors
   - Check if `server.js` is being found
   - Verify environment variables are set

#### Required Environment Variables:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
DATABASE_NAME=insuretrack
NODE_ENV=production
ENABLE_EMAIL=false
ENABLE_AUTH=true
REMINDER_DAYS=7
```

### 4. Check Vercel Configuration

#### Server vercel.json:
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
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Client vercel.json:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://mavrix-insurance-api.vercel.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 5. Common Issues & Solutions

#### Issue 1: Server Not Deployed
**Symptoms**: All endpoints return 404
**Solution**: 
1. Check Vercel dashboard for deployment status
2. Redeploy the server project
3. Verify `server.js` is in the root of the server directory

#### Issue 2: Environment Variables Missing
**Symptoms**: Server responds but database operations fail
**Solution**:
1. Add all required environment variables in Vercel dashboard
2. Redeploy after adding variables

#### Issue 3: CORS Issues
**Symptoms**: Client can't connect to server
**Solution**:
1. Verify CORS configuration in `server.js`
2. Check that client URL is in allowed origins

#### Issue 4: Route Configuration
**Symptoms**: Some endpoints work, others don't
**Solution**:
1. Check that all route files exist
2. Verify route registration in `server.js`

### 6. Manual Testing

#### Test with curl:
```bash
# Test health endpoint
curl https://mavrix-insurance-api.vercel.app/api/health

# Test insurance endpoint
curl https://mavrix-insurance-api.vercel.app/api/insurance

# Test with headers
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"username":"admin","password":"admin123"}' \
     https://mavrix-insurance-api.vercel.app/api/auth/login
```

#### Test with browser:
1. Open browser developer tools
2. Go to Network tab
3. Visit https://mavrix-insurance.vercel.app/
4. Check which requests are failing

### 7. Redeployment Steps

#### Server Redeployment:
1. Push changes to GitHub
2. Go to Vercel dashboard
3. Select server project
4. Click "Redeploy"
5. Check deployment logs

#### Client Redeployment:
1. Push changes to GitHub
2. Go to Vercel dashboard
3. Select client project
4. Click "Redeploy"

### 8. Environment Variable Checklist

#### Server Variables (Vercel Dashboard):
- [ ] `MONGODB_URI`
- [ ] `DATABASE_NAME`
- [ ] `NODE_ENV=production`
- [ ] `ENABLE_EMAIL=false`
- [ ] `ENABLE_AUTH=true`
- [ ] `REMINDER_DAYS=7`

#### Client Variables (Vercel Dashboard):
- [ ] `REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app/api`
- [ ] `REACT_APP_ENVIRONMENT=production`

### 9. Database Connection Test

If the server is responding but data operations fail:

1. **Check MongoDB Atlas**:
   - Verify cluster is running
   - Check connection string
   - Ensure IP whitelist includes Vercel IPs

2. **Test Database Connection**:
   - Visit `/api/test` endpoint
   - Check if `database` field shows "Connected"

### 10. Final Verification

After fixing issues:

1. **Test Server**: Visit `/api/health` and `/api/test`
2. **Test Client**: Visit client URL and try to log in
3. **Test API**: Try adding/editing insurance entries
4. **Check Logs**: Monitor Vercel function logs for errors

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Verify all environment variables
3. Test endpoints individually
4. Check MongoDB connection
5. Review deployment configuration

## 🔄 Quick Fix Commands

```bash
# Force redeploy server
vercel --prod

# Check server logs
vercel logs mavrix-insurance-api

# Test local server
cd server && npm start
```
