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

**InsureTrack** - Keeping your customers protected, one reminder at a time! 🚗✉️# 🚗 Mavrix Insurance - Vehicle Insurance Management PWA

A modern, responsive Progressive Web Application (PWA) for managing vehicle insurance data with automated email reminders and comprehensive admin features.

## 🌟 Features

### 🔐 **Authentication System**
- Secure admin login with default password: `Ssd@2004`
- Password change functionality in settings
- 24-hour session management with auto-logout
- Protected routes and secure access control

### 📊 **Dashboard Management**
- Complete vehicle insurance data management
- Real-time status tracking (Active, Expiring Soon, Expired)
- Advanced search and filtering capabilities
- Professional data table with responsive design

### 📤 **Excel Upload System**
- Upload and parse .xlsx files with vehicle data
- Data validation and preview before import
- Support for bulk data import
- Error handling and validation messages

### 📧 **Automated Email System**
- Gmail integration with SMTP configuration
- Automated daily reminders at 8:00 AM
- Manual email sending for individual customers
- Professional email templates with vehicle details
- Email activity logging and monitoring

### ⚙️ **Settings & Configuration**
- Email configuration with test functionality
- Reminder timing customization
- Live email template preview
- Password management system

### 📱 **PWA Features**
- Installable as native app on mobile and desktop
- Offline caching with service worker
- Responsive design for all screen sizes
- Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **SheetJS (xlsx)** - Excel file processing
- **React Hot Toast** - Notifications
- **Lucide React** - Modern icons
- **Date-fns** - Date manipulation

### Backend
- **Node.js + Express** - Server framework
- **MongoDB Atlas** - Cloud database
- **Nodemailer** - Email sending
- **Node-cron** - Scheduled tasks
- **CORS** - Cross-origin requests

### PWA
- **Service Worker** - Offline functionality
- **Web App Manifest** - App installation
- **Responsive Design** - Mobile-first approach

## 📋 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account with App Password

### 1. Clone Repository
```bash
git clone https://github.com/satvik8373/Mavrix-Insurance.git
cd Mavrix-Insurance
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Environment Configuration
```bash
cd server
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=mavrix_insurance
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
REMINDER_DAYS=7
```

### 4. Start Application
```bash
# Start backend server
cd server
npm start

# Start frontend (in new terminal)
cd ..
npm start
```

## 🚀 Usage

### First Login
1. Open http://localhost:3000
2. Enter password: `Ssd@2004`
3. Access the admin dashboard

### Managing Vehicle Data
1. **Add Entry**: Click "Add New Entry" on dashboard
2. **Upload Excel**: Use Upload page for bulk import
3. **Edit/Delete**: Use action buttons in table
4. **Search**: Use search bar for quick filtering

### Email Configuration
1. Go to Settings page
2. Configure Gmail SMTP settings
3. Test email functionality
4. Set reminder timing preferences

### Excel File Format
Your Excel file should contain these columns:
- **VehicleNo** - Registration number
- **VehicleType** - Two Wheeler, Four Wheeler, etc.
- **Name** - Customer name
- **MobileNo** - Contact number
- **Email** - Email address
- **ExpiryDate** - Insurance expiry date

## 📧 Email System

### Automated Reminders
- Daily check at 8:00 AM
- Sends reminders 7 days before expiry (configurable)
- Professional email templates with vehicle details
- Comprehensive logging system

### Manual Email Sending
- Click email icon (📧) next to any entry
- Instant email sending with real-time feedback
- Activity logging for all email operations

## 🔒 Security Features

- **Password Protection**: Secure admin access
- **Session Management**: 24-hour auto-logout
- **Data Validation**: Input sanitization and validation
- **Environment Variables**: Secure credential storage

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Look for install button in address bar
2. Click to install as desktop app
3. App appears in start menu/applications

### Mobile (Android/iOS)
1. Open in browser
2. Use "Add to Home Screen" option
3. App installs like native application

## 🎨 UI Features

### Status Indicators
- 🟢 **Active** - More than 7 days until expiry
- 🟡 **Expiring Soon** - 7 days or less until expiry
- 🔴 **Expired** - Past expiry date

### Vehicle Type Badges
- 🔵 **Two Wheeler** - Blue badge
- 🟣 **Four Wheeler** - Purple badge
- 🟠 **Commercial Vehicle** - Orange badge

## 📊 Dashboard Statistics
- Total insurance entries
- Active policies count
- Expiring soon alerts
- Expired policies tracking

## 🔧 Development

### Project Structure
```
mavrix-insurance/
├── public/                 # Static files and PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Main application pages
│   └── App.js            # Main application component
├── server/
│   ├── database.js       # MongoDB operations
│   ├── emailer.js        # Email functionality
│   └── server.js         # Express server
└── README.md
```

### Available Scripts
```bash
# Frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests

# Backend
npm start          # Start server
npm run dev        # Start with nodemon
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Satvik Patel**
- GitHub: [@satvik8373](https://github.com/satvik8373)
- Email: satvikpatel8373@gmail.com

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB Atlas for reliable cloud database
- Tailwind CSS for beautiful styling utilities
- All open-source contributors

---

**Mavrix Insurance** - Professional vehicle insurance management made simple! 🚗✨
