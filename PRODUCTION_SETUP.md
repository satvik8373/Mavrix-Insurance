# 🚀 Production Setup Guide - Mavrix Insurance

## 📧 Email Configuration for Production

### Required Environment Variables

Add these environment variables to your production environment (Vercel, Heroku, etc.):

```bash
# Email Configuration
ENABLE_EMAIL=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mavrix-insurance
DATABASE_NAME=mavrix-insurance

# Application Configuration
NODE_ENV=production
ENABLE_AUTH=true
REMINDER_DAYS=7
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Use the app password** as `EMAIL_PASSWORD`

### Alternative Email Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 📱 PWA Configuration

### 1. Generate PWA Icons

Run the icon generation script:
```bash
node generate-pwa-icons.js
```

### 2. Convert SVG to PNG (Recommended)

For better PWA support, convert the generated SVG icons to PNG:

1. **Online Converter**: Use online tools like:
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png

2. **Convert these files**:
   - `icon-192.svg` → `icon-192.png`
   - `icon-512.svg` → `icon-512.png`

3. **Update manifest.json** to use PNG files:
```json
{
  "src": "icon-192.png",
  "type": "image/png"
}
```

### 3. PWA Testing

1. **Chrome DevTools**:
   - Open DevTools → Application tab
   - Check "Manifest" and "Service Workers"
   - Verify all icons are loading

2. **Lighthouse Audit**:
   - Run Lighthouse audit
   - Check PWA score (should be 90+)

3. **Installation Test**:
   - Look for "Install" button in browser
   - Test "Add to Home Screen" on mobile

## 🔧 Vercel Deployment

### Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add all required variables for Production

### Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install"
}
```

### Custom Domain (Optional)

1. Add custom domain in Vercel
2. Update CORS settings in `server/api/index.js`
3. Update PWA manifest with new domain

## 🐛 Troubleshooting

### Email Issues

**Problem**: Emails not sending in production
**Solutions**:
1. Check environment variables are set correctly
2. Verify SMTP credentials
3. Check email provider's sending limits
4. Review email logs in application

**Problem**: Gmail authentication failed
**Solutions**:
1. Ensure 2FA is enabled
2. Use App Password, not regular password
3. Check "Less secure app access" is disabled

### PWA Issues

**Problem**: App not installing as PWA
**Solutions**:
1. Verify manifest.json is valid
2. Check all icons are accessible
3. Ensure HTTPS is enabled
4. Clear browser cache and retry

**Problem**: Service worker not registering
**Solutions**:
1. Check sw.js file is in public folder
2. Verify service worker registration in index.html
3. Check browser console for errors

## 📊 Monitoring

### Email Monitoring

Check email logs in the application:
- Go to Settings → Email Logs
- Monitor success/failure rates
- Check for authentication errors

### PWA Monitoring

Use Chrome DevTools:
- Application → Service Workers
- Check for registration errors
- Monitor cache status

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **Email Security**: Use app passwords, not regular passwords
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting for email sending

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify all environment variables
3. Test email configuration locally first
4. Review browser console for PWA errors

---

**Note**: This guide assumes you're using Vercel for deployment. Adjust accordingly for other platforms.
