# 🚀 InsureTrack - Insurance Management System

A modern, full-stack insurance management system built with React, Node.js, and MongoDB. Manage insurance policies, send automated reminders, and track expiry dates with a beautiful, responsive interface.

## ✨ Features

- **📊 Dashboard**: Comprehensive overview with statistics and data visualization
- **📝 Policy Management**: Add, edit, and delete insurance entries
- **📧 Email Automation**: Send beautiful HTML email reminders automatically
- **🔐 Authentication**: Secure login with 24-hour session persistence
- **📁 File Upload**: Bulk import data from Excel files
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🌐 Real-time Updates**: Instant data synchronization across the application

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - User notifications
- **XLSX** - Excel file processing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Node-cron** - Scheduled tasks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd INSURANCE-ALERT
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/insuretrack
   DATABASE_NAME=insuretrack
   ENABLE_EMAIL=false
   ENABLE_AUTH=true
   REMINDER_DAYS=7
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm start
   
   # Start client (from client directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Login: Use password `Ssd@2004`

## 📦 Deployment

### Vercel Deployment (Recommended)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed Vercel deployment instructions.

### Quick Deployment Steps

1. **Deploy Server**
   - Push code to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy

2. **Deploy Client**
   - Create new Vercel project
   - Set `REACT_APP_API_URL` environment variable
   - Deploy

3. **Update Configuration**
   - Update server URL in client configuration
   - Test the application

## 📁 Project Structure

```
INSURANCE-ALERT/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── package.json
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/insuretrack
DATABASE_NAME=insuretrack
ENABLE_EMAIL=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ENABLE_AUTH=true
REMINDER_DAYS=7
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Email Configuration

1. **Enable Gmail SMTP**
   - Use Gmail App Password
   - Enable 2-factor authentication
   - Generate app password

2. **Test Email Setup**
   - Check email service logs
   - Verify SMTP settings
   - Test email sending

## 📊 API Endpoints

### Insurance Management
- `GET /api/insurance` - Get all insurance entries
- `POST /api/insurance` - Add new entry
- `PUT /api/insurance/:id` - Update entry
- `DELETE /api/insurance/:id` - Delete entry

### Email Management
- `POST /api/email/send` - Send email
- `GET /api/email/logs` - Get email logs
- `POST /api/email/reminders` - Send reminder emails

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/status` - Check auth status

### File Upload
- `POST /api/upload/excel` - Upload Excel file
- `GET /api/upload/template` - Download template

## 🎨 Features in Detail

### Dashboard
- **Statistics Cards**: Total entries, active policies, expiring soon, expired
- **Search & Filter**: Find entries by name, email, policy number
- **Status Filtering**: Filter by active, expiring soon, or expired
- **Bulk Actions**: Select multiple entries for operations

### Email System
- **Template Management**: Customize email templates in settings
- **Auto-send**: Send emails automatically without modals
- **HTML Templates**: Beautiful, responsive email design
- **Variable Replacement**: Dynamic content with placeholders

### Data Management
- **Excel Import**: Bulk upload from Excel files
- **Data Export**: Download data in various formats
- **Real-time Sync**: Instant updates across all components
- **Offline Support**: localStorage fallback when server unavailable

## 🔒 Security Features

- **Authentication**: Password-based login system
- **Session Management**: 24-hour persistent sessions
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production deployment
- **Error Handling**: Comprehensive error management

## 🚀 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Efficient Queries**: Optimized database queries
- **Caching**: localStorage for offline functionality
- **Compression**: Gzip compression for API responses
- **CDN Ready**: Static assets optimized for CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review the troubleshooting section
3. Check Vercel deployment logs
4. Verify environment variables

## 🎉 Acknowledgments

- **Vercel** for hosting platform
- **MongoDB Atlas** for database hosting
- **React Community** for excellent documentation
- **Lucide** for beautiful icons

---

**Built with ❤️ for efficient insurance management**
