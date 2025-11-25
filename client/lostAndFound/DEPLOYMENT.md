# 🚀 Lost and Found - Frontend Deployment Guide (Vercel)

## 📋 Prerequisites
- Backend deployed and running (see `server/LostAndFound/DEPLOYMENT.md`)
- Backend URL ready
- Vercel account (free)

---

## 🎯 Deploy to Vercel

### **Step 1: Install Vercel CLI (Optional)**
```bash
npm i -g vercel
```

### **Step 2: Prepare Environment Variables**

Create `.env.production` in `client/lostAndFound/`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com
```

**Replace** `your-backend-url.onrender.com` with your actual backend URL from Step 1!

---

### **Step 3: Deploy via Vercel Dashboard (Easiest)**

#### 3.1: Push to GitHub
```bash
cd client/lostAndFound
git init
git add .
git commit -m "Initial commit for deployment"
git remote add origin <your-frontend-github-repo-url>
git push -u origin main
```

#### 3.2: Connect to Vercel
1. Go to https://vercel.com and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client/lostAndFound` (if not already in root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3.3: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
```
VITE_API_BASE_URL = https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID = 21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com
```

#### 3.4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get your live URL (e.g., `https://lostandfound.vercel.app`)

---

### **Step 4: Deploy via CLI (Alternative)**

```bash
cd client/lostAndFound
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `lostandfound`
- Directory? `./`
- Override settings? **N**

Then set environment variables:
```bash
vercel env add VITE_API_BASE_URL production
# Paste: https://your-backend-url.onrender.com

vercel env add VITE_GOOGLE_CLIENT_ID production
# Paste: 21822425516-ok3rneq3tf74m1imo7v1gi527h1fajlv.apps.googleusercontent.com
```

Deploy to production:
```bash
vercel --prod
```

---

## ✅ Post-Deployment Checklist

### 1. Update Backend CORS (Important!)
Edit `server/LostAndFound/src/main/java/com/laf/LostAndFound/config/SecurityConfig.java`:

Replace:
```java
configuration.setAllowedOrigins(Arrays.asList("*"));
```

With:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://your-frontend-url.vercel.app",
    "http://localhost:5173" // for local development
));
configuration.setAllowCredentials(true);
```

Then redeploy backend!

### 2. Update Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized JavaScript origins:
   ```
   https://your-frontend-url.vercel.app
   ```
5. Add Authorized redirect URIs:
   ```
   https://your-frontend-url.vercel.app
   https://your-frontend-url.vercel.app/auth/callback
   ```

### 3. Test Your Deployment
Visit: `https://your-frontend-url.vercel.app`

Test these features:
- [ ] Homepage loads correctly
- [ ] Can view lost/found items
- [ ] Login/Register works
- [ ] Google OAuth works
- [ ] Can post lost/found items (when logged in)
- [ ] Admin panel accessible

---

## 🔧 Configuration Files

### `vercel.json` (Already Created)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures:
- React Router works correctly
- All routes redirect to `index.html`
- SPA navigation works

### `axiosConfig.js` (Already Updated)
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090',
});
```

This ensures:
- Uses environment variable in production
- Falls back to localhost in development

---

## 🐛 Troubleshooting

### 1. API Calls Failing (CORS Error)
**Symptom**: Console shows CORS errors
**Solution**:
- Update backend CORS configuration with frontend URL
- Redeploy backend
- Clear browser cache

### 2. Environment Variables Not Working
**Symptom**: Still connecting to localhost
**Solution**:
- Check environment variables in Vercel dashboard
- Ensure they start with `VITE_`
- Redeploy after adding variables

### 3. 404 on Page Refresh
**Symptom**: Direct URL access shows 404
**Solution**:
- Verify `vercel.json` exists with rewrites configuration
- Redeploy

### 4. Google OAuth Not Working
**Symptom**: OAuth redirect fails
**Solution**:
- Update authorized origins in Google Cloud Console
- Add your Vercel URL
- Wait 5 minutes for changes to propagate

---

## 🔄 Update Deployment

### Via GitHub (Automatic)
```bash
git add .
git commit -m "Update: description"
git push origin main
```
Vercel automatically redeploys!

### Via CLI
```bash
vercel --prod
```

---

## 📊 Monitor Your App

### Vercel Dashboard
- View deployment logs
- Check analytics
- Monitor performance
- View error logs

### Check Logs
```bash
vercel logs <deployment-url>
```

---

## 🎉 Success!

Your Lost and Found application is now live!

**URLs to Save:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

**Share with users:**
```
🔍 Lost and Found System
Live at: https://your-app.vercel.app

Features:
✅ Report lost items
✅ Report found items
✅ Search functionality
✅ User authentication
✅ Admin dashboard
```

---

## 🔐 Security Recommendations

1. **Never commit**:
   - `.env` files
   - API keys
   - MongoDB credentials

2. **Already Protected** ✅:
   - MongoDB URL using environment variables
   - JWT secret externalized
   - CORS configured
   - Secure headers added

3. **Additional Steps**:
   - Enable Vercel password protection for preview deployments
   - Set up custom domain with SSL
   - Monitor MongoDB Atlas access logs

---

## 📈 Next Steps

1. **Custom Domain** (Optional):
   - Vercel Settings → Domains
   - Add your custom domain
   - Update DNS records

2. **Performance**:
   - Enable Vercel Analytics
   - Optimize images
   - Add loading states

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Enable Vercel Analytics
   - Monitor backend logs

---

## 💡 Tips

- **Free Tier**: Vercel provides generous free tier
- **Preview Deployments**: Every PR gets a preview URL
- **Rollback**: Easy rollback to previous deployments
- **Instant Cache**: Automatic edge caching

---

## 📞 Need Help?

Common issues resolved in `DEPLOYMENT.md` or open an issue on GitHub.

**Congratulations! Your app is deployed! 🎊**
