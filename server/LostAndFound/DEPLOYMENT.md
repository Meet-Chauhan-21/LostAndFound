# 🚀 Lost and Found - Backend Deployment Guide

## ⚠️ Important Security Notice
Your MongoDB credentials were exposed in the code. **IMMEDIATELY**:
1. Go to MongoDB Atlas → Database Access
2. Change the password for user `meetchauhan9915_db_user`
3. Update the new password in your deployment platform's environment variables

## 📋 Prerequisites
- MongoDB Atlas account (already set up ✅)
- Git repository
- Choose a deployment platform (Render.com, Railway.app, or Heroku)

---

## 🎯 Deployment Options

### **Option 1: Render.com (Recommended - FREE)**

#### Step 1: Prepare Your Code
```bash
cd server/LostAndFound
git init
git add .
git commit -m "Initial commit for deployment"
```

#### Step 2: Push to GitHub
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 3: Deploy on Render
1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lostandfound-backend`
   - **Runtime**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/LostAndFound-0.0.1-SNAPSHOT.jar`
   - **Instance Type**: `Free`

#### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://meetchauhan9915_db_user:<NEW_PASSWORD>@cluster0.1vfugmb.mongodb.net/lostAndFound
JWT_SECRET=generate-a-strong-random-key-here-minimum-32-characters
PORT=10000
```

#### Step 5: Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Copy your backend URL (e.g., `https://lostandfound-backend.onrender.com`)

---

### **Option 2: Railway.app (Easy & Fast)**

#### Step 1: Install Railway CLI (Optional)
```bash
npm i -g @railway/cli
railway login
```

#### Step 2: Deploy via Dashboard
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Java/Maven

#### Step 3: Add Environment Variables
```
MONGODB_URI=mongodb+srv://meetchauhan9915_db_user:<NEW_PASSWORD>@cluster0.1vfugmb.mongodb.net/lostAndFound
JWT_SECRET=your-super-secret-jwt-key
```

#### Step 4: Configure Service
- Railway will automatically use `railway.json` configuration
- Click "Generate Domain" to get your public URL

---

### **Option 3: Heroku**

#### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Deploy
```bash
cd server/LostAndFound
heroku login
heroku create lostandfound-backend
git push heroku main
```

#### Step 3: Set Environment Variables
```bash
heroku config:set MONGODB_URI="mongodb+srv://meetchauhan9915_db_user:<NEW_PASSWORD>@cluster0.1vfugmb.mongodb.net/lostAndFound"
heroku config:set JWT_SECRET="your-secret-key"
```

---

## 🔧 MongoDB URL Configuration

### Current Status: ⚠️ **VULNERABLE**
Your MongoDB credentials are exposed in the code!

### ✅ Fixed Configuration
The `application.properties` now uses environment variables:
```properties
spring.data.mongodb.uri=${MONGODB_URI:mongodb+srv://...}
```

### 🔐 Security Checklist
- [ ] Changed MongoDB password
- [ ] Added `MONGODB_URI` to deployment platform
- [ ] Added `JWT_SECRET` (minimum 32 characters)
- [ ] Never commit `.env` files
- [ ] Added `.env` to `.gitignore`

---

## 🧪 Test Your Backend

After deployment, test with:
```bash
# Health check
curl https://your-backend-url.onrender.com/lostAndFound/home

# Check if API is running
curl https://your-backend-url.onrender.com/user-reports
```

---

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render: Spins down after 15 min inactivity (first request slow)
   - Railway: 500 hours/month free
   - Heroku: No longer offers free tier

2. **CORS Configuration**:
   - ✅ Already configured to accept all origins
   - Update `SecurityConfig.java` with your frontend URL in production

3. **Port Configuration**:
   - ✅ Already configured to use `$PORT` environment variable
   - Deployment platforms automatically assign ports

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Test locally first
cd server/LostAndFound
mvn clean package -DskipTests
```

### Can't Connect to MongoDB
- Verify MongoDB Atlas → Network Access allows all IPs (0.0.0.0/0)
- Check environment variables are set correctly
- Test connection string format

### Application Crashes
- Check logs in deployment platform dashboard
- Verify Java 17 is being used
- Ensure all environment variables are set

---

## 📌 Next Steps

After backend is deployed:
1. Copy your backend URL
2. Update frontend `.env.production` with backend URL
3. Deploy frontend to Vercel (see FRONTEND_DEPLOYMENT.md)

---

## 📧 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test MongoDB connection
4. Check CORS settings

**Your Backend URL will look like:**
- Render: `https://lostandfound-backend.onrender.com`
- Railway: `https://lostandfound-backend.up.railway.app`
- Heroku: `https://lostandfound-backend.herokuapp.com`

Save this URL - you'll need it for frontend deployment! 🎉
