# 🏛️ RepoLense AI - Code Rules & Standards

**Last Updated**: February 6, 2026  
**Status**: MANDATORY - All code must follow these rules

---

## 📏 GOLDEN RULE: FILE SIZE LIMIT

### **MAXIMUM 150-200 LINES PER FILE**

Every file **MUST** stay within **150-200 lines of code** (excluding imports, blank lines, and docstrings).

#### Why This Matters
- **Readability**: Files beyond 200 lines become cognitive overhead
- **Single Responsibility**: Large files = multiple responsibilities = violation of SRP
- **Testability**: Small files are easier to test in isolation
- **Code Review**: Reviewers can understand files quickly
- **Maintainability**: Easier to refactor and modify

#### How to Enforce
```python
# ❌ BAD - 400 lines in one file
# analysis/analyzers.py (400 lines)

# ✅ GOOD - Split into focused files
# analysis/detectors/architecture_detector.py (150 lines)
# analysis/detectors/quality_analyzer.py (180 lines)
# analysis/detectors/principle_evaluator.py (160 lines)
```

#### When a File Gets Too Large
**IMMEDIATE ACTION REQUIRED:**
1. Identify distinct responsibilities
2. Extract into separate files
3. Use composition over inheritance
4. Create helper modules if needed

---

## 🏗️ ARCHITECTURE RULES

### Rule 1: Strict Layer Isolation
**Layers can only depend on layers below them, NEVER above.**

```python
# ❌ FORBIDDEN - Analysis layer importing from API layer
from apps.api.views import AnalysisView  # VIOLATION!

# ✅ CORRECT - Analysis layer is independent
from apps.analysis.data_classes import RepoStructure
```

**Dependency Direction (Top → Down ONLY):**
```
API Layer
   ↓ (can import)
Domain Layer
   ↓ (can import)
Analysis Layer
   ↓ (can import)
AI Layer
```

### Rule 2: No Business Logic in Views
Django views are **ONLY** for HTTP handling.

```python
# ❌ BAD - Logic in view
class AnalysisView(APIView):
    def post(self, request):
        repo_url = request.data['repo_url']
        # Analyzing here - WRONG!
        quality = analyze_quality(repo_url)
        return Response(quality)

# ✅ GOOD - Delegate to service
class AnalysisView(APIView):
    def post(self, request):
        serializer = AnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        service = AnalysisService()
        report = service.analyze_repository(
            repo_url=serializer.validated_data['repo_url']
        )
        
        return Response(ReportSerializer(report).data)
```

### Rule 3: Domain Services Are Framework-Agnostic
Services must **NEVER** import Django-specific code (except models).

```python
# ❌ BAD - Service depends on Django REST Framework
from rest_framework.response import Response

class AnalysisService:
    def analyze(self, data):
        return Response(...)  # WRONG!

# ✅ GOOD - Returns pure Python objects
class AnalysisService:
    def analyze(self, repo_url: str) -> Report:
        # Pure business logic
        return Report(...)
```

### Rule 4: Analysis Layer is Pure & Deterministic
No external dependencies (HTTP, database, AI) in analysis layer.

```python
# ❌ BAD - Analysis calling external services
class ArchitectureDetector:
    def detect(self, repo_url):
        response = requests.get(repo_url)  # VIOLATION!

# ✅ GOOD - Pure function with injected data
class ArchitectureDetector:
    def detect(self, repo_structure: RepoStructure) -> ArchitectureSignals:
        # Pure logic, no side effects
        return self._analyze_structure(repo_structure)
```

---

## 🤖 AI INTEGRATION RULES

### Rule 5: LLMs Receive Structured Data Only
**NEVER** send raw code to LLMs.

```python
# ❌ BAD - Sending entire codebase
prompt = f"Analyze this code:\n{entire_repo_code}"

# ✅ GOOD - Structured summary
structured_input = {
    "architecture_patterns": ["MVC", "Layered"],
    "quality_metrics": {
        "avg_file_length": 120,
        "complexity_score": 8.5
    },
    "principle_violations": [
        {"type": "SRP", "file": "user_service.py", "line": 45}
    ]
}
prompt = self.template.format(**structured_input)
```

### Rule 6: AI Responses Must Be Validated
All LLM outputs **MUST** match a JSON schema.

```python
# ✅ REQUIRED - Always validate
response = llm.complete(prompt)
validated = validate_json_schema(response, AIInsightsSchema)
if not validated.is_valid:
    raise AIResponseValidationError(validated.errors)
```

### Rule 7: Prompts Are Versioned Files
Never hardcode prompts in code.

```python
# ❌ BAD - Prompt in code
prompt = "Analyze this repository..."

# ✅ GOOD - Load from versioned file
prompt_loader = PromptLoader()
prompt = prompt_loader.load('analysis_v2.txt')
```

**Prompt File Structure:**
```
apps/ai/prompts/
├── analysis_v1.txt      # Deprecated
├── analysis_v2.txt      # Current
└── analysis_v3.txt      # Experimental
```

---

## 📦 FILE ORGANIZATION RULES

### Rule 8: One Class Per File (Preferred)
Each class should have its own file, unless tightly coupled.

```python
# ❌ AVOID - Multiple classes in one file
# analyzers.py
class ArchitectureDetector: ...
class QualityAnalyzer: ...
class PrincipleEvaluator: ...

# ✅ GOOD - Separate files
# detectors/architecture_detector.py
class ArchitectureDetector: ...

# detectors/quality_analyzer.py
class QualityAnalyzer: ...
```

### Rule 9: Data Classes in Separate Module
Keep data structures separate from logic.

```python
# ✅ CORRECT Structure
apps/analysis/
├── data_classes/
│   ├── repo_structure.py
│   ├── analysis_results.py
│   └── metrics.py
└── detectors/
    ├── architecture_detector.py
    └── quality_analyzer.py
```

### Rule 10: Fat Models, Thin Everything Else (BUT NOT TOO FAT)
Django models can contain business logic **IF ≤150 lines**.

```python
# ✅ ACCEPTABLE - Model with methods (within limit)
class Report(models.Model):
    score = models.FloatField()
    
    def is_passing(self) -> bool:
        return self.score >= 70.0
    
    def get_risk_level(self) -> str:
        if self.score < 50:
            return "HIGH"
        elif self.score < 70:
            return "MEDIUM"
        return "LOW"
```

---

## 🎯 NAMING CONVENTIONS

### Rule 11: Names Must Be Self-Documenting

#### Files
```python
# ❌ BAD
analyzer.py
utils.py
helpers.py

# ✅ GOOD
architecture_detector.py
collaboration_analyzer.py
openai_provider.py
```

#### Classes
```python
# ❌ BAD
class Analyzer: ...
class Manager: ...
class Handler: ...

# ✅ GOOD
class ArchitectureDetector: ...
class RepoIngestionService: ...
class AIReasoningService: ...
```

#### Functions/Methods
```python
# ❌ BAD
def process(data): ...
def handle(req): ...

# ✅ GOOD
def detect_architecture_patterns(repo_structure: RepoStructure) -> ArchitectureSignals:
    """
    Analyzes repository structure to identify architectural patterns.
    
    Args:
        repo_structure: Parsed repository file structure
        
    Returns:
        Detected patterns with confidence scores
    """
    ...
```

#### Variables
```python
# ❌ BAD
d = {}
temp = calculate()
x = get_repo()

# ✅ GOOD
quality_metrics = {}
architecture_confidence = calculate_confidence()
repo_structure = fetch_repository_structure()
```

---

## 📝 DOCUMENTATION RULES

### Rule 12: Every Module Must Have a Docstring

```python
"""
Repository ingestion service.

This module handles fetching and parsing GitHub repositories.
It extracts file structure, commit history, and contributor data.

Layer: Analysis Layer
Dependencies: GitPython, requests
External Calls: GitHub API
"""
```

### Rule 13: Every Public Function/Method Needs Docstring

```python
def analyze_repository(self, repo_url: str, user_type: str) -> Report:
    """
    Orchestrates full repository analysis workflow.
    
    This is the main entry point for repository analysis. It coordinates
    ingestion, deterministic analysis, AI reasoning, and scoring.
    
    Args:
        repo_url: GitHub repository URL (public repos only)
        user_type: Either 'recruiter' or 'developer' (affects report format)
        
    Returns:
        Complete analysis report with scores and insights
        
    Raises:
        InvalidRepoError: If repository URL is invalid or inaccessible
        AnalysisError: If analysis pipeline fails
        
    Example:
        >>> service = AnalysisService()
        >>> report = service.analyze_repository(
        ...     "https://github.com/user/repo",
        ...     "recruiter"
        ... )
    """
```

### Rule 14: Complex Logic Requires Inline Comments

```python
# Calculate weighted score with architecture as primary factor
# Architecture: 25%, Quality: 30%, Principles: 25%, Collaboration: 20%
final_score = (
    architecture_score * 0.25 +
    quality_score * 0.30 +
    principles_score * 0.25 +
    collaboration_score * 0.20
)
```

---

## ✅ TYPE HINTS RULES

### Rule 15: All Function Signatures Must Have Type Hints

```python
# ❌ BAD - No type hints
def analyze(repo, options):
    return something

# ✅ GOOD - Full type hints
def analyze_quality(
    repo_structure: RepoStructure,
    options: AnalysisOptions
) -> QualityMetrics:
    ...
```

### Rule 16: Use Data Classes for Complex Types

```python
# ✅ GOOD - Clear structure
from dataclasses import dataclass

@dataclass
class ArchitectureSignal:
    pattern: str
    confidence: float
    evidence: list[str]

@dataclass
class QualityMetrics:
    avg_file_length: int
    max_complexity: int
    duplication_percentage: float
```

---

## 🧪 TESTING RULES

### Rule 17: Every Service Must Have Unit Tests

```python
# tests/unit/test_architecture_detector.py
class TestArchitectureDetector:
    def test_detects_mvc_pattern(self):
        detector = ArchitectureDetector()
        repo = MockRepoStructure(folders=['models', 'views', 'controllers'])
        
        signals = detector.detect(repo)
        
        assert 'MVC' in [s.pattern for s in signals]
        assert signals[0].confidence > 0.7
```

### Rule 18: No Tests in Production Code
Test utilities belong in `tests/` directory only.

---

## 🚫 ANTI-PATTERNS TO AVOID

### Forbidden Pattern 1: God Classes
```python
# ❌ FORBIDDEN - One class doing everything
class RepositoryAnalyzer:
    def fetch_repo(self): ...
    def detect_architecture(self): ...
    def analyze_quality(self): ...
    def call_llm(self): ...
    def calculate_score(self): ...
    def generate_report(self): ...  # 600+ lines!
```

### Forbidden Pattern 2: Circular Dependencies
```python
# ❌ FORBIDDEN
# services/analysis_service.py
from apps.api.serializers import ReportSerializer

# api/serializers.py
from apps.domain.services import AnalysisService
```

### Forbidden Pattern 3: Magic Numbers
```python
# ❌ BAD
if score > 70:  # What does 70 mean?

# ✅ GOOD
PASSING_SCORE_THRESHOLD = 70.0
if score > PASSING_SCORE_THRESHOLD:
```

---

## 🔒 SECURITY RULES

### Rule 19: Never Commit Secrets
Use environment variables for all credentials.

```python
# ❌ BAD
OPENAI_API_KEY = "sk-..."

# ✅ GOOD
import os
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
```

### Rule 20: Validate All External Input
```python
# ✅ REQUIRED - Always validate
def analyze_repository(self, repo_url: str):
    if not self._is_valid_github_url(repo_url):
        raise InvalidRepoError(f"Invalid GitHub URL: {repo_url}")
```

---

## 📊 CODE REVIEW CHECKLIST

Before committing, verify:

- [ ] File is ≤200 lines
- [ ] No business logic in views
- [ ] No Django imports in domain/analysis layers
- [ ] All functions have type hints
- [ ] All public functions have docstrings
- [ ] No magic numbers
- [ ] No hardcoded secrets
- [ ] Layer boundaries respected
- [ ] Tests added for new functionality

---

## 🎓 LEARNING RESOURCES

When facing architectural decisions, reference:
- **Clean Architecture** (Uncle Bob Martin)
- **Domain-Driven Design** (Eric Evans)
- **Refactoring** (Martin Fowler)
- **Python Best Practices** (PEP 8, PEP 257)

---

## 🚨 ENFORCEMENT

**These rules are NOT optional.**

If you find yourself violating a rule:
1. **STOP**
2. Refactor immediately
3. Ask: "Why am I violating this rule?"
4. If the rule doesn't make sense, discuss with the team

**Remember**: This system will analyze code just like this. Practice what we preach.
