# 🚀 Vercel Deployment Guide for Insurance Alert Project

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Vercel account
- MongoDB database (MongoDB Atlas recommended)
- Email service credentials (Gmail, SendGrid, etc.)

## 🔧 Step-by-Step Deployment

### **Step 1: Prepare Your Project**

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Ensure your project structure is correct:**
   ```
   INSURANCE ALERT/
   ├── src/
   ├── server/
   ├── package.json
   ├── vercel.json
   └── env.example
   ```

### **Step 2: Configure Environment Variables**

Create a `.env.local` file in your root directory with your production values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insurancedb

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key

# Frontend API URL (for development)
REACT_APP_API_URL=https://your-vercel-domain.vercel.app/api
```

### **Step 3: Deploy to Vercel**

1. **Run deployment command:**
   ```bash
   vercel
   ```

2. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `insurance-alert` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings: `N`

3. **Wait for deployment to complete**

### **Step 4: Configure Environment Variables in Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGODB_URI` | Your MongoDB connection string | Production |
   | `EMAIL_HOST` | smtp.gmail.com | Production |
   | `EMAIL_PORT` | 587 | Production |
   | `EMAIL_USER` | Your email address | Production |
   | `EMAIL_PASS` | Your email app password | Production |
   | `JWT_SECRET` | Your secure JWT secret | Production |

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### **Step 5: Test Your Deployment**

1. **Check API endpoints:**
   - Health check: `https://your-domain.vercel.app/api/health`
   - Insurance data: `https://your-domain.vercel.app/api/insurance-data`

2. **Test frontend functionality:**
   - Upload insurance data
   - Send test emails
   - Check database connections

## 🔍 Troubleshooting

### **Common Issues:**

1. **Build Errors:**
   - Check `vercel.json` configuration
   - Ensure all dependencies are in `package.json`
   - Verify build scripts are correct

2. **API 404 Errors:**
   - Check `vercel.json` routes configuration
   - Ensure server endpoints match frontend calls
   - Verify environment variables are set

3. **Database Connection Issues:**
   - Verify MongoDB URI is correct
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes Vercel IPs

4. **Email Sending Issues:**
   - Verify email credentials
   - Check SMTP settings
   - Ensure app passwords are used for Gmail

### **Debug Commands:**

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Redeploy with logs
vercel --prod --debug
```

## 📱 PWA Configuration

Your app is already configured as a PWA. After deployment:

1. **Update manifest.json** with your production domain
2. **Test service worker** functionality
3. **Verify offline capabilities**

## 🔄 Continuous Deployment

1. **Connect your GitHub repository** to Vercel
2. **Enable automatic deployments** on push to main branch
3. **Set up preview deployments** for pull requests

## 📊 Monitoring

1. **Vercel Analytics** - Track performance and usage
2. **Function logs** - Monitor serverless function execution
3. **Error tracking** - Set up error monitoring (Sentry recommended)

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Email service configured
- [ ] Frontend API calls updated
- [ ] PWA manifest updated
- [ ] Service worker tested
- [ ] Error handling verified
- [ ] Performance optimized
- [ ] Security headers set
- [ ] SSL certificate active

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: Check your project's GitHub repository

---

**Happy Deploying! 🎉**
