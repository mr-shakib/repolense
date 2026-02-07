# RepoLense AI - Postman Testing Guide

## Prerequisites
1. Backend server running: `python manage.py runserver`
2. Database migrated: `python manage.py migrate`
3. Postman installed

---

## API Endpoints

### 1. Health Check
**GET** `http://localhost:8000/api/health/`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T12:00:00Z"
}
```

---

### 2. Start Repository Analysis (WITH AI)
**POST** `http://localhost:8000/api/analyze/`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "repository_url": "https://github.com/pallets/flask",
  "github_token": ""
}
```

**Response:**
```json
{
  "id": 1,
  "repository_url": "https://github.com/pallets/flask",
  "status": "pending",
  "status_display": "Pending",
  "overall_score": null,
  "started_at": "2026-02-07T12:00:00Z",
  "completed_at": null,
  "error_message": null
}
```

**Note:** This starts the full analysis pipeline including:
1. GitHub repository ingestion
2. Deterministic analysis (Architecture, Quality, Principles, Collaboration)
3. **AI insights generation (6 types)** ← NEW
4. Report creation with AI fields

**Processing time:** 60-90 seconds

---

### 3. Get Analysis Status
**GET** `http://localhost:8000/api/analyze/{id}/`

**Example:** `http://localhost:8000/api/analyze/1/`

**Response:**
```json
{
  "id": 1,
  "repository_url": "https://github.com/pallets/flask",
  "status": "completed",
  "status_display": "Completed",
  "overall_score": 75.5,
  "started_at": "2026-02-07T12:00:00Z",
  "completed_at": "2026-02-07T12:01:30Z",
  "error_message": null
}
```

**Status values:**
- `pending` - Queued
- `in_progress` - Running analysis
- `completed` - Finished successfully
- `failed` - Error occurred

---

### 4. Get Complete Report (WITH AI INSIGHTS)
**GET** `http://localhost:8000/api/reports/{analysis_id}/`

**Example:** `http://localhost:8000/api/reports/1/`

**Response Structure:**
```json
{
  "id": "uuid-here",
  "analysis": {
    "id": 1,
    "repository_url": "https://github.com/pallets/flask",
    "status": "completed",
    "overall_score": 75.5,
    "started_at": "2026-02-07T12:00:00Z",
    "completed_at": "2026-02-07T12:01:30Z"
  },
  
  "architecture_data": {
    "primary_pattern": "Layered Architecture",
    "confidence": 85.0,
    "signals": [
      {
        "pattern": "Layered Architecture",
        "confidence": 85.0,
        "indicators": ["app/ directory structure", "blueprints usage"]
      }
    ]
  },
  
  "quality_data": {
    "overall_quality_score": 75.5,
    "scores": {
      "overall": 75.5,
      "complexity": 70.0,
      "test_coverage": 80.0,
      "documentation": 75.0
    },
    "file_metrics": {
      "total_files": 150,
      "avg_lines_per_file": 120,
      "max_lines_in_file": 800
    }
  },
  
  "principles_data": {
    "principle_score": 79.5,
    "violations": [
      {"principle": "SRP", "count": 5},
      {"principle": "DRY", "count": 8}
    ]
  },
  
  "collaboration_data": {
    "collaboration_score": 47.5,
    "contributors_count": 25,
    "commits_count": 5000,
    "recent_activity": "Active"
  },
  
  "created_at": "2026-02-07T12:01:30Z"
}
```

---

## AI Fields in Report (NEW - Phase 4)

### Fields to Check:

1. **insights** (JSONField)
   - Contains AI insights for each dimension
   - Keys: `architecture`, `quality`, `principles`, `collaboration`

2. **ai_executive_summary** (TextField)
   - Single string with executive verdict
   - Example: "This is a well-maintained production-ready Flask web framework..."

3. **ai_developer_guide** (JSONField)
   - Personalized improvement roadmap
   - Contains: `developer_message`, `improvement_roadmap`, `quick_wins`, etc.

4. **ai_hire_recommendation** (CharField)
   - Values: "Strong Yes", "Yes", "Maybe", "No", "Strong No"

5. **ai_confidence_score** (Float)
   - 0.0 to 1.0

6. **ai_processing_time_ms** (Float)
   - AI generation time in milliseconds
   - Example: 60000 (60 seconds)

7. **ai_total_tokens** (Integer)
   - Total tokens used
   - Example: 20234

8. **ai_provider_used** (CharField)
   - Example: "groq"

---

## Testing Workflow

### Scenario 1: Quick Test with Small Repo
```
1. POST /api/analyze/
   Body: {"repository_url": "https://github.com/octocat/Hello-World"}
   
2. Wait 60-90 seconds (watch terminal logs)

3. GET /api/analyze/1/
   Check status = "completed"
   
4. GET /api/reports/1/
   Verify AI fields are populated:
   - insights.architecture exists
   - ai_hire_recommendation has value
   - ai_total_tokens > 0
```

### Scenario 2: Test with Medium Repo
```
1. POST /api/analyze/
   Body: {"repository_url": "https://github.com/pallets/flask"}
   
2. Monitor progress in terminal:
   - "Ingesting repository..."
   - "Running architecture detection..."
   - "Generating AI insights..."
   
3. GET /api/reports/1/
   Check comprehensive AI insights
```

### Scenario 3: Test Error Handling
```
1. POST /api/analyze/
   Body: {"repository_url": "https://github.com/invalid/nonexistent"}
   
2. GET /api/analyze/1/
   Check status = "failed"
   Check error_message contains useful info
```

---

## Expected AI Response Examples

### Architecture Insights
```json
{
  "pattern_justification": {
    "pattern_name": "Clean Architecture",
    "why_detected": "Clear separation between API, Domain, and Analysis layers",
    "confidence_reasoning": "Strong indicators: dependency inversion, layer isolation"
  },
  "quality_assessment": {
    "layering_score": 85,
    "dependency_management": "Excellent",
    "scalability_potential": "High"
  },
  "recommendations": [
    {
      "priority": "HIGH",
      "category": "Architecture",
      "title": "Implement API versioning",
      "description": "Add /v1/ prefix to API routes",
      "impact": "HIGH",
      "effort": "LOW"
    }
  ]
}
```

### Executive Summary
```json
{
  "tldr": "Strong backend project with clean architecture and good practices",
  "overall_assessment": {
    "grade": "B+",
    "confidence": "High",
    "one_line_summary": "Production-ready codebase with minor improvement areas"
  },
  "candidate_assessment": {
    "technical_capability": "Senior",
    "hire_recommendation": "Yes",
    "reasoning": "Demonstrates strong architectural thinking and code quality discipline"
  }
}
```

---

## Terminal Logs to Watch

When analysis runs, you'll see:
```
Starting analysis for: https://github.com/pallets/flask
Ingesting repository...
Repository ingested: 150 files, 25 contributors
Running architecture detection...
Architecture detected: Layered Architecture (85% confidence)
Running quality analysis...
Quality score: 75.5
Running principles evaluation...
Principles score: 79.5
Running collaboration analysis...
Collaboration score: 47.5
Generating AI insights...  ← NEW
Generating architecture insights via AI
HTTP Request: POST https://api.groq.com/openai/v1/chat/completions "200 OK"
Generating quality insights via AI
HTTP Request: POST https://api.groq.com/openai/v1/chat/completions "200 OK"
...
AI insight generation complete: 6/6 successful, 20234 tokens
Analysis complete! Report created.
```

---

## Troubleshooting

### Error: "GROQ_API_KEY not set"
- Check `backend/.env` or `backend/.env.local`
- Ensure: `GROQ_API_KEY=gsk_...`

### Error: "No module named 'groq'"
- Run: `pip install -r requirements.txt`

### Error: "Repository not found"
- Check repository is public
- Verify URL format: `https://github.com/owner/repo`

### AI Generation Taking Too Long
- Normal: 60-90 seconds for complete analysis
- Groq API rate limits: May retry with backoff (watch logs)

### AI Fields Empty in Response
- Check if analysis status = "completed"
- Check terminal logs for AI generation errors
- Verify GROQ_API_KEY is valid

---

## Performance Benchmarks

**Small Repo (< 50 files):**
- Ingestion: 5 seconds
- Analysis: 5 seconds
- AI Generation: 60 seconds
- **Total: ~70 seconds**

**Medium Repo (50-200 files):**
- Ingestion: 10 seconds
- Analysis: 10 seconds
- AI Generation: 60 seconds
- **Total: ~80 seconds**

**Large Repo (200+ files):**
- Ingestion: 15 seconds
- Analysis: 15 seconds
- AI Generation: 60 seconds
- **Total: ~90 seconds**

---

## Success Criteria Checklist

✅ Health endpoint returns 200  
✅ Analysis starts successfully (status = "pending")  
✅ Status updates to "in_progress" then "completed"  
✅ Report includes all dimension scores  
✅ **AI insights populated in report** ← KEY  
✅ **ai_hire_recommendation has value** ← KEY  
✅ **ai_total_tokens > 15000** ← KEY  
✅ Processing time < 120 seconds  
✅ No errors in terminal logs

---

**Ready to test!** Start the backend and try these endpoints in Postman.
