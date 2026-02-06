# System Architecture Overview

## 🎯 Purpose

This document explains the overall system architecture, layer responsibilities, and design decisions for the RepoLense AI platform.

---

## 🏗️ Architecture Pattern

This system follows **Clean Architecture** (Uncle Bob Martin) combined with **Hexagonal Architecture** principles.

### Core Principles

1. **Dependency Inversion**: Outer layers depend on inner layers, never the reverse
2. **Framework Independence**: Business logic doesn't depend on Django or Next.js
3. **Testability**: Each layer can be tested in isolation
4. **Flexibility**: Easy to swap implementations (databases, LLMs, UI frameworks)

---

## 📊 Layer Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Presentation Layer                     │
│                   (Next.js Frontend)                      │
│  - User Interface                                         │
│  - State Management                                       │
│  - API Client                                             │
└───────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST
┌───────────────────────────────────────────────────────────┐
│                    API Gateway Layer                      │
│                 (Django REST Framework)                   │
│  - Request Validation                                     │
│  - Serialization                                          │
│  - Authentication                                         │
│  - HTTP Response Formatting                               │
└───────────────────────────────────────────────────────────┘
                         ↓ Function Calls
┌───────────────────────────────────────────────────────────┐
│                    Domain Logic Layer                     │
│              (Business Rules & Services)                  │
│  - Analysis Orchestration                                 │
│  - Workflow Coordination                                  │
│  - Business Rule Enforcement                              │
│  - Transaction Management                                 │
└───────────────────────────────────────────────────────────┘
                         ↓ Function Calls
┌───────────────────────────────────────────────────────────┐
│                    Analysis Layer                         │
│           (Deterministic Code Analysis)                   │
│  - Repository Ingestion                                   │
│  - Architecture Detection                                 │
│  - Code Quality Analysis                                  │
│  - Principle Evaluation                                   │
│  - Collaboration Analysis                                 │
└───────────────────────────────────────────────────────────┘
         ↓                                    ↓
┌────────────────────────┐    ┌────────────────────────────┐
│   AI Reasoning Layer   │    │     Scoring Layer          │
│   (LLM Integration)    │    │  (Score Calculation)       │
│  - Prompt Loading      │    │  - Weighted Scores         │
│  - LLM Calls           │    │  - Report Building         │
│  - Response Validation │    │  - Format Selection        │
└────────────────────────┘    └────────────────────────────┘
```

---

## 📦 Layer Details

### 1. API Gateway Layer (`apps/api/`)

**Responsibility**: Handle HTTP concerns only

**What it does:**
- Accepts HTTP requests
- Validates request data (using DRF serializers)
- Calls domain services
- Serializes responses to JSON
- Handles authentication/authorization

**What it does NOT do:**
- Business logic
- Data analysis
- Direct database access (except through models)
- LLM calls

**Example:**
```python
class AnalysisView(APIView):
    def post(self, request):
        # 1. Validate input
        serializer = AnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. Call domain service
        service = AnalysisService()
        report = service.analyze_repository(
            serializer.validated_data['repo_url']
        )
        
        # 3. Serialize and return
        return Response(ReportSerializer(report).data)
```

---

### 2. Domain Logic Layer (`apps/domain/`)

**Responsibility**: Orchestrate business workflows

**What it does:**
- Coordinates between multiple analyzers
- Enforces business rules
- Manages the analysis workflow
- Handles errors and retries

**What it does NOT do:**
- HTTP handling
- Know about Django views/serializers
- Perform actual analysis (delegates to analysis layer)
- Direct LLM calls (delegates to AI layer)

**Example:**
```python
class AnalysisService:
    def analyze_repository(self, repo_url: str) -> Report:
        # Orchestrate the entire workflow
        repo = self.ingestion.fetch(repo_url)
        architecture = self.arch_detector.detect(repo)
        quality = self.quality_analyzer.analyze(repo)
        ai_insights = self.ai_service.reason(architecture, quality)
        scores = self.scorer.calculate(architecture, quality, ai_insights)
        return self.report_builder.build(scores, ai_insights)
```

---

### 3. Analysis Layer (`apps/analysis/`)

**Responsibility**: Deterministic code analysis

**What it does:**
- Parses repository structures
- Counts metrics (lines, complexity)
- Detects patterns
- Extracts git metadata

**What it does NOT do:**
- Make judgments ("good" vs "bad")
- Call external APIs
- Access databases
- Use LLMs

**Example:**
```python
class ArchitectureDetector:
    def detect(self, repo_structure: RepoStructure) -> ArchitectureSignals:
        signals = []
        
        if self._has_mvc_structure(repo_structure):
            signals.append(ArchitectureSignal('MVC', confidence=0.85))
        
        if self._has_clean_arch_structure(repo_structure):
            signals.append(ArchitectureSignal('Clean', confidence=0.90))
        
        return ArchitectureSignals(signals)
```

---

### 4. AI Reasoning Layer (`apps/ai/`)

**Responsibility**: LLM integration with guardrails

**What it does:**
- Loads versioned prompts from files
- Sends structured data to LLMs
- Validates responses against JSON schemas
- Handles retries and errors

**What it does NOT do:**
- Receive raw code (only structured summaries)
- Make final scoring decisions
- Access databases directly

**Example:**
```python
class AIReasoningService:
    def reason(self, analysis_data: AnalysisData) -> AIInsights:
        # Load versioned prompt
        prompt = self.prompt_loader.load('analysis_v2.txt')
        
        # Fill with structured data
        filled_prompt = prompt.format(
            architecture=analysis_data.architecture,
            quality=analysis_data.quality
        )
        
        # Call LLM
        response = self.llm_provider.complete(filled_prompt)
        
        # Validate response
        validated = self.validator.validate(response, AIInsightsSchema)
        
        return AIInsights(**validated)
```

---

### 5. Scoring Layer (`apps/scoring/`)

**Responsibility**: Calculate scores and build reports

**What it does:**
- Applies weighted formulas
- Combines deterministic + AI insights
- Generates reports for different audiences

---

## 🔄 Data Flow Example

Let's trace a complete request:

**User Action**: Submits `https://github.com/user/repo` for analysis

```
1. FRONTEND (Next.js)
   └─> POST /api/analyze { "repo_url": "...", "user_type": "recruiter" }

2. API LAYER (Django View)
   └─> Validates request
   └─> Calls AnalysisService.analyze_repository()

3. DOMAIN LAYER (AnalysisService)
   └─> Calls RepoIngestionService.fetch()
   └─> Calls ArchitectureDetector.detect()
   └─> Calls QualityAnalyzer.analyze()
   └─> Calls PrincipleEvaluator.evaluate()
   └─> Calls CollaborationAnalyzer.analyze()
   └─> Prepares structured input for AI

4. AI LAYER (AIReasoningService)
   └─> Loads prompt template
   └─> Calls LLM with structured data
   └─> Validates JSON response

5. SCORING LAYER (ScoreEngine)
   └─> Calculates weighted scores
   └─> Builds report based on user_type

6. DOMAIN LAYER
   └─> Returns Report object to API layer

7. API LAYER
   └─> Serializes Report to JSON
   └─> Returns HTTP 200 with report data

8. FRONTEND
   └─> Displays report in UI
```

---

## 🚫 Anti-Patterns We Avoid

### ❌ Fat Controllers

```python
# BAD - Logic in view
class AnalysisView(APIView):
    def post(self, request):
        # 200 lines of business logic here...
```

### ❌ Anemic Domain Model

```python
# BAD - Just getters/setters, no logic
class Report:
    def get_score(self): return self.score
    def set_score(self, score): self.score = score
```

### ❌ God Classes

```python
# BAD - One class doing everything
class RepositoryAnalyzer:
    def fetch_repo(self): ...
    def analyze_architecture(self): ...
    def call_llm(self): ...
    def generate_report(self): ...  # 800 lines!
```

---

## ✅ Design Patterns We Use

1. **Service Layer Pattern** - Domain services orchestrate workflows
2. **Repository Pattern** - Data access abstraction (Django ORM)
3. **Strategy Pattern** - Different LLM providers (OpenAI, Anthropic)
4. **Builder Pattern** - Report construction
5. **Factory Pattern** - Creating analyzers

---

## 🔒 Security Considerations

1. **Input Validation** - All external input validated at API layer
2. **No Code Execution** - Never execute user-submitted code
3. **Rate Limiting** - Prevent abuse
4. **Secrets Management** - Environment variables only
5. **SQL Injection Prevention** - Django ORM handles this

---

## 📈 Scalability Path

Current: **Modular Monolith**  
Future: **Microservices** (if needed)

Easy extractions:
- Analysis Service → Separate microservice
- AI Reasoning → Separate microservice with queuing
- Scoring → Can be distributed

---

## 🎓 Key Takeaways

1. **Layers enforce separation of concerns**
2. **Dependencies flow downward only**
3. **Each layer has ONE clear responsibility**
4. **Business logic is framework-independent**
5. **Testing is straightforward due to isolation**

---

**This architecture ensures the system is maintainable, testable, and scalable.**
