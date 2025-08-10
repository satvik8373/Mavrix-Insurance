# 🚀 Vercel Production Setup Guide

## 🔧 **Required Environment Variables**

To fix the production issues, you need to set these environment variables in your Vercel dashboard:

### **1. MongoDB Connection**
```
MONGODB_URI=your_mongodb_connection_string
```
- Get this from MongoDB Atlas or your MongoDB provider
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### **2. Email Configuration**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
- For Gmail, use an App Password (not your regular password)
- Enable 2FA and generate App Password in Google Account settings

### **3. JWT Secret**
```
JWT_SECRET=your_random_secret_key
```
- Generate a random string for security
- Example: `JWT_SECRET=my-super-secret-key-12345`

## 📋 **How to Set Environment Variables in Vercel:**

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each variable:**
   - Name: `MONGODB_URI`
   - Value: `your_connection_string`
   - Environment: Production (and Preview if needed)
5. **Click Save**
6. **Redeploy your project**

## 🚨 **Current Issues Fixed:**

✅ **Manifest errors** - Removed missing logo references  
✅ **API 503 errors** - Added fallback data when database is offline  
✅ **Production data loading** - Better error handling and fallbacks  
✅ **Database connection** - Graceful fallback with helpful error messages  

## 🔍 **Test Your Setup:**

1. **Check health endpoint:** `https://your-app.vercel.app/api/health`
2. **Check test endpoint:** `https://your-app.vercel.app/api/test`
3. **Check insurance data:** `https://your-app.vercel.app/api/insurance-data`

## 💡 **Troubleshooting:**

- **If still getting 503 errors:** Check that `MONGODB_URI` is set correctly
- **If database shows "disconnected":** Verify MongoDB connection string
- **If emails not sending:** Check `EMAIL_USER` and `EMAIL_PASS` are correct

## 🎯 **Next Steps:**

1. Set the environment variables in Vercel
2. Redeploy your project
3. Test the API endpoints
4. Your app should now work in production! 🎉
