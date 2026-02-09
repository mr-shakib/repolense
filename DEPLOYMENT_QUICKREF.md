# 🚀 Quick Deployment Reference

## Backend Environment Variables (Render)
```bash
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=<from djecrety.ir>
DATABASE_URL=<from Render PostgreSQL>
ALLOWED_HOSTS=<your-app>.onrender.com
CORS_ALLOWED_ORIGINS=https://<your-frontend>.vercel.app
AI_PROVIDER=groq
GROQ_API_KEY=<your-groq-key>
```

## Frontend Environment Variables (Vercel)
```bash
NEXT_PUBLIC_API_BASE_URL=https://<your-backend>.onrender.com
```

## Deployment Commands

### Backend (Render)
- **Build:** `./build.sh`
- **Start:** `gunicorn config.wsgi:application`
- **Root Directory:** `backend`

### Frontend (Vercel)
- **Build:** `npm run build`
- **Root Directory:** `frontend`

## Free Tier Costs
- Vercel: **$0/month** (unlimited)
- Render Backend: **$0/month** (750 hours)
- Render PostgreSQL: **$0** for 90 days, then **$7/month**

## Important URLs
- Generate SECRET_KEY: https://djecrety.ir/
- GROQ API Keys: https://console.groq.com/keys
- Render: https://render.com
- Vercel: https://vercel.com

## Common Issues
1. **Backend sleeps:** Free tier sleeps after 15 min inactivity
2. **First request slow:** ~30-60 seconds to wake up
3. **CORS errors:** Verify CORS_ALLOWED_ORIGINS includes https://
4. **Database limit:** Free PostgreSQL is 90 days only

## Health Check
- Backend: `https://<your-backend>.onrender.com/api/health/`
- Frontend: Visit your Vercel URL

---

For full deployment guide, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
