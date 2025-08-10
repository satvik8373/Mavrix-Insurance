# Environment Setup Guide

This application now uses environment variables for all configuration. Follow these steps to set up your environment:

## Server Configuration

### 1. Create Environment File
In the `server/` directory, create a `.env` file with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/insuretrack
DATABASE_NAME=insuretrack

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Reminder Configuration
REMINDER_DAYS=7
```

### 2. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- For local MongoDB: `mongodb://localhost:27017/insuretrack`
- For MongoDB Atlas: Use your connection string from the Atlas dashboard

### 3. Email Setup
- For Gmail: Use an App Password (not your regular password)
- Enable 2-factor authentication on your Gmail account
- Generate an App Password in Google Account settings
- Use `smtp.gmail.com` as host and port `587`

## Client Configuration

### 1. Create Environment File
In the root directory, create a `.env` file with:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Production Configuration
For production, update the API URL to point to your deployed server:

```bash
REACT_APP_API_URL=https://your-domain.com/api
```

## Environment Variables Reference

### Server Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `DATABASE_NAME` | Database name | insuretrack | No |
| `SMTP_HOST` | SMTP server host | smtp.gmail.com | Yes |
| `SMTP_PORT` | SMTP server port | 587 | No |
| `EMAIL_USER` | Email username | - | Yes |
| `EMAIL_PASSWORD` | Email password/app password | - | Yes |
| `REMINDER_DAYS` | Days before expiry to send reminder | 7 | No |

### Client Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api | No |

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use App Passwords** for Gmail, not regular passwords
3. **Keep MongoDB connection strings** secure
4. **Use environment-specific** configurations for different deployments

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string format
   - Ensure network access (for Atlas)

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check if 2FA is enabled (for Gmail)
   - Use App Password instead of regular password

3. **Client Can't Connect to Server**
   - Verify server is running
   - Check CORS configuration
   - Ensure API URL is correct

### Testing Configuration

Use the `/api/health` endpoint to verify your server configuration:

```bash
curl http://localhost:5000/api/health
```

This will return the current configuration status including database connectivity.
