# 🚀 Production Environment Variables

## Frontend (Vercel Dashboard)

Add these to your **Frontend Project** (`mavrix-insurance`) in Vercel Dashboard → Settings → Environment Variables:

```env
REACT_APP_API_BASE_URL=https://mavrix-insurance-api.vercel.app/api
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=Mavrix Insurance Alert
REACT_APP_DESCRIPTION=Vehicle Insurance Management System
NODE_ENV=production
```

## Backend (Vercel Dashboard)

Add these to your **API Project** (`mavrix-insurance-api`) in Vercel Dashboard → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://mavrix2004:ssd2004@cluster0.bvzyn2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=mavrix_insurance
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=satvikpatel8373@gmail.com
EMAIL_PASSWORD=mkirimbwyczutgkk
REMINDER_DAYS=7
NODE_ENV=production
VERCEL=1
```

## Quick Setup Steps

1. **Frontend**: Go to Vercel Dashboard → `mavrix-insurance` → Settings → Environment Variables
2. **Backend**: Go to Vercel Dashboard → `mavrix-insurance-api` → Settings → Environment Variables
3. **Add** each variable from the lists above
4. **Redeploy** both projects
5. **Test** the connection

## Test URLs

- Frontend: `https://mavrix-insurance.vercel.app/dashboard`
- API Health: `https://mavrix-insurance-api.vercel.app/api/health`
- Login Password: `Ssd@2004`
