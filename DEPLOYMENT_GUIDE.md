# 🚀 RepoLense AI - Deployment Guide

Complete step-by-step guide to deploy RepoLense AI on **FREE** hosting platforms.

**Stack:**
- **Backend:** Django on Render (Free Tier)
- **Frontend:** Next.js on Vercel (Free Tier)
- **Database:** PostgreSQL on Render (Free Tier)

---

## ⚠️ Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **API Keys:**
   - Generate SECRET_KEY at: https://djecrety.ir/
   - Get GROQ API Key at: https://console.groq.com/keys (Free)
   - Optional: GitHub Personal Access Token for higher rate limits

---

## 📦 Part 1: Backend Deployment on Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account (free)
3. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `repolense-db`
   - **Database:** `repolense`
   - **User:** `repolense_user`
   - **Region:** Choose closest to your users
   - **Plan:** **Free** (limited to 90 days, then $7/month)
3. Click **"Create Database"**
4. Wait for database to be provisioned (~2 minutes)
5. **Save the "Internal Database URL"** - you'll need this

### Step 3: Create Web Service for Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `repolense-backend`
   - **Region:** Same as database
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application`
   - **Plan:** **Free**

### Step 4: Add Environment Variables
In the "Environment" section, add these variables:

```bash
# Required
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=<generate-at-djecrety.ir>
DATABASE_URL=<paste-internal-database-url>
ALLOWED_HOSTS=<your-app-name>.onrender.com
CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.vercel.app

# AI Provider (Required)
AI_PROVIDER=groq
GROQ_API_KEY=<your-groq-api-key>

# Optional
GITHUB_ACCESS_TOKEN=<your-github-token>
MAX_REPO_SIZE_MB=100
ANALYSIS_TIMEOUT_SECONDS=300
```

**Important Notes:**
- Replace `<your-app-name>` with your actual Render app name
- You'll update `CORS_ALLOWED_ORIGINS` after deploying frontend
- Keep SECRET_KEY secure and never commit it

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for build to complete (~5-10 minutes)
3. Once deployed, you'll see: `https://<your-app-name>.onrender.com`
4. **Copy this URL** - you'll need it for the frontend

### Step 6: Verify Backend Deployment
1. Visit: `https://<your-app-name>.onrender.com/api/health/`
2. You should see a JSON response
3. If you see an error, check the logs in Render dashboard

**⚠️ Free Tier Limitations:**
- Backend will sleep after 15 minutes of inactivity
- First request after sleep takes ~30-60 seconds
- 750 hours/month of runtime (almost always sufficient)

---

## 🎨 Part 2: Frontend Deployment on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account (free)
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Add Environment Variables
In the "Environment Variables" section:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<your-backend>.onrender.com` |

**Replace** `<your-backend>` with your actual Render backend URL.

### Step 4: Deploy Frontend
1. Click **"Deploy"**
2. Wait for build (~2-3 minutes)
3. Once deployed, you'll see: `https://<your-project>.vercel.app`
4. **Copy this URL**

### Step 5: Update Backend CORS Settings
1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **"Environment"**
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://<your-project>.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will automatically redeploy

### Step 6: Test Your Application
1. Visit your Vercel URL: `https://<your-project>.vercel.app`
2. Try analyzing a GitHub repository
3. Verify the API connection works

---

## 🔧 Part 3: Post-Deployment Configuration

### Custom Domain (Optional)
**Vercel Frontend:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render Backend:**
1. Go to Settings → Custom Domain
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

### Monitoring & Logs
**Backend Logs (Render):**
- Dashboard → Your Service → Logs tab
- View real-time logs and errors

**Frontend Logs (Vercel):**
- Project → Deployments → Click deployment → View Logs
- Runtime logs available in dashboard

### Database Backups
**Render PostgreSQL:**
- Free tier: No automatic backups
- Upgrade to paid tier for daily backups
- Manual backup: Use `pg_dump` via Render shell

---

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check logs in Render dashboard
- Verify `build.sh` ran successfully
- Ensure all environment variables are set

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check database is running in Render
- Ensure database and web service are in same region

**"CORS error"**
- Verify `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Include `https://` protocol
- No trailing slash

**"502 Bad Gateway"**
- Service is starting up (wait 30-60 seconds)
- Check if free tier hours exceeded
- Review application logs

### Frontend Issues

**"API request failed"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (visit URL directly)
- Clear browser cache and cookies

**"Build failed"**
- Check build logs in Vercel
- Ensure `package.json` dependencies are correct
- Try building locally: `npm run build`

**"Environment variable not working"**
- Redeploy after adding environment variables
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Check spelling and case sensitivity

---

## 💰 Cost Breakdown

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Vercel** | Unlimited | 100GB bandwidth/month, No custom domains on team tier |
| **Render Backend** | 750 hours/month | Sleeps after 15 min inactivity, 512MB RAM |
| **Render PostgreSQL** | First 90 days | 1GB storage, no backups, then $7/month |

**Total Monthly Cost:** $0 for first 90 days, then $7/month for database

---

## 🔄 Updating Your Deployment

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render automatically redeploys on push to main branch.

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel automatically redeploys on push to main branch.

### Manual Redeploy
**Render:** Dashboard → Service → Manual Deploy → Deploy latest commit
**Vercel:** Project → Deployments → Redeploy

---

## 🎯 Alternative Deployment Options

### Railway (Backend Alternative)
- **Pros:** Better free tier ($5 credit/month), no sleep
- **Cons:** Requires credit card, more expensive after credit
- **Cost:** ~$5/month after free credits

### Netlify (Frontend Alternative)
- **Pros:** Similar to Vercel, good free tier
- **Cons:** Slightly slower builds
- **Cost:** Free

### PythonAnywhere (Backend Alternative)
- **Pros:** Easy Django deployment
- **Cons:** Limited free tier, slower performance
- **Cost:** Free tier available, $5+/month for better performance

---

## 📚 Next Steps

1. **Set up monitoring:**
   - Add Sentry for error tracking (free tier)
   - Set up uptime monitoring (UptimeRobot)

2. **Improve performance:**
   - Add Redis caching (Render Redis or Upstash)
   - Implement CDN for static assets

3. **Security:**
   - Enable 2FA on all accounts
   - Rotate API keys periodically
   - Set up rate limiting

4. **CI/CD:**
   - Add GitHub Actions for testing
   - Automated health checks
   - Staging environment

---

## 📞 Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Django Deployment:** https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## ✅ Deployment Checklist

**Before Deployment:**
- [ ] Code pushed to GitHub
- [ ] SECRET_KEY generated
- [ ] API keys obtained (GROQ, GitHub)
- [ ] Environment variables documented

**Backend (Render):**
- [ ] PostgreSQL database created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Health check endpoint working

**Frontend (Vercel):**
- [ ] Project imported
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Backend CORS updated with Vercel URL
- [ ] API connection tested

**Post-Deployment:**
- [ ] Test repository analysis feature
- [ ] Verify error handling
- [ ] Check logs for errors
- [ ] Set up monitoring
- [ ] Document production URLs

---

**🎉 Congratulations!** Your RepoLense AI is now live in production!

**Your URLs:**
- Frontend: `https://<your-project>.vercel.app`
- Backend API: `https://<your-backend>.onrender.com`

Share your project and start analyzing repositories! 🚀
