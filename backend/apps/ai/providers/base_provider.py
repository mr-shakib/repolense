"""
Base AI provider interface.

Abstract base class defining the contract for all AI providers.
Providers must implement the complete() method for LLM inference.

Layer: AI Layer
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class AIRequest:
    """
    Structured request to AI provider.
    
    Attributes:
        prompt: The prompt text to send to the LLM
        system_prompt: Optional system/role prompt
        temperature: Sampling temperature (0-1)
        max_tokens: Maximum tokens to generate
        response_format: Expected response format (text, json_object)
        model: Specific model to use (optional, uses provider default)
    """
    prompt: str
    system_prompt: Optional[str] = None
    temperature: float = 0.3
    max_tokens: int = 3000
    response_format: str = "json_object"
    model: Optional[str] = None


@dataclass
class AIResponse:
    """
    Structured response from AI provider.
    
    Attributes:
        content: The generated text content
        model: Model used for generation
        tokens_used: Total tokens consumed (input + output)
        input_tokens: Tokens in the prompt
        output_tokens: Tokens in the response
        finish_reason: Why generation stopped (stop, length, etc.)
        raw_response: Original response from provider
    """
    content: str
    model: str
    tokens_used: int
    input_tokens: int
    output_tokens: int
    finish_reason: str
    raw_response: Dict[str, Any]


class BaseAIProvider(ABC):
    """
    Abstract base class for AI providers.
    
    All AI providers (Groq, OpenAI, Anthropic) must implement this interface
    to ensure consistent behavior and easy swapping.
    """
    
    def __init__(self, api_key: str, **kwargs):
        """
        Initialize provider with API key and optional configuration.
        
        Args:
            api_key: API key for the provider
            **kwargs: Additional provider-specific configuration
        """
        self.api_key = api_key
        self.config = kwargs
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the name of this provider (e.g., 'groq', 'openai')."""
        pass
    
    @property
    @abstractmethod
    def default_model(self) -> str:
        """Return the default model to use for this provider."""
        pass
    
    @abstractmethod
    def complete(self, request: AIRequest) -> AIResponse:
        """
        Generate completion from the AI provider.
        
        Args:
            request: AIRequest object with prompt and configuration
            
        Returns:
            AIResponse object with generated content and metadata
            
        Raises:
            AIProviderError: On any provider-specific error
            AIProviderConnectionError: On connection failures
            AIProviderTimeoutError: On request timeout
            AIProviderRateLimitError: On rate limit exceeded
            AIProviderAuthenticationError: On invalid API key
        """
        pass
    
    def validate_json_response(self, content: str) -> Dict[str, Any]:
        """
        Validate and parse JSON response from AI.
        
        Args:
            content: JSON string from AI response
            
        Returns:
            Parsed JSON as dictionary
            
        Raises:
            AIResponseParsingError: If JSON is invalid
        """
        import json
        from .exceptions import AIResponseParsingError
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            raise AIResponseParsingError(f"Failed to parse JSON response: {e}")
    
    def count_tokens(self, text: str) -> int:
        """
        Estimate token count for text.
        
        Simple estimation: ~4 characters per token (rough approximation).
        Override in specific providers for more accurate counting.
        
        Args:
            text: Text to count tokens for
            
        Returns:
            Estimated token count
        """
        return len(text) // 4
