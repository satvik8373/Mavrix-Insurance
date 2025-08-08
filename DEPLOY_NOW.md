# 🚀 Deploy Now - Fix Production Issues

## Current Status
- ✅ **Frontend**: Working at `https://mavrix-insurance.vercel.app`
- ❌ **Backend**: Deployed but API routes not working
- 🔧 **Issue**: Server needs redeployment with updated code

## Step 1: Deploy Server with Fixed Code

```bash
# Navigate to server directory
cd server

# Deploy to production
vercel --prod
```

**Expected Output:**
```
✅ Production: https://mavrix-insurance-api.vercel.app
```

## Step 2: Set Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your API Project → Settings → Environment Variables

### Required Variables for Server:
```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
REMINDER_DAYS=7
```

### Required Variables for Client:
```bash
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
```

## Step 3: Test Deployment

After deployment, run the test script:

```bash
# Test URLs
node test-urls.js

# Full diagnostic
node diagnose.js
```

## Step 4: Verify API Endpoints

Test these endpoints manually:

```bash
# Health check
curl https://mavrix-insurance-api.vercel.app/api/health

# Debug info
curl https://mavrix-insurance-api.vercel.app/api/debug
```

## Expected Results After Deployment

### ✅ Success Indicators:
- `/api/health` returns 200 with JSON response
- `/api/debug` returns 200 with database info
- Frontend can connect to backend
- Email sending works (if configured)

### ❌ If Still Failing:
1. Check Vercel function logs
2. Verify environment variables
3. Check server deployment status

## Quick Commands

```bash
# Deploy server
cd server && vercel --prod

# Test after deployment
node test-urls.js

# Full diagnostic
node diagnose.js
```

## Troubleshooting

### If Server Deployment Fails:
1. Check if you're in the correct directory (`server/`)
2. Verify `server.js` exists
3. Check Vercel CLI is installed: `npm install -g vercel`

### If API Still Returns 404:
1. Wait 2-3 minutes for deployment to complete
2. Check Vercel dashboard for deployment status
3. Verify the project is linked correctly

### If Environment Variables Missing:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all required variables
3. Redeploy after adding variables

## Next Steps After Successful Deployment

1. **Test the Application:**
   - Visit `https://mavrix-insurance.vercel.app`
   - Try adding/editing insurance entries
   - Test email functionality

2. **Monitor Performance:**
   - Run `node diagnose.js` weekly
   - Check Vercel function logs
   - Monitor email delivery

3. **Set Up Monitoring:**
   - Configure email alerts for failures
   - Set up database monitoring
   - Review logs regularly

## Support

If you encounter issues:
1. Check `TROUBLESHOOTING.md` for common solutions
2. Review Vercel function logs
3. Run diagnostic scripts to identify problems

---

**Remember:** The server needs to be redeployed to apply all the production fixes we made!
