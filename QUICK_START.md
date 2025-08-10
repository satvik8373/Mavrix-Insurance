# Quick Start Guide

This guide helps you get started with the new InsureTrack project structure for easy Vercel deployment.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Install all dependencies (client + server)
npm run install:all
```

### 2. Environment Setup

#### Server Environment
Create `server/.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/insuretrack
DATABASE_NAME=insuretrack
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
```

#### Client Environment
Create `client/.env`:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development
```bash
# Start both client and server
npm run dev

# Or start individually:
npm run dev:server    # Backend only
npm run dev:client    # Frontend only
```

## 📁 Project Structure

```
insuretrack/
├── client/                 # React frontend
│   ├── src/               # React source code
│   ├── public/            # Public assets
│   ├── package.json       # Client dependencies
│   ├── vercel.json        # Client Vercel config
│   └── .gitignore         # Client-specific ignores
├── server/                 # Node.js backend
│   ├── server.js          # Express server
│   ├── database.js        # Database operations
│   ├── emailer.js         # Email functionality
│   ├── config.js          # Configuration loader
│   ├── package.json       # Server dependencies
│   ├── vercel.json        # Server Vercel config
│   └── .gitignore         # Server-specific ignores
├── package.json            # Monorepo configuration
├── .gitignore              # Root git ignores
├── ENVIRONMENT_SETUP.md    # Environment setup guide
├── VERCEL_DEPLOYMENT.md    # Vercel deployment guide
└── QUICK_START.md          # This file
```

## 🚀 Vercel Deployment

### Deploy Server
```bash
cd server
vercel
```

### Deploy Client
```bash
cd client
vercel
```

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both client and server |
| `npm run dev:server` | Start only server |
| `npm run dev:client` | Start only client |
| `npm run build` | Build client for production |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Clean all build artifacts |

## 🌐 Access Points

- **Client**: http://localhost:3000
- **Server API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📚 Documentation

- **Environment Setup**: `ENVIRONMENT_SETUP.md`
- **Vercel Deployment**: `VERCEL_DEPLOYMENT.md`
- **Authentication**: `AUTHENTICATION_SYSTEM.md`
- **MongoDB Integration**: `MONGODB_INTEGRATION.md`

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Client runs on 3000, Server on 5000
   - Ensure ports are available

2. **Database Connection**
   - Check MongoDB is running
   - Verify connection string in `server/.env`

3. **Email Configuration**
   - Use Gmail App Password (not regular password)
   - Enable 2FA on Gmail account

4. **Build Errors**
   - Run `npm run install:all` to ensure all dependencies
   - Check Node.js version (>=16.0.0)

### Getting Help

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB connection status

## 🔄 Development Workflow

1. **Make Changes**: Edit files in `client/src/` or `server/`
2. **Auto-reload**: Both client and server auto-reload on changes
3. **Test**: Use the health endpoint to verify server status
4. **Deploy**: Use Vercel CLI for quick deployments

## 📝 Notes

- Environment variables are loaded from `.env` files
- Client proxies API calls to server during development
- Server supports both MongoDB and file-based storage
- Email functionality requires proper SMTP configuration
- All sensitive data should be in environment variables
