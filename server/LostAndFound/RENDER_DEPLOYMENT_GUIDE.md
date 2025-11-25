# 🚀 Deploy Spring Boot Backend to Render.com

## ⚡ Quick Deployment Steps (10 Minutes)

---

## ✅ Step 1: Build Your Project Locally (2 min)

First, let's make sure everything builds correctly:

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\server\LostAndFound
mvn clean package -DskipTests
```

✅ **Success if you see:** `BUILD SUCCESS` and `LostAndFound-0.0.1-SNAPSHOT.jar` in `target/` folder

---

## 🔐 Step 2: Change MongoDB Password (CRITICAL - 2 min)

**⚠️ Your current password is exposed in git history!**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Database Access** (left sidebar)
3. Find user: `meetchauhan9915_db_user`
4. Click **Edit** → **Edit Password**
5. Generate new password or create one
6. **Save this password** - you'll need it in Step 5!

---

## 📦 Step 3: Push to GitHub (3 min)

### Option A: If you already have a GitHub repo

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\server\LostAndFound

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Configure for Render deployment"

# Push to GitHub
git push origin main
```

### Option B: Create new GitHub repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository: `lostandfound-backend`
3. **Don't** initialize with README (you already have code)
4. Click **Create repository**

Then run:

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\server\LostAndFound

git init
git add .
git commit -m "Initial commit for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lostandfound-backend.git
git push -u origin main
```

---

## 🌐 Step 4: Deploy on Render.com (3 min)

### 4.1: Create Account
1. Go to [Render.com](https://render.com/)
2. Click **Get Started** or **Sign Up**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your repositories

### 4.2: Create Web Service
1. Click **Dashboard**
2. Click **New +** button (top right)
3. Select **Web Service**
4. Click **Connect** next to your repository (or search for it)
5. If you don't see it, click **Configure account** → Select repositories

### 4.3: Configure Web Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `lostandfound-backend` |
| **Region** | Choose closest to you (e.g., Oregon, Singapore) |
| **Branch** | `main` |
| **Root Directory** | `server/LostAndFound` ⚠️ **IMPORTANT** |
| **Environment** | **Docker** |
| **Dockerfile Path** | `Dockerfile` (or leave blank, it will auto-detect) |
| **Docker Build Context Directory** | `.` |
| **Instance Type** | **Free** |

Click **Advanced** to expand more options (we'll add environment variables next).

---

## 🔑 Step 5: Add Environment Variables (2 min)

In the **Advanced** section, click **Add Environment Variable** and add these:

### Variable 1: MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://meetchauhan9915_db_user:YOUR_NEW_PASSWORD@cluster0.1vfugmb.mongodb.net/lostAndFound
```
**Replace `YOUR_NEW_PASSWORD` with the password you changed in Step 2!**

### Variable 2: JWT_SECRET
```
Key: JWT_SECRET
Value: (Generate a strong secret - see below)
```

**Generate JWT Secret:**
Option A - Use random string generator:
```
your-super-secret-jwt-key-change-this-to-something-random-and-long-minimum-32-characters
```

Option B - Generate in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Variable 3: PORT (Optional)
```
Key: PORT
Value: 10000
```

**Your environment variables should look like this:**
```
MONGODB_URI = mongodb+srv://meetchauhan9915_db_user:newPassword123@cluster0.1vfugmb.mongodb.net/lostAndFound
JWT_SECRET = xK9mN2pQ7rT4vW8zL5nM3qR6sU1wY4aB9cD2eF7gH0jK3lN6oP9
PORT = 10000
```

---

## 🚀 Step 6: Deploy! (5-10 min)

1. Click **Create Web Service** button at the bottom
2. Render will start building your application
3. Watch the **Logs** tab - you'll see:
   - Downloading dependencies
   - Building with Maven
   - Starting Spring Boot
   - "Started LostAndFoundApplication"

**Build time:** ~5-10 minutes (first time)

### ✅ Success indicators in logs:
```
==> Starting service with 'java -jar target/LostAndFound-0.0.1-SNAPSHOT.jar'
...
Started LostAndFoundApplication in X seconds
Tomcat started on port(s): 10000 (http)
```

---

## 🎉 Step 7: Get Your Backend URL

Once deployed successfully:

1. Look at the top of your Render dashboard
2. You'll see a URL like: `https://lostandfound-backend.onrender.com`
3. **Copy this URL** - you'll need it for frontend!

### Test your backend:

```powershell
# Test in PowerShell
curl https://lostandfound-backend.onrender.com/lostAndFound/home

# Or open in browser:
https://lostandfound-backend.onrender.com/user-reports
```

✅ **Success:** You should see a response (even if it's empty array `[]`)

---

## 🔧 Troubleshooting

### Build Failed

**Problem:** Maven build errors

**Solutions:**
1. Check build logs in Render dashboard
2. Verify pom.xml is correct
3. Make sure build command is: `mvn clean package -DskipTests`

### Application Crashes After Build

**Problem:** Service starts but crashes immediately

**Check these:**
1. ✅ MongoDB URI is correct (with NEW password)
2. ✅ MongoDB Atlas → Network Access allows `0.0.0.0/0`
3. ✅ JWT_SECRET is set
4. ✅ Start command is correct

**View logs:**
- Go to Render dashboard
- Click on your service
- Click **Logs** tab
- Look for error messages

### Can't Connect to MongoDB

**Problem:** `MongoTimeoutException` or connection errors

**Solutions:**
1. Go to MongoDB Atlas → Network Access
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** → `0.0.0.0/0`
4. Click **Confirm**
5. Wait 2 minutes
6. Restart your Render service (click **Manual Deploy** → **Deploy latest commit**)

### 503 Service Unavailable

**Problem:** First request after inactivity

**Explanation:** 
- Free tier spins down after 15 minutes of inactivity
- First request takes ~30 seconds to wake up (cold start)
- Subsequent requests are fast

**Solution:** This is normal for free tier. Consider:
- Keep-alive service (ping every 10 minutes)
- Upgrade to paid tier for always-on

---

## 📱 Step 8: Update Frontend

Once backend is deployed, update your frontend:

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\client\lostAndFound

# Create .env.production
echo "VITE_API_BASE_URL=https://lostandfound-backend.onrender.com" > .env.production
echo "VITE_GOOGLE_CLIENT_ID=21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com" >> .env.production
```

Then deploy frontend to Vercel (see `client/lostAndFound/DEPLOYMENT.md`)

---

## 🔄 Updating Your Backend

### After making code changes:

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\server\LostAndFound

git add .
git commit -m "Description of changes"
git push origin main
```

**Render automatically redeploys** when you push to GitHub! 🎉

### Manual Deploy:
1. Go to Render dashboard
2. Click on your service
3. Click **Manual Deploy** → **Deploy latest commit**

---

## 📊 Monitoring Your Backend

### View Logs:
1. Render Dashboard → Your Service
2. Click **Logs** tab
3. Real-time logs of your application

### View Metrics:
1. Click **Metrics** tab
2. See CPU, Memory, Request counts

### Check Status:
1. Click **Events** tab
2. See deployment history and status

---

## 🔐 Security Checklist

After deployment, verify:

- [ ] MongoDB password was changed
- [ ] Environment variables are set in Render (not in code)
- [ ] MongoDB Atlas allows Render's IP (0.0.0.0/0)
- [ ] JWT_SECRET is at least 32 characters
- [ ] `.env` files are in `.gitignore`
- [ ] Test all API endpoints
- [ ] CORS will be updated with frontend URL (Step 9)

---

## 🎯 Step 9: Update CORS (After Frontend Deployment)

Once you deploy frontend to Vercel, update CORS:

1. Edit `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://your-frontend-url.vercel.app",
    "http://localhost:5173"
));
configuration.setAllowCredentials(true);
```

2. Commit and push:
```powershell
git add .
git commit -m "Update CORS with production frontend URL"
git push origin main
```

Render will automatically redeploy!

---

## 💡 Render.com Free Tier Details

**What you get:**
- ✅ 750 hours/month (enough for 24/7 if only one service)
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ SSL certificate (HTTPS)
- ✅ Automatic deploys from GitHub
- ✅ Custom domains (optional)

**Limitations:**
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start ~30 seconds
- ⚠️ Shared resources

**Upgrade to paid ($7/month):**
- Always on (no spin down)
- More RAM and CPU
- Priority support

---

## 📞 Need Help?

### Check These First:
1. ✅ Build logs in Render dashboard
2. ✅ MongoDB Atlas Network Access settings
3. ✅ Environment variables are set correctly
4. ✅ Application logs for errors

### Common Issues:
- **503 Error:** Service is waking up (wait 30s)
- **Connection timeout:** Check MongoDB Atlas IP whitelist
- **Build failed:** Check Maven dependencies and Java version
- **App crashes:** Check environment variables and logs

---

## 🎉 Success!

Your backend is now deployed at:
```
https://lostandfound-backend.onrender.com
```

**Next Steps:**
1. ✅ Test all endpoints
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS with frontend URL
4. ✅ Update Google OAuth settings
5. ✅ Share with users!

---

## 📝 Quick Reference

**Your Backend URL:**
```
https://lostandfound-backend.onrender.com
```

**Test Endpoints:**
```
GET  https://lostandfound-backend.onrender.com/lostAndFound/home
GET  https://lostandfound-backend.onrender.com/user-reports
POST https://lostandfound-backend.onrender.com/lostAndFound/user-register
POST https://lostandfound-backend.onrender.com/lostAndFound/user-login
```

**Environment Variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - 10000 (optional)

**Deployment:**
- Push to GitHub → Automatic redeploy
- Or use Manual Deploy in Render dashboard

---

**Congratulations! Your backend is live! 🚀**
