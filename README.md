# 🔍 RepoLense AI

A production-grade SaaS platform that analyzes GitHub repositories for software architecture, code quality, engineering principles, and collaboration patterns.

## 🎯 Target Users

1. **Recruiters** - Evaluate engineering candidates objectively
2. **Developers** - Analyze and improve their repositories

## 🏗️ Architecture

This is a **Clean Architecture** implementation with strict layer isolation:

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Django 5 + Django REST Framework
- **AI Layer**: LLM integration with structured I/O
- **Analysis Layer**: Deterministic code analysis

## 📁 Project Structure

```
repolense-ai/
├── backend/          # Django REST API
├── frontend/         # Next.js application
├── docs/            # Architecture & API documentation
└── rules.md         # Code standards (MANDATORY READ)
```

## 🚀 Quick Start

### Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

## 📖 Key Principles

1. **150-200 lines max per file** - Enforced strictly
2. **Clean Architecture** - Layers depend downward only
3. **AI as Plugin** - Deterministic analysis first, LLM reasoning second
4. **Framework Agnostic Domain** - Business logic independent of Django/Next.js
5. **Type Safety** - Full TypeScript + Python type hints

## 📚 Documentation

- [Architecture Design](docs/architecture/)
- [API Documentation](docs/api/)
- [Code Rules](rules.md) - **READ THIS FIRST**

## 🧪 Testing

```powershell
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

Ready to deploy to production? Follow our step-by-step guide:

**📖 [Complete Deployment Guide](DEPLOYMENT_GUIDE.md)**

**Quick Reference:**
- **Frontend:** Vercel (Free)
- **Backend:** Render (Free for 90 days, then $7/month)
- **Database:** PostgreSQL on Render

See [DEPLOYMENT_QUICKREF.md](DEPLOYMENT_QUICKREF.md) for environment variables and commands.

## 🤝 Contributing

Before contributing, **READ** [rules.md](rules.md) - all code must follow these standards.

## 📄 License

MIT License - See LICENSE file

---

**Built with Clean Architecture principles. This system practices what it preaches.**
