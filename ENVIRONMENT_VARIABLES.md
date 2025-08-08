# Environment Variables Setup Guide

This guide provides all the environment variables needed for your InsureTrack PWA deployment on Vercel.

## 🌐 Production Frontend Environment Variables

### Vercel Project: `mavrix-insurance` (Frontend)

**Location**: Vercel Dashboard → Project Settings → Environment Variables

| Variable Name | Value | Description | Required |
|---------------|-------|-------------|----------|
| `REACT_APP_API_URL` | `https://mavrix-insurance-api.vercel.app` | Backend API URL | ✅ Yes |
| `REACT_APP_ENVIRONMENT` | `production` | Environment identifier | ✅ Yes |
| `REACT_APP_VERSION` | `1.0.0` | App version | ❌ No |

### Frontend Environment Variables Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `mavrix-insurance` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```bash
# API Configuration
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## 🔧 API Backend Environment Variables

### Vercel Project: `mavrix-insurance-api` (Backend)

**Location**: Vercel Dashboard → Project Settings → Environment Variables

| Variable Name | Value | Description | Required |
|---------------|-------|-------------|----------|
| `MONGODB_URI` | `mongodb+srv://your-username:your-password@your-cluster.mongodb.net/insuretrack` | MongoDB connection string | ❌ No (uses file storage if not set) |
| `DATABASE_NAME` | `insuretrack` | MongoDB database name | ❌ No |
| `EMAIL_USER` | `your-email@gmail.com` | Gmail address for sending emails | ❌ No (simulates emails if not set) |
| `EMAIL_PASSWORD` | `your-app-password` | Gmail app password | ❌ No |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server host | ❌ No |
| `SMTP_PORT` | `587` | SMTP server port | ❌ No |
| `REMINDER_DAYS` | `7` | Days before expiry to send reminders | ❌ No |
| `NODE_ENV` | `production` | Node.js environment | ✅ Yes |

### API Environment Variables Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `mavrix-insurance-api` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```bash
# Database Configuration (Optional)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/insuretrack
DATABASE_NAME=insuretrack

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Reminder Configuration
REMINDER_DAYS=7

# Environment
NODE_ENV=production
```

## 🔐 MongoDB Atlas Setup (Optional)

If you want to use MongoDB for data persistence:

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free account
   - Create a new cluster

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `insuretrack`

3. **Set Environment Variable**:
   ```bash
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/insuretrack
   ```

## 📧 Gmail SMTP Setup (Optional)

If you want to send real emails instead of simulating them:

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Enable 2-Factor Authentication

2. **Generate App Password**:
   - Go to Security settings
   - Generate an app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

3. **Set Environment Variables**:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```

## 🚀 Deployment URLs

### Production URLs
- **Frontend**: https://mavrix-insurance.vercel.app
- **API**: https://mavrix-insurance-api.vercel.app

### API Endpoints
- **Health Check**: https://mavrix-insurance-api.vercel.app/api/health
- **Insurance Data**: https://mavrix-insurance-api.vercel.app/api/insurance
- **Email Logs**: https://mavrix-insurance-api.vercel.app/api/logs

## 🔧 Configuration Options

### Storage Options
1. **File-based Storage** (Default):
   - No MongoDB setup required
   - Data stored in Vercel's `/tmp` directory
   - Data resets on function cold starts

2. **MongoDB Storage** (Recommended for production):
   - Persistent data storage
   - Better for production use
   - Requires MongoDB Atlas setup

### Email Options
1. **Simulated Emails** (Default):
   - No email setup required
   - Emails are logged but not sent
   - Good for testing

2. **Real Email Sending**:
   - Requires Gmail SMTP setup
   - Sends actual reminder emails
   - Better for production use

## 📋 Environment Variables Summary

### Frontend (mavrix-insurance)
```bash
REACT_APP_API_URL=https://mavrix-insurance-api.vercel.app
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Backend (mavrix-insurance-api)
```bash
# Required
NODE_ENV=production

# Optional - Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/insuretrack
DATABASE_NAME=insuretrack

# Optional - Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Optional - Configuration
REMINDER_DAYS=7
```

## 🔍 Testing Environment Variables

### Test API Health
```bash
curl https://mavrix-insurance-api.vercel.app/api/health
```

### Test Frontend
```bash
curl https://mavrix-insurance.vercel.app
```

## ⚠️ Important Notes

1. **Environment Variables are Case-Sensitive**
2. **Redeploy Required**: After adding environment variables, redeploy your projects
3. **Secret Management**: Never commit sensitive data to your repository
4. **Production vs Development**: Use different values for production and development
5. **Backup**: Keep a backup of your environment variables

## 🆘 Troubleshooting

### Common Issues
1. **API Not Found**: Check if `REACT_APP_API_URL` is correct
2. **Database Connection Failed**: Verify `MONGODB_URI` format
3. **Email Not Sending**: Check Gmail app password and SMTP settings
4. **Build Failures**: Ensure all required variables are set

### Support
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Test API endpoints individually
- Check browser console for frontend errors

---

**Note**: Replace placeholder values (like `your-username`, `your-password`, etc.) with your actual credentials before deploying.
