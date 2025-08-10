# Vercel Deployment Guide

This guide explains how to deploy the InsureTrack application to Vercel with separate deployments for client and server.

## Project Structure

```
insuretrack/
├── client/                 # React frontend (deploy to Vercel)
│   ├── src/               # React source code
│   ├── public/            # Public assets
│   ├── package.json       # Client dependencies
│   └── vercel.json        # Client Vercel config
├── server/                 # Node.js backend (deploy to Vercel)
│   ├── server.js          # Express server
│   ├── database.js        # Database operations
│   ├── emailer.js         # Email functionality
│   ├── package.json       # Server dependencies
│   └── vercel.json        # Server Vercel config
└── package.json            # Monorepo configuration
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **Git Repository**: Push your code to GitHub/GitLab
4. **MongoDB Atlas**: Set up a cloud MongoDB database
5. **Email Service**: Configure SMTP credentials

## Step 1: Deploy Server (Backend API)

### 1.1 Navigate to Server Directory
```bash
cd server
```

### 1.2 Deploy to Vercel
```bash
vercel
```

### 1.3 Configure Environment Variables
When prompted, set the following environment variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insuretrack
DATABASE_NAME=insuretrack
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
```

### 1.4 Get Server URL
After deployment, note the server URL (e.g., `https://your-server.vercel.app`)

## Step 2: Deploy Client (Frontend)

### 2.1 Navigate to Client Directory
```bash
cd ../client
```

### 2.2 Deploy to Vercel
```bash
vercel
```

### 2.3 Configure Environment Variables
When prompted during deployment, set the API URL environment variable:

```bash
REACT_APP_API_URL=https://your-server.vercel.app/api
```

**Important**: Do NOT create a `.env` file in the client directory for production. Environment variables should be set directly in Vercel.

## Step 3: Configure Vercel Projects

### 3.1 Server Project Settings
In your Vercel dashboard for the server project:

1. Go to **Settings** → **Environment Variables**
2. Add all the environment variables from Step 1.3
3. Ensure **Production**, **Preview**, and **Development** are all checked

### 3.2 Client Project Settings
In your Vercel dashboard for the client project:

1. Go to **Settings** → **Environment Variables**
2. Add `REACT_APP_API_URL` with your server URL
3. Ensure **Production**, **Preview**, and **Development** are all checked

### 3.3 Environment Variable Configuration (Important!)

**Do NOT use the `@secret_name` syntax in vercel.json files.** Instead:

1. **Remove env sections** from both `client/vercel.json` and `server/vercel.json`
2. **Set environment variables directly** in the Vercel dashboard
3. **Use plain text values** for non-sensitive data
4. **Use Vercel's built-in encryption** for sensitive data

The current vercel.json files have been updated to remove secret references.

## Step 4: Custom Domain (Optional)

### 4.1 Server Domain
1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed

### 4.2 Client Domain
1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed

## Step 5: Update Client Configuration

After setting up custom domains, update the client environment variable:

```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Environment Variables Reference

### Server Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `DATABASE_NAME` | Database name | `insuretrack` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `your-app-password` |
| `REMINDER_DAYS` | Days before expiry | `7` |

### Client Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.yourdomain.com/api` |

## Troubleshooting

### Common Issues

1. **Environment Variable "references Secret which does not exist"**
   - **Solution**: Remove `env` sections from vercel.json files
   - **Solution**: Set environment variables directly in Vercel dashboard
   - **Cause**: Using `@secret_name` syntax without creating secrets first
   - **Prevention**: Always use Vercel dashboard for environment variables

2. **CORS Errors**
   - Ensure server CORS is configured for your client domain
   - Check that environment variables are set correctly

3. **Database Connection Failed**
   - Verify MongoDB URI is correct
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes Vercel's IPs

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check if 2FA is enabled for Gmail
   - Use App Password instead of regular password

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build commands in vercel.json

### Testing Deployment

1. **Test Server Health**
   ```bash
   curl https://your-server.vercel.app/api/health
   ```

2. **Test Client**
   - Open your client URL in browser
   - Check browser console for errors
   - Test API calls to server

## Production Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Database Security**: Use MongoDB Atlas with proper access controls
3. **Email Security**: Use App Passwords for Gmail
4. **Monitoring**: Set up Vercel analytics and monitoring
5. **Backups**: Regular database backups
6. **SSL**: Vercel provides automatic SSL certificates

## Local Development

For local development, use the monorepo scripts:

```bash
# Install all dependencies
npm run install:all

# Start both client and server
npm run dev

# Start only server
npm run dev:server

# Start only client
npm run dev:client
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection
5. Review CORS configuration
