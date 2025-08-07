# 🌍 Environment Variables Setup Guide

## 📋 Overview
This guide explains how to set up environment variables for your Mavrix Insurance Alert application in both development and production environments.

## 🚀 Frontend Environment Variables

### Production Environment (Vercel)

In your Vercel dashboard, go to your frontend project settings and add these environment variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://mavrix-insurance-api.vercel.app/api

# App Configuration
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=Mavrix Insurance Alert
REACT_APP_DESCRIPTION=Vehicle Insurance Management System

# Build Configuration
NODE_ENV=production
```

### Development Environment (Local)

Create a `.env.local` file in your project root:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api

# App Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=Mavrix Insurance Alert (Dev)
REACT_APP_DESCRIPTION=Vehicle Insurance Management System - Development

# Build Configuration
NODE_ENV=development
```

## 🔧 Backend Environment Variables

### Production Environment (Vercel API Server)

In your Vercel dashboard, go to your API project settings and add these environment variables:

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
VERCEL=1
```

### Development Environment (Local Server)

Create a `.env` file in your `server/` directory:

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
NODE_ENV=development
PORT=5000
```

## 🔄 How Environment Variables Work

### Frontend (React)
- All environment variables must start with `REACT_APP_`
- They are embedded during build time
- Available in the browser via `process.env.REACT_APP_*`

### Backend (Node.js)
- Environment variables are available at runtime
- Accessible via `process.env.*`
- Can be changed without rebuilding

## 🛠️ Setup Instructions

### 1. Frontend Deployment (Vercel)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your frontend project (`mavrix-insurance`)

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add each variable from the production frontend list above
   - Set environment to "Production"

3. **Redeploy**
   - Trigger a new deployment
   - Environment variables will be available in the build

### 2. Backend Deployment (Vercel API)

1. **Go to Vercel Dashboard**
   - Select your API project (`mavrix-insurance-api`)

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add each variable from the production backend list above
   - Set environment to "Production"

3. **Redeploy**
   - Trigger a new deployment
   - API will use the new environment variables

### 3. Local Development

1. **Frontend**
   ```bash
   # Create .env.local file in project root
   cp env.development .env.local
   npm start
   ```

2. **Backend**
   ```bash
   # Create .env file in server directory
   cd server
   # Copy the development backend variables to .env
   npm start
   ```

## 🔍 Testing Environment Variables

### Frontend
```javascript
// Check if environment variables are loaded
console.log('API URL:', process.env.REACT_APP_API_BASE_URL);
console.log('Environment:', process.env.REACT_APP_ENVIRONMENT);
```

### Backend
```javascript
// Check if environment variables are loaded
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('Email User:', process.env.EMAIL_USER ? 'Set' : 'Not set');
```

## 🚨 Security Notes

### ✅ Safe to Expose (Frontend)
- `REACT_APP_API_BASE_URL` - Public API endpoint
- `REACT_APP_ENVIRONMENT` - Environment name
- `REACT_APP_VERSION` - App version

### 🔒 Keep Secret (Backend)
- `MONGODB_URI` - Database connection string
- `EMAIL_PASSWORD` - Gmail app password
- `EMAIL_USER` - Email address

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure they start with `REACT_APP_` for frontend
   - Redeploy after adding variables
   - Check Vercel dashboard for typos

2. **API Connection Issues**
   - Verify `REACT_APP_API_BASE_URL` is correct
   - Check if API server is deployed
   - Test API endpoints directly

3. **Database Connection Issues**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

### Verification Commands

```bash
# Test frontend environment
curl https://mavrix-insurance.vercel.app/

# Test API environment
curl https://mavrix-insurance-api.vercel.app/api/health

# Check environment variables in build
# (Check Vercel build logs)
```

## 📝 Environment Variable Reference

| Variable | Frontend | Backend | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | ✅ | ❌ | API server URL |
| `REACT_APP_ENVIRONMENT` | ✅ | ❌ | Environment name |
| `MONGODB_URI` | ❌ | ✅ | Database connection |
| `EMAIL_PASSWORD` | ❌ | ✅ | Email service password |
| `NODE_ENV` | ✅ | ✅ | Node environment |

---

**Need Help?** Check Vercel's documentation or contact support through their dashboard.
