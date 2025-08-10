# InsureTrack Deployment Guide

This guide covers deploying both the frontend and backend of the InsureTrack application.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Node.js 18+ installed locally

### Steps

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Fix Vercel build configuration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Environment Variables**
   Set these in your Vercel project settings:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Build Configuration**
   The `vercel.json` is already configured correctly:
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm run install:all`

5. **Deploy**
   - Vercel will automatically build and deploy on each push
   - The build should now succeed with the fixed configuration

## Backend Deployment Options

### Option 1: Railway (Recommended for beginners)

1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Configure environment variables** (copy from your `.env` file)
4. **Deploy** - Railway will automatically detect Node.js

### Option 2: Render

1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment variables from your `.env`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-app-name
   ```
3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set EMAIL_USER=your_email
   heroku config:set EMAIL_PASS=your_app_password
   ```
4. **Deploy:**
   ```bash
   git push heroku main
   ```

## Environment Variables for Backend

Create a `.env` file in your `server` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Reminder Configuration
REMINDER_DAYS=7
REMINDER_TIME=09:00
```

## Post-Deployment Steps

1. **Update Frontend API URL**
   - Set `REACT_APP_API_URL` in Vercel to point to your deployed backend

2. **Test the Application**
   - Verify insurance data upload works
   - Test email reminder functionality
   - Check that the PWA installs correctly

3. **Monitor Logs**
   - Check Vercel function logs for frontend issues
   - Monitor backend logs for API issues

## Troubleshooting

### Vercel Build Errors

- **Missing script errors**: Ensure all scripts in `package.json` exist
- **Dependency issues**: Check that `install:all` completes successfully
- **Build failures**: Verify the client builds locally with `npm run build`

### Backend Connection Issues

- **CORS errors**: Ensure your backend allows requests from your Vercel domain
- **API timeouts**: Check that your backend is responding quickly
- **Environment variables**: Verify all required variables are set

### Common Issues

1. **Build succeeds but app doesn't work**: Check environment variables
2. **API calls fail**: Verify backend URL and CORS configuration
3. **PWA not installing**: Check that `manifest.json` and service worker are properly configured

## Production Considerations

1. **Database**: Use MongoDB Atlas for production MongoDB hosting
2. **Email**: Consider using a transactional email service like SendGrid
3. **Monitoring**: Set up logging and monitoring for production
4. **Backups**: Implement regular data backups
5. **SSL**: Ensure HTTPS is enabled on both frontend and backend

## Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables are set correctly
3. Test locally to isolate deployment vs. code issues
4. Check the platform's documentation for common issues

## Quick Deploy Commands

```bash
# Frontend (Vercel - automatic)
git push origin main

# Backend (Railway example)
railway up

# Backend (Render - automatic)
git push origin main

# Backend (Heroku)
git push heroku main
```

Your application should now deploy successfully on Vercel! The build error has been resolved by:
1. Adding the missing `vercel-build` script
2. Fixing the `vercel.json` configuration
3. Ensuring the build command points to the correct script
