# InsureTrack - Admin PWA for Auto Email Insurance Reminders

A modern, responsive Progressive Web Application (PWA) designed for administrators to manage car insurance expiry data and automatically send email reminders to customers via Gmail.

## 🚀 Features

- **Excel Upload**: Upload and parse .xlsx files with insurance data
- **Admin Dashboard**: View, edit, and manage all insurance entries
- **Automated Gmail Reminders**: Send email reminders before insurance expiry
- **PWA Support**: Installable as a native app on mobile and desktop
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Status Tracking**: Color-coded status indicators (Active, Expiring Soon, Expired)
- **Email Logs**: Monitor email sending activity and troubleshoot issues
- **Configurable Settings**: Customize reminder timing and email configuration

## 📋 Requirements

### Excel File Format
Your Excel file should contain these columns:
- **Name** - Full name of the customer
- **Email** - Valid email address  
- **ExpiryDate** - Insurance expiry date (YYYY-MM-DD or MM/DD/YYYY)

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- Tailwind CSS
- React Router
- SheetJS (xlsx)
- React Hot Toast
- Lucide React Icons
- Date-fns

**Backend:**
- Node.js + Express
- Nodemailer (Gmail integration)
- Node-cron (scheduled tasks)
- CORS

**PWA:**
- Service Worker
- Web App Manifest
- Offline caching

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd insuretrack-pwa
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Environment Configuration
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your Gmail credentials:
```env
PORT=5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
REMINDER_DAYS=7
```

### 5. Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this app password in your `.env` file (not your regular Gmail password)

## 🚀 Running the Application

### Development Mode

**Start the backend server:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

**Start the frontend (in a new terminal):**
```bash
npm start
```

## 🚀 Deployment to Vercel

### Quick Deployment

**For Windows users:**
```bash
deploy.bat
```

**For Mac/Linux users:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

📖 **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions**

### 🚨 **Production Issues Fixed!**

If you're experiencing production issues (503 errors, missing data), see **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** for environment variable setup.

### 🗄️ **Want Real Data Instead of Sample Data?**

To connect to a real MongoDB database and show actual insurance data, see **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** for complete setup instructions.
Frontend will run on http://localhost:3000

### Production Build
```bash
npm run build
```

## 📱 PWA Installation

1. Open the app in Chrome/Edge
2. Look for the "Install" button in the address bar
3. Click to install as a native app
4. The app will appear in your device's app drawer/start menu

## 🔧 Usage Guide

### 1. Upload Insurance Data
- Navigate to the Upload page
- Drag & drop or select an Excel file (.xlsx)
- Preview the parsed data
- Confirm to import into the system

### 2. Manage Dashboard
- View all insurance entries in a table format
- Use search and filters to find specific entries
- Edit or delete entries as needed
- Add new entries manually

### 3. Configure Settings
- Set reminder days (default: 7 days before expiry)
- Configure Gmail SMTP settings
- View email template preview

### 4. Monitor Email Logs
- View all email sending attempts
- Filter by status (success/failed) and date
- Troubleshoot email delivery issues

## 📧 Email Automation

The system automatically:
- Runs a daily check at 8:00 AM
- Identifies insurance policies expiring in X days (configurable)
- Sends personalized email reminders
- Logs all email activity for monitoring

### Email Template
```
Subject: 🚗 Insurance Expiry Reminder

Hi [Customer Name],

Your car insurance is expiring on [Expiry Date]. Please renew it before the due date to avoid penalties.

Thanks,
InsureTrack Team
```

## 🎨 UI Features

- **Status Badges**: 
  - 🟢 Active (>7 days until expiry)
  - 🟡 Expiring Soon (≤7 days until expiry)
  - 🔴 Expired (past expiry date)

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Forms**: Clean interface for adding/editing entries
- **Search & Filter**: Quick access to specific data

## 🔒 Security Considerations

- Use Gmail App Passwords (never regular passwords)
- Environment variables for sensitive configuration
- Input validation and sanitization
- CORS configuration for API security

## 🐛 Troubleshooting

### Email Not Sending
1. Verify Gmail App Password is correct
2. Check 2FA is enabled on Gmail account
3. Ensure SMTP settings are correct
4. Check email logs for error details

### Excel Upload Issues
1. Ensure file is .xlsx format
2. Verify required columns exist (Name, Email, ExpiryDate)
3. Check date format is valid
4. Ensure email addresses are properly formatted

### PWA Installation
1. Use HTTPS in production
2. Ensure service worker is registered
3. Check manifest.json is accessible
4. Use supported browsers (Chrome, Edge, Firefox)

## 📈 Future Enhancements

- [ ] SMS reminders via Twilio
- [ ] Google Sheets integration
- [ ] PDF report exports
- [ ] Multi-language support
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication system
- [ ] Email template customization
- [ ] Bulk email operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**InsureTrack** - Keeping your customers protected, one reminder at a time! 🚗✉️# Mavrix-Insurance
