# Getting Started Guide - RepoLense AI

## 📋 Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher (or use SQLite for development)
- **Git**: For repository analysis
- **Redis**: For Celery (optional for MVP)

---

## 🚀 Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd backend
```

### 2. Create Virtual Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

### 3. Install Dependencies

```powershell
pip install -r requirements/development.txt
```

### 4. Configure Environment

```powershell
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# At minimum, set:
# - SECRET_KEY (generate a random string)
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
```

### 5. Database Setup

**Option A: PostgreSQL (Recommended)**

```powershell
# Create database
psql -U postgres
CREATE DATABASE repo_analyzer;
\q

# Update .env with your PostgreSQL credentials
```

**Option B: SQLite (Quick Start)**

Edit `config/settings/development.py` and uncomment the SQLite configuration.

### 6. Run Migrations

```powershell
python manage.py migrate
```

### 7. Create Superuser (Optional)

```powershell
python manage.py createsuperuser
```

### 8. Start Development Server

```powershell
python manage.py runserver
```

Backend should now be running at `http://localhost:8000`

### 9. Test the API

```powershell
# Test health endpoint
curl http://localhost:8000/api/health/
```

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```powershell
cd frontend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment

```powershell
# Copy example env file
cp .env.example .env.local

# Should contain:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 4. Start Development Server

```powershell
npm run dev
```

Frontend should now be running at `http://localhost:3000`

---

## ✅ Verify Installation

1. Backend health check: `http://localhost:8000/api/health/`
2. Frontend: `http://localhost:3000`
3. Django admin: `http://localhost:8000/admin/`

---

## 🧪 Running Tests

### Backend Tests

```powershell
cd backend
pytest
```

### Frontend Tests

```powershell
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'decouple'`

**Solution**: Ensure virtual environment is activated and dependencies installed

```powershell
.\venv\Scripts\Activate
pip install -r requirements/development.txt
```

### Issue: Database connection refused

**Solution**: Ensure PostgreSQL is running or use SQLite

### Issue: Port 8000 already in use

**Solution**: Kill the process or use a different port

```powershell
python manage.py runserver 8001
```

---

## 📚 Next Steps

After setup, read:
1. [System Architecture](architecture/SYSTEM_ARCHITECTURE.md)
2. [Code Rules](../rules.md) - **MANDATORY**
3. [API Documentation](api/) - Coming soon

---

## 🤝 Development Workflow

1. **READ** [rules.md](../rules.md) before writing code
2. Ensure files stay under 150-200 lines
3. Write tests for new features
4. Follow layer isolation rules
5. Document your code

---

**Happy coding! Remember: We build this system with the same standards it will analyze.**
