# InsureTrack Startup Guide

This guide will help you get the InsureTrack application up and running quickly.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- MongoDB (local or Atlas)
- Gmail account with App Password

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd INSURANCE-ALERT

# Install root dependencies (if any)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

#### Server Environment
```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/insuretrack
DATABASE_NAME=insuretrack
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
```

#### Client Environment
```bash
cd ../
cp env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Application

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Start Frontend
```bash
cd client
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔧 Configuration Details

### MongoDB Setup
- **Local MongoDB**: Install and start MongoDB service
- **MongoDB Atlas**: Use connection string from Atlas dashboard
- **Fallback**: If MongoDB fails, the app will use file-based storage

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this app password in your `.env` file

### Email Configuration
- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587
- **Security**: TLS (not SSL)
- **Authentication**: Username + App Password

## 📁 Project Structure

```
INSURANCE-ALERT/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── config.js     # Frontend configuration
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── server/                # Node.js backend
│   ├── routes/           # API route handlers
│   ├── config.js         # Server configuration
│   ├── database.js       # Database operations
│   ├── emailer.js        # Email functionality
│   └── package.json      # Backend dependencies
├── .env                   # Client environment
├── server/.env           # Server environment
└── README.md             # Project documentation
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000
# Kill the process or change PORT in .env
```

#### 2. MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS
```

#### 3. Email Not Sending
- Verify Gmail App Password is correct
- Check 2FA is enabled
- Ensure SMTP settings are correct
- Check email logs at `/api/logs`

#### 4. CORS Issues
- Verify API URL in client `.env`
- Check server CORS configuration
- Ensure both frontend and backend are running

### Debug Mode
```bash
# Server with debug logging
cd server
DEBUG=* npm run dev

# Client with debug logging
cd client
REACT_APP_DEBUG=true npm start
```

## 🔍 Testing the Setup

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "email": "configured"
}
```

### 2. API Endpoints
```bash
# Test insurance endpoints
curl http://localhost:5000/api/insurance

# Test email endpoints
curl http://localhost:5000/api/email

# Test logs endpoints
curl http://localhost:5000/api/logs
```

### 3. Frontend Functionality
- Navigate to http://localhost:3000
- Try uploading a sample Excel file
- Check if data appears in the dashboard
- Test email sending functionality

## 📊 Sample Data

Create a sample Excel file with these columns:
- **Name**: Customer full name
- **Email**: Valid email address
- **ExpiryDate**: Date in YYYY-MM-DD format

Example:
```
Name,Email,ExpiryDate
John Doe,john@example.com,2024-12-31
Jane Smith,jane@example.com,2024-11-15
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/insuretrack
REACT_APP_API_URL=https://your-domain.com/api
```

### Build Commands
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Check the `/api/logs` endpoint for email issues
4. Create an issue in the repository

## 🎯 Next Steps

Once the application is running:
1. Upload your insurance data via Excel
2. Configure email settings
3. Test the reminder system
4. Customize the email templates
5. Set up automated reminders

---

**Happy tracking! 🚗✉️**
