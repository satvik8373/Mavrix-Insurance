# Vercel Deployment Guide

## Overview
This is a full-stack insurance alert system with a React frontend and Node.js backend. The application is configured to deploy on Vercel as a monorepo.

## Project Structure
```
/
├── client/          # React frontend
├── server/          # Node.js backend
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json with build script
```

## Environment Variables

You need to configure the following environment variables in your Vercel project settings:

### Required for Email Functionality
- `EMAIL_USER`: Your email address (e.g., your-email@gmail.com)
- `EMAIL_PASSWORD`: Your email app password (for Gmail, use App Password)
- `SMTP_HOST`: SMTP server host (default: smtp.gmail.com)
- `SMTP_PORT`: SMTP server port (default: 587)

### Optional for Database
- `MONGODB_URI`: MongoDB connection string (if not provided, uses file-based storage)
- `DATABASE_NAME`: MongoDB database name (default: insuretrack)

### Optional Configuration
- `REMINDER_DAYS`: Days before expiry to send reminders (default: 7)
- `DATA_DIR`: Custom data directory path (auto-configured for serverless)

## Setup Instructions

### 1. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. The build process will:
   - Build the React client from `client/` directory
   - Deploy the Node.js server from `server/` directory

### 2. Configure Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the required environment variables listed above

### 3. Email Setup (Gmail Example)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this App Password as `EMAIL_PASSWORD`

### 4. MongoDB Setup (Optional)
1. Create a MongoDB Atlas cluster or use a local MongoDB instance
2. Get your connection string
3. Set `MONGODB_URI` environment variable

## How It Works

### Build Process
- **Client**: React app builds to `client/build/` directory
- **Server**: Node.js server runs as serverless functions
- **Routing**: API calls go to `/api/*` routes, everything else serves the React app

### Data Storage
- **With MongoDB**: Data is stored in MongoDB collections
- **Without MongoDB**: Data is stored in JSON files (ephemeral in serverless)

### Email Reminders
- Cron job runs daily to check for expiring insurance
- Sends email reminders based on `REMINDER_DAYS` setting
- Logs all email activities

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm run install:all`
- Check that the build script exists in root `package.json`
- Verify `vercel.json` configuration is correct

### Email Issues
- Verify SMTP credentials are correct
- Check if your email provider allows SMTP access
- For Gmail, ensure you're using an App Password, not your regular password

### Database Issues
- If MongoDB is not configured, the app falls back to file-based storage
- File-based storage is ephemeral in serverless environments
- For production, configure MongoDB for persistent data

### Environment Variables
- All environment variables must be set in Vercel dashboard
- Changes to environment variables require redeployment
- Use Vercel's environment variable validation

## Local Development
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build
```

## API Endpoints
- `GET /api/insurance` - Get all insurance entries
- `POST /api/insurance` - Add new insurance entry
- `PUT /api/insurance/:id` - Update insurance entry
- `DELETE /api/insurance/:id` - Delete insurance entry
- `POST /api/upload` - Upload CSV file
- `GET /api/logs` - Get email logs

## Security Notes
- Never commit environment variables to version control
- Use Vercel's environment variable encryption
- Regularly rotate email app passwords
- Monitor API usage and logs
