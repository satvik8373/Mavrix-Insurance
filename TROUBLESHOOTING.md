# Production Troubleshooting Guide

## Common Issues and Solutions

### 1. Email Not Sending

**Symptoms:**
- Emails fail to send
- "Email sent successfully (simulated)" messages
- No email logs in the dashboard

**Causes:**
- Missing email environment variables
- Incorrect SMTP credentials
- Gmail App Password not configured

**Solutions:**

1. **Check Environment Variables on Vercel:**
   ```bash
   # Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   # Ensure these are set:
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```

2. **For Gmail Users:**
   - Enable 2-Factor Authentication
   - Generate App Password: Google Account → Security → App Passwords
   - Use App Password instead of regular password

3. **Test Email Configuration:**
   - Go to Settings page in the app
   - Configure email settings
   - Click "Send Test Email"

### 2. Entry Update Failed

**Symptoms:**
- Cannot edit insurance entries
- "Failed to update entry" errors
- Data not persisting

**Causes:**
- Database connection issues
- File system permissions (in file-based mode)
- API endpoint errors

**Solutions:**

1. **Check Database Connection:**
   - Visit `/api/health` endpoint
   - Check if MongoDB URI is configured
   - Verify database connection status

2. **For File-Based Storage:**
   - Ensure `/tmp` directory is writable (serverless)
   - Check file permissions

3. **Debug API Calls:**
   - Open browser DevTools → Network tab
   - Check for failed API requests
   - Verify correct API URL

### 3. API URL Issues

**Symptoms:**
- "Failed to fetch" errors
- CORS errors
- Inconsistent API endpoints

**Solutions:**

1. **Verify API URL:**
   - Check `REACT_APP_API_URL` environment variable
   - Ensure it points to correct server URL
   - No trailing slash in URL

2. **Update Environment Variables:**
   ```bash
   # In Vercel Client project:
   REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
   ```

### 4. Database Issues

**Symptoms:**
- Data not loading
- "Database not connected" errors
- Data loss

**Solutions:**

1. **MongoDB Connection:**
   - Verify `MONGODB_URI` is set correctly
   - Check MongoDB Atlas connection string
   - Ensure IP whitelist includes Vercel

2. **File-Based Fallback:**
   - If MongoDB fails, system uses file storage
   - Data stored in `/tmp` (ephemeral in serverless)
   - Consider using MongoDB for production

## Debugging Steps

### 1. Check Server Health
```bash
curl https://mavrix-insurance-api.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "database": "MongoDB",
  "connected": true,
  "emailConfigured": true,
  "environment": "production"
}
```

### 2. Check Environment Variables
```bash
curl https://mavrix-insurance-api.vercel.app/api/debug
```

### 3. Test Email Sending
```bash
curl -X POST https://mavrix-insurance-api.vercel.app/api/send-single-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "expiryDate": "2024-12-31"
  }'
```

## Environment Variables Checklist

### Server (Vercel)
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `DATABASE_NAME` - Database name (optional)
- [ ] `EMAIL_USER` - SMTP username
- [ ] `EMAIL_PASSWORD` - SMTP password/app password
- [ ] `SMTP_HOST` - SMTP server (default: smtp.gmail.com)
- [ ] `SMTP_PORT` - SMTP port (default: 587)
- [ ] `REMINDER_DAYS` - Days before expiry (default: 7)

### Client (Vercel)
- [ ] `REACT_APP_API_URL` - Server API URL (no trailing slash)

## Deployment Commands

```bash
# Deploy Server
cd server
vercel --prod

# Deploy Client
cd client
vercel --prod

# Set Environment Variables
vercel env add MONGODB_URI
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
# ... add all required variables
```

## Monitoring and Logs

1. **Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Check for errors in serverless function logs

2. **Application Logs:**
   - Check browser console for client-side errors
   - Monitor network requests in DevTools

3. **Database Monitoring:**
   - MongoDB Atlas dashboard
   - Check connection status and queries

## Emergency Recovery

### If Database is Down:
1. System automatically falls back to file storage
2. Data may be lost in serverless environment
3. Restore from backup if available

### If Email is Down:
1. Emails will be simulated (logged but not sent)
2. Check email configuration
3. Verify SMTP credentials

### If API is Down:
1. Check Vercel deployment status
2. Verify environment variables
3. Redeploy if necessary

## Performance Optimization

1. **Database Indexes:**
   - Add indexes on frequently queried fields
   - Monitor query performance

2. **Caching:**
   - Implement client-side caching
   - Use CDN for static assets

3. **Error Handling:**
   - Implement retry logic for failed requests
   - Add user-friendly error messages
