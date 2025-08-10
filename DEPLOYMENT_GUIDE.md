# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)

## 🔧 Environment Variables Setup

### Server Environment Variables (Vercel Dashboard)

Go to your server project settings in Vercel and add these environment variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
DATABASE_NAME=insuretrack

# Email Configuration (Optional - for production email sending)
ENABLE_EMAIL=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Application Settings
ENABLE_AUTH=true
REMINDER_DAYS=7
NODE_ENV=production
```

### Client Environment Variables (Vercel Dashboard)

Go to your client project settings in Vercel and add:

```env
REACT_APP_API_URL=https://your-server-url.vercel.app/api
REACT_APP_ENVIRONMENT=production
```

## 🚀 Deployment Steps

### Step 1: Deploy Server

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `server` folder

2. **Configure Build Settings**:
   - **Framework Preset**: Node.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Add all server environment variables listed above
   - Make sure to use your actual MongoDB connection string

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://your-server.vercel.app`)

### Step 2: Update Client Configuration

1. **Update API URL**:
   - In `client/vercel.json`, replace `your-server-url.vercel.app` with your actual server URL
   - In `client/src/context/DataContext.js`, update the fallback URL

2. **Set Client Environment Variables**:
   - Add `REACT_APP_API_URL` with your server URL

### Step 3: Deploy Client

1. **Connect Repository**:
   - Create another Vercel project
   - Import the same GitHub repository
   - Select the `client` folder

2. **Configure Build Settings**:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Add `REACT_APP_API_URL` with your server URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

## 🔗 Connecting Client to Server

### Update vercel.json

In your client's `vercel.json`, update the server URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-server-url.vercel.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Update DataContext.js

In `client/src/context/DataContext.js`, update the fallback URL:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_URL || 'https://your-actual-server-url.vercel.app/api')
  : 'http://localhost:5000/api';
```

## 🧪 Testing Deployment

1. **Test Server API**:
   - Visit `https://your-server-url.vercel.app/api/insurance`
   - Should return JSON data or empty array

2. **Test Client**:
   - Visit your client URL
   - Try logging in and adding entries
   - Check if data persists

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure server has proper CORS configuration
   - Check that client URL is allowed in server CORS settings

2. **API Connection Issues**:
   - Verify environment variables are set correctly
   - Check server logs in Vercel dashboard
   - Ensure MongoDB connection string is correct

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

### Environment Variable Checklist

**Server Variables**:
- ✅ `MONGODB_URI`
- ✅ `DATABASE_NAME`
- ✅ `NODE_ENV=production`

**Client Variables**:
- ✅ `REACT_APP_API_URL`

## 📱 Post-Deployment

1. **Set up Custom Domain** (Optional):
   - Go to project settings in Vercel
   - Add your custom domain
   - Update DNS settings

2. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor server logs
   - Set up error tracking

3. **Backup Strategy**:
   - Set up MongoDB Atlas backups
   - Consider data export functionality

## 🎉 Success!

Your Insurance Alert system is now deployed and accessible worldwide!

- **Client URL**: `https://your-client.vercel.app`
- **Server URL**: `https://your-server.vercel.app`
- **API Endpoint**: `https://your-server.vercel.app/api`

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection
