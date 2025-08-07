# 🚀 Vercel Deployment Guide for Mavrix Insurance

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be on GitHub (✅ Already done)
3. **MongoDB Atlas** - Cloud database setup
4. **Gmail App Password** - For email functionality

## 🔧 Step-by-Step Deployment

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `Mavrix-Insurance` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset:** React
   - **Root Directory:** Leave empty (uses root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### Step 3: Environment Variables Setup

In Vercel Dashboard, go to your project → Settings → Environment Variables:

Add these variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://mavrix2004:ssd2004@cluster0.bvzyn2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=mavrix_insurance

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=satvikpatel8373@gmail.com
EMAIL_PASSWORD=mkirimbwyczutgkk

# App Configuration
REMINDER_DAYS=7
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## 🔧 Alternative: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: mavrix-insurance
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## ⚙️ Configuration Files Added

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
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
      "dest": "/build/$1"
    }
  ]
}
```

### Updated API URLs
- Development: `http://localhost:5000/api`
- Production: `/api` (relative to domain)

## 🌐 Post-Deployment Setup

### 1. Test Your Deployment
- Visit your Vercel URL
- Test login with password: `Ssd@2004`
- Verify all features work

### 2. Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 3. Set up MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List
3. Add `0.0.0.0/0` (allow all) or Vercel's IP ranges

## 🔍 Troubleshooting

### Common Issues:

**1. Build Fails**
```bash
# Check build logs in Vercel dashboard
# Common fix: Update dependencies
npm update
```

**2. API Routes Not Working**
- Ensure `vercel.json` is in root directory
- Check environment variables are set
- Verify API routes start with `/api/`

**3. Database Connection Issues**
- Verify MongoDB URI in environment variables
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

**4. Email Not Working**
- Verify Gmail App Password is correct
- Check SMTP settings in environment variables
- Test email configuration in Settings page

### Environment Variables Checklist:
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `DATABASE_NAME` - Database name (mavrix_insurance)
- ✅ `EMAIL_USER` - Your Gmail address
- ✅ `EMAIL_PASSWORD` - Gmail App Password
- ✅ `SMTP_HOST` - smtp.gmail.com
- ✅ `SMTP_PORT` - 587
- ✅ `REMINDER_DAYS` - 7
- ✅ `NODE_ENV` - production

## 📱 PWA Features on Vercel

Your deployed app will have:
- ✅ **Installable** - Users can install as native app
- ✅ **Offline Support** - Service worker caching
- ✅ **Responsive** - Works on all devices
- ✅ **Fast Loading** - Vercel's global CDN

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys the changes
```

## 🎯 Final Steps

1. **Test Everything**
   - Login functionality
   - Dashboard operations
   - Excel upload
   - Email sending
   - Settings configuration

2. **Share Your App**
   - Your app is live at: `https://your-project-name.vercel.app`
   - Share the URL with users
   - Provide login password: `Ssd@2004`

## 🚀 Your Mavrix Insurance PWA is Now Live!

Congratulations! Your professional vehicle insurance management system is now deployed and accessible worldwide through Vercel's global CDN.

### 📊 What You Get:
- ✅ **Global Availability** - Fast loading worldwide
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Continuous Deployment** - Auto-updates from GitHub
- ✅ **Serverless Backend** - Scales automatically
- ✅ **PWA Features** - Installable and offline-capable

---

**Need Help?** Check Vercel's documentation or contact support through their dashboard.