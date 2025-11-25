# 🚨 URGENT FIX: Frontend Calling Localhost Instead of Production Backend

## Problem:
Your frontend is calling `http://localhost:9090` instead of `https://lostandfound-backend-2xn3.onrender.com`

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: `lost-and-found` (or similar name)
3. Click on it

### Step 2: Add Environment Variables
1. Click **Settings** tab
2. Click **Environment Variables** (left sidebar)
3. Add these TWO variables:

#### Variable 1:
```
Key:   VITE_API_BASE_URL
Value: https://lostandfound-backend-2xn3.onrender.com
Environment: Production, Preview, Development (select all)
```

#### Variable 2:
```
Key:   VITE_GOOGLE_CLIENT_ID  
Value: 21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com
Environment: Production, Preview, Development (select all)
```

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots** menu (⋯)
4. Click **Redeploy**
5. Check "Use existing Build Cache" (faster)
6. Click **Redeploy**

---

## Alternative: Quick Fix via Vercel CLI

If you have Vercel CLI installed:

```powershell
cd D:\LOST_AND_FOUND\LOSTANDFOUND\client\lostAndFound

# Add environment variables
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://lostandfound-backend-2xn3.onrender.com

vercel env add VITE_GOOGLE_CLIENT_ID production  
# When prompted, enter: 21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com

# Redeploy
vercel --prod
```

---

## ⏱️ Timeline:
1. Add environment variables: 2 minutes
2. Redeploy: 3 minutes
3. Test: 1 minute
**Total: 6 minutes** ⚡

---

## 🧪 After Redeployment - Test:

1. Open: `https://lost-and-found-nu-livid.vercel.app/`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Click **Admin** → Try logging in:
   ```
   Email: laf@admin.com
   Password: admin@123
   ```
4. Check browser console (F12) - should see requests to:
   ```
   ✅ https://lostandfound-backend-2xn3.onrender.com/lostAndFound/admin-login
   ❌ NOT http://localhost:9090/...
   ```

---

## 📋 Checklist:

- [ ] Go to Vercel Dashboard
- [ ] Settings → Environment Variables
- [ ] Add VITE_API_BASE_URL
- [ ] Add VITE_GOOGLE_CLIENT_ID
- [ ] Save both variables
- [ ] Deployments → Redeploy
- [ ] Wait 3 minutes
- [ ] Clear browser cache
- [ ] Test login at frontend URL

---

## 🎯 Expected Result:

**Before Fix:**
```
❌ POST http://localhost:9090/lostAndFound/admin-login
❌ ERR_BLOCKED_BY_CLIENT
```

**After Fix:**
```
✅ POST https://lostandfound-backend-2xn3.onrender.com/lostAndFound/admin-login
✅ Status 200 OK
✅ Login successful!
```

---

**Follow these steps and your app will work! 🚀**
