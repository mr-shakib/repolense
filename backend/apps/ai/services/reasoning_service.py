"""
AI Reasoning Service

Orchestrates AI-powered insight generation by:
1. Loading prompt templates
2. Injecting analysis data
3. Calling AI providers (Groq)
4. Validating and parsing responses
5. Returning structured insights
"""
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict

from apps.ai.providers import get_ai_provider, AIRequest, AIResponse
from apps.ai.providers.exceptions import (
    AIProviderError,
    AIResponseValidationError,
    AIResponseParsingError
)

logger = logging.getLogger(__name__)


@dataclass
class AIInsightResult:
    """Result of AI insight generation"""
    insight_type: str
    content: Dict[str, Any]
    model_used: str
    tokens_used: int
    input_tokens: int
    output_tokens: int
    processing_time_ms: float
    success: bool
    error_message: Optional[str] = None


class AIReasoningService:
    """Service for generating AI-powered insights from analysis data"""
    
    def __init__(self):
        self.ai_provider = get_ai_provider()
        self.prompts_dir = Path(__file__).parent.parent / 'prompts'
        self._prompt_cache = {}
        
    def _load_prompt_template(self, template_name: str) -> str:
        """Load prompt template from file with caching"""
        if template_name not in self._prompt_cache:
            template_path = self.prompts_dir / f"{template_name}.txt"
            
            if not template_path.exists():
                raise FileNotFoundError(
                    f"Prompt template not found: {template_path}"
                )
            
            with open(template_path, 'r', encoding='utf-8') as f:
                self._prompt_cache[template_name] = f.read()
                
        return self._prompt_cache[template_name]
    
    def _inject_data_into_prompt(
        self, 
        template: str, 
        data: Dict[str, Any]
    ) -> str:
        """Inject analysis data into prompt template"""
        prompt = template
        for key, value in data.items():
            placeholder = f"{{{key}}}"
            if placeholder in prompt:
                # Convert dict/list to pretty JSON string
                if isinstance(value, (dict, list)):
                    value_str = json.dumps(value, indent=2)
                else:
                    value_str = str(value)
                prompt = prompt.replace(placeholder, value_str)
        return prompt
    
    def _validate_json_response(self, content: str) -> Dict[str, Any]:
        """Validate and parse JSON response from AI"""
        try:
            # Try to parse as JSON
            return json.loads(content)
        except json.JSONDecodeError as e:
            # Try to extract JSON from markdown code blocks
            if '```json' in content:
                start = content.find('```json') + 7
                end = content.find('```', start)
                if end != -1:
                    try:
                        return json.loads(content[start:end].strip())
                    except json.JSONDecodeError:
                        pass
            
            raise AIResponseParsingError(
                f"Failed to parse AI response as JSON: {str(e)}"
            )
    
    def _generate_insight(
        self,
        template_name: str,
        data: Dict[str, Any],
        insight_type: str,
        temperature: float = 0.7,
        max_tokens: int = 4000
    ) -> AIInsightResult:
        """Generate AI insight using template and data"""
        import time
        start_time = time.time()
        
        try:
            # Load and prepare prompt
            template = self._load_prompt_template(template_name)
            prompt = self._inject_data_into_prompt(template, data)
            
            # Create AI request
            request = AIRequest(
                prompt=prompt,
                system_prompt=(
                    "You are an expert software engineering analyst. "
                    "Provide detailed, actionable insights based ONLY on "
                    "the provided data. Return valid JSON matching the "
                    "specified schema exactly."
                ),
                temperature=temperature,
                max_tokens=max_tokens,
                response_format="json_object"
            )
            
            # Call AI provider
            logger.info(f"Generating {insight_type} insights via AI")
            response: AIResponse = self.ai_provider.complete(request)
            
            # Validate response
            insight_content = self._validate_json_response(response.content)
            
            processing_time = (time.time() - start_time) * 1000
            
            return AIInsightResult(
                insight_type=insight_type,
                content=insight_content,
                model_used=response.model,
                tokens_used=response.tokens_used,
                input_tokens=response.input_tokens,
                output_tokens=response.output_tokens,
                processing_time_ms=processing_time,
                success=True
            )
            
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed to generate {insight_type} insights: {str(e)}"
            )
            
            return AIInsightResult(
                insight_type=insight_type,
                content={},
                model_used="",
                tokens_used=0,
                input_tokens=0,
                output_tokens=0,
                processing_time_ms=processing_time,
                success=False,
                error_message=str(e)
            )
    
    def generate_architecture_insights(
        self, 
        architecture_data: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate AI insights for architecture analysis"""
        return self._generate_insight(
            template_name="architecture_insights_v1",
            data={"architecture_data": architecture_data},
            insight_type="architecture"
        )
    
    def generate_quality_insights(
        self, 
        quality_data: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate AI insights for code quality analysis"""
        return self._generate_insight(
            template_name="quality_insights_v1",
            data={"quality_data": quality_data},
            insight_type="quality"
        )
    
    def generate_principles_insights(
        self, 
        principles_data: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate AI insights for principles evaluation"""
        return self._generate_insight(
            template_name="principles_insights_v1",
            data={"principles_data": principles_data},
            insight_type="principles"
        )
    
    def generate_collaboration_insights(
        self, 
        collaboration_data: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate AI insights for collaboration analysis"""
        return self._generate_insight(
            template_name="collaboration_insights_v1",
            data={"collaboration_data": collaboration_data},
            insight_type="collaboration"
        )
    
    def generate_executive_summary(
        self, 
        complete_analysis: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate executive summary with hiring recommendation"""
        return self._generate_insight(
            template_name="executive_summary_v1",
            data={"complete_analysis": complete_analysis},
            insight_type="executive_summary",
            temperature=0.5,  # Lower temp for more consistent summaries
            max_tokens=5000   # Longer for comprehensive summary
        )
    
    def generate_developer_guide(
        self, 
        complete_analysis: Dict[str, Any]
    ) -> AIInsightResult:
        """Generate personalized developer improvement guide"""
        return self._generate_insight(
            template_name="developer_guide_v1",
            data={"complete_analysis": complete_analysis},
            insight_type="developer_guide",
            temperature=0.8,  # Higher temp for more creative advice
            max_tokens=5000
        )
    
    def generate_all_insights(
        self,
        architecture_data: Dict[str, Any],
        quality_data: Dict[str, Any],
        principles_data: Dict[str, Any],
        collaboration_data: Dict[str, Any]
    ) -> Dict[str, AIInsightResult]:
        """
        Generate all AI insights for a complete repository analysis
        
        Returns dict with keys: architecture, quality, principles, 
        collaboration, executive_summary, developer_guide
        """
        logger.info("Starting comprehensive AI insight generation")
        
        # Generate individual insights
        architecture_insight = self.generate_architecture_insights(
            architecture_data
        )
        quality_insight = self.generate_quality_insights(quality_data)
        principles_insight = self.generate_principles_insights(
            principles_data
        )
        collaboration_insight = self.generate_collaboration_insights(
            collaboration_data
        )
        
        # Prepare complete analysis for summary generation
        complete_analysis = {
            "architecture": architecture_data,
            "quality": quality_data,
            "principles": principles_data,
            "collaboration": collaboration_data,
            "ai_insights": {
                "architecture": architecture_insight.content 
                    if architecture_insight.success else {},
                "quality": quality_insight.content 
                    if quality_insight.success else {},
                "principles": principles_insight.content 
                    if principles_insight.success else {},
                "collaboration": collaboration_insight.content 
                    if collaboration_insight.success else {},
            }
        }
        
        # Generate executive summary and developer guide
        executive_summary = self.generate_executive_summary(
            complete_analysis
        )
        developer_guide = self.generate_developer_guide(complete_analysis)
        
        results = {
            "architecture": architecture_insight,
            "quality": quality_insight,
            "principles": principles_insight,
            "collaboration": collaboration_insight,
            "executive_summary": executive_summary,
            "developer_guide": developer_guide
        }
        
        # Log summary
        success_count = sum(1 for r in results.values() if r.success)
        total_tokens = sum(r.tokens_used for r in results.values())
        total_time = sum(r.processing_time_ms for r in results.values())
        
        logger.info(
            f"AI insight generation complete: {success_count}/{len(results)} "
            f"successful, {total_tokens} tokens, "
            f"{total_time:.2f}ms total"
        )
        
        return results

