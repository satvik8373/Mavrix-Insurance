# Quick Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

1. **Remove server-specific vercel.json** (already done)
   - Deleted `server/vercel.json` to avoid conflicts

2. **Remove client-specific vercel.json** (already done)
   - Deleted `client/vercel.json` to avoid conflicts

3. **Remove client .vercel directory** (already done)
   - Deleted `client/.vercel/` to avoid conflicts

4. **Root vercel.json configured** (already done)
   - Handles both client and server builds
   - Routes API calls to server, everything else to client

5. **Build script added** (already done)
   - Added `"build": "cd client && npm run build"` to root package.json

## 🚀 Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

2. **Configure Environment Variables**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   MONGODB_URI=your-mongodb-connection-string (optional)
   DATABASE_NAME=insuretrack (optional)
   REMINDER_DAYS=7 (optional)
   ```

3. **Deploy**
   - Click "Deploy" in Vercel dashboard
   - Monitor the build logs

## 🔧 Expected Build Process

1. **Install Dependencies**
   - Root dependencies
   - Client dependencies
   - Server dependencies

2. **Build Client**
   - Runs `npm run build` in client directory
   - Creates `client/build/` directory

3. **Deploy Server**
   - Deploys `server/server.js` as serverless function

4. **Configure Routes**
   - `/api/*` → Server functions
   - `/*` → React app

## 🐛 Common Issues & Solutions

### Build Fails with "Missing script: build"
- ✅ **Fixed**: Added build script to root package.json

### Build Fails with "Could not find index.html"
- ✅ **Fixed**: Removed conflicting vercel.json files from client and server directories
- ✅ **Fixed**: Removed client/.vercel directory

### Server Not Found
- ✅ **Fixed**: Proper routing in vercel.json

### Email Not Working
- Check environment variables in Vercel dashboard
- Verify Gmail App Password setup

### Database Connection Issues
- MongoDB URI configured correctly?
- Network access allowed for Vercel IPs?

## 📝 Post-Deployment

1. **Test the Application**
   - Frontend loads correctly
   - API endpoints respond
   - Email functionality works

2. **Monitor Logs**
   - Check Vercel function logs
   - Monitor email sending

3. **Set up Custom Domain** (optional)
   - Configure in Vercel dashboard

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions)
