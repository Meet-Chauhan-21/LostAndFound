# 🚀 Quick Deployment Guide - Lost and Found

## ⚠️ CRITICAL: Security Issue Fixed
Your MongoDB password was exposed in code. **Action Required:**
1. Login to MongoDB Atlas → Database Access
2. Change password for user `meetchauhan9915_db_user`
3. Use new password in environment variables below

---

## 📝 What I Fixed

### ✅ Backend (Spring Boot)
- [x] Moved MongoDB URL to environment variable
- [x] Added JWT secret configuration
- [x] Fixed CORS (disabled → properly configured)
- [x] Added port configuration for cloud deployment
- [x] Created deployment config files (Render, Railway, Heroku)

### ✅ Frontend (React + Vite)
- [x] Updated API base URL to use environment variables
- [x] Created Vercel configuration
- [x] Added environment variable examples
- [x] Fixed axios configuration

---

## 🎯 Deployment Order

### **Step 1: Deploy Backend First** ⚠️
**Why First?** Frontend needs backend URL to work!

**Platform Options** (Choose ONE):
1. **Render.com** (Recommended - Free) → See `server/LostAndFound/DEPLOYMENT.md`
2. **Railway.app** (Easy & Fast)
3. **Heroku** (Paid only)

**Quick Steps:**
```bash
# 1. Go to chosen platform and connect GitHub
# 2. Select Java/Maven project
# 3. Add environment variables:
MONGODB_URI=mongodb+srv://username:<NEW_PASSWORD>@cluster0.1vfugmb.mongodb.net/lostAndFound
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=10000

# 4. Deploy and copy your backend URL
```

**Result:** You'll get URL like `https://your-app.onrender.com`

---

### **Step 2: Deploy Frontend to Vercel**

**Quick Steps:**
```bash
cd client/lostAndFound

# 1. Create .env.production file:
echo "VITE_API_BASE_URL=https://your-backend-url.onrender.com" > .env.production
echo "VITE_GOOGLE_CLIENT_ID=21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com" >> .env.production

# 2. Deploy to Vercel
vercel

# OR use Vercel Dashboard:
# - Go to vercel.com
# - Import GitHub repo
# - Add environment variables
# - Deploy
```

**Result:** You'll get URL like `https://your-app.vercel.app`

---

## 📋 Environment Variables Cheat Sheet

### Backend Environment Variables
Add these in your backend deployment platform (Render/Railway/Heroku):

```env
MONGODB_URI=mongodb+srv://meetchauhan9915_db_user:<NEW_PASSWORD>@cluster0.1vfugmb.mongodb.net/lostAndFound
JWT_SECRET=generate-a-secure-random-string-with-minimum-32-characters
PORT=10000
```

### Frontend Environment Variables
Add these in Vercel dashboard:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com
```

---

## 🔗 Post-Deployment Updates

### 1. Update Backend CORS
Once you have frontend URL, update `SecurityConfig.java`:
```java
// Replace line 57-58
configuration.setAllowedOrigins(Arrays.asList(
    "https://your-frontend-url.vercel.app",
    "http://localhost:5173"
));
configuration.setAllowCredentials(true);
```

### 2. Update Google OAuth
In Google Cloud Console → Credentials:
- Add authorized origin: `https://your-frontend-url.vercel.app`
- Add redirect URI: `https://your-frontend-url.vercel.app`

---

## 🧪 Testing

### Test Backend
```bash
curl https://your-backend-url.onrender.com/lostAndFound/home
```

### Test Frontend
Visit: `https://your-frontend-url.vercel.app`
- [ ] Homepage loads
- [ ] Can view items
- [ ] Login works
- [ ] API calls succeed

---

## 📁 Files Created/Modified

### Backend Files
```
server/LostAndFound/
├── DEPLOYMENT.md               (NEW - Detailed guide)
├── Procfile                    (NEW - Heroku config)
├── system.properties           (NEW - Java version)
├── render.yaml                 (NEW - Render config)
├── railway.json                (NEW - Railway config)
├── .env.example                (NEW - Env template)
├── src/main/resources/
│   └── application.properties  (MODIFIED - Added env vars)
└── src/main/java/.../config/
    └── SecurityConfig.java     (MODIFIED - Fixed CORS)
```

### Frontend Files
```
client/lostAndFound/
├── DEPLOYMENT.md               (NEW - Detailed guide)
├── vercel.json                 (NEW - Vercel config)
├── .env                        (MODIFIED - Added API URL)
├── .env.example                (NEW - Env template)
└── src/utils/
    └── axiosConfig.js          (MODIFIED - Dynamic base URL)
```

---

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Update backend CORS with frontend URL

### Issue: 404 Not Found
**Solution**: Check `vercel.json` exists with rewrites

### Issue: Can't connect to backend
**Solution**: Verify `VITE_API_BASE_URL` is set correctly

### Issue: Environment variables not working
**Solution**: Ensure variables start with `VITE_` for frontend

---

## 📚 Detailed Guides

- **Backend**: Read `server/LostAndFound/DEPLOYMENT.md`
- **Frontend**: Read `client/lostAndFound/DEPLOYMENT.md`

---

## ✨ Summary

**MongoDB URL Status:**
- ❌ Was: Hardcoded with exposed password
- ✅ Now: Uses environment variables (secure)
- ⚠️ Action: Change MongoDB password immediately!

**Project Status:**
- ✅ Backend ready for Render/Railway/Heroku
- ✅ Frontend ready for Vercel
- ✅ Environment variables configured
- ✅ CORS fixed
- ✅ Security improved

---

## 🎉 You're Ready to Deploy!

1. Deploy backend first (get URL)
2. Deploy frontend with backend URL
3. Update CORS with frontend URL
4. Update Google OAuth settings
5. Test everything
6. Share with users! 🚀

**Good luck! 🍀**
