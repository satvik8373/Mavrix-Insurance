# 🗄️ MongoDB Setup Guide for Real Data

## 🎯 **Goal: Connect to Real MongoDB Database**

Currently your app shows sample data because the database connection is failing. Let's fix this to show real data!

## 📋 **Step 1: Create MongoDB Atlas Database**

### **1.1 Go to MongoDB Atlas**
- Visit: https://cloud.mongodb.com/
- Sign up/Login with Google or create account

### **1.2 Create New Cluster**
- Click "Build a Database"
- Choose "FREE" tier (M0)
- Select cloud provider (AWS/Google Cloud/Azure)
- Choose region (closest to you)
- Click "Create"

### **1.3 Set Up Database Access**
- Go to "Database Access" in left sidebar
- Click "Add New Database User"
- Username: `insuretrack_user`
- Password: `Create a strong password`
- Role: "Read and write to any database"
- Click "Add User"

### **1.4 Set Up Network Access**
- Go to "Network Access" in left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for Vercel)
- Click "Confirm"

### **1.5 Get Connection String**
- Go to "Database" in left sidebar
- Click "Connect"
- Choose "Connect your application"
- Copy the connection string

## 🔧 **Step 2: Set Environment Variables in Vercel**

### **2.1 Go to Vercel Dashboard**
- Visit: https://vercel.com/dashboard
- Select your project

### **2.2 Add Environment Variables**
- Go to "Settings" → "Environment Variables"
- Add these variables:

```
MONGODB_URI=mongodb+srv://insuretrack_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/insuretrack?retryWrites=true&w=majority
DATABASE_NAME=insuretrack
```

**⚠️ Important:** Replace `YOUR_PASSWORD` with the actual password you created!

### **2.3 Set Environment**
- Environment: Select "Production" (and "Preview" if needed)
- Click "Save"

## 🚀 **Step 3: Redeploy and Test**

### **3.1 Redeploy**
- Go to "Deployments" tab
- Click "Redeploy" on your latest deployment

### **3.2 Test Database Connection**
- Visit: `https://your-app.vercel.app/api/health`
- Should show: `"database": "connected"`

### **3.3 Test Real Data**
- Visit: `https://your-app.vercel.app/api/insurance-data`
- Should show real data from your database (empty array initially)

## 💾 **Step 4: Add Sample Data**

### **4.1 Use CSV Upload**
- Go to your app's Upload page
- Upload your `sample-insurance-data.csv` file
- Data will be stored in MongoDB

### **4.2 Or Add Manually**
- Use the "Add Insurance" form
- Data will be saved to MongoDB

## 🔍 **Troubleshooting**

### **If Database Still Shows "disconnected":**
1. Check `MONGODB_URI` is set correctly in Vercel
2. Verify password in connection string
3. Check Network Access allows Vercel IPs
4. Check Vercel logs for connection errors

### **If Getting Connection Errors:**
1. Verify MongoDB Atlas cluster is running
2. Check username/password are correct
3. Ensure database user has read/write permissions

## ✅ **Expected Result**

After setup:
- ✅ Database shows "connected" in `/api/health`
- ✅ Real data loads from MongoDB
- ✅ You can add/edit/delete insurance entries
- ✅ Data persists between deployments
- ✅ No more sample data!

## 🎉 **You're Done!**

Your app will now:
- Connect to real MongoDB database
- Store and retrieve real insurance data
- Work like a production application
- Have persistent data storage

**Next:** Redeploy and test the real data functionality!
