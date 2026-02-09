# 🎯 Pre-Deployment Checklist

Use this checklist before deploying to production.

## ✅ Code Preparation

- [ ] All code committed to GitHub
- [ ] No `.env` files in version control
- [ ] `.env.example` files updated with all variables
- [ ] `build.sh` script is executable
- [ ] All tests passing locally

## ✅ API Keys & Secrets

- [ ] SECRET_KEY generated (https://djecrety.ir/)
- [ ] GROQ API key obtained (https://console.groq.com/keys)
- [ ] GitHub Personal Access Token created (optional)
- [ ] All sensitive keys stored securely

## ✅ Configuration Files

- [ ] `backend/requirements.txt` includes gunicorn and whitenoise
- [ ] `backend/render.yaml` configured
- [ ] `backend/build.sh` created
- [ ] `backend/runtime.txt` specifies Python version
- [ ] `frontend/.env.production.example` created

## ✅ Backend Configuration

- [ ] PostgreSQL ready (local or Render)
- [ ] DJANGO_SETTINGS_MODULE set to production
- [ ] ALLOWED_HOSTS configured
- [ ] CORS_ALLOWED_ORIGINS configured
- [ ] Static files configured with whitenoise
- [ ] Database migrations tested

## ✅ Frontend Configuration

- [ ] NEXT_PUBLIC_API_BASE_URL environment variable set
- [ ] Build command tested locally (`npm run build`)
- [ ] No hardcoded API URLs in code
- [ ] All API calls use environment variable

## ✅ Render Setup (Backend)

- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Database connection details saved
- [ ] Web service created
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Health check endpoint responds

## ✅ Vercel Setup (Frontend)

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Website loads correctly

## ✅ Integration Testing

- [ ] Frontend can reach backend API
- [ ] CORS configured correctly
- [ ] Repository analysis works end-to-end
- [ ] Error messages display properly
- [ ] Loading states work correctly

## ✅ Post-Deployment

- [ ] Backend URL saved and documented
- [ ] Frontend URL saved and documented
- [ ] CORS_ALLOWED_ORIGINS updated with frontend URL
- [ ] Backend redeployed with updated CORS
- [ ] Monitoring set up (optional)
- [ ] Error logging configured (optional)

## ✅ Documentation

- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Production URLs shared with team
- [ ] Troubleshooting steps reviewed

---

## 🎉 Ready to Deploy!

If all items are checked, you're ready to deploy using the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 📞 Quick Links

- [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Reference](DEPLOYMENT_QUICKREF.md)
- [Generate SECRET_KEY](https://djecrety.ir/)
- [GROQ Console](https://console.groq.com/keys)
- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
