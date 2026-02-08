"""
Groq AI provider implementation.

Groq provides ultra-fast LLM inference using LPU (Language Processing Unit).
Models: llama-3.3-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it

Layer: AI Layer
Dependencies: groq Python SDK
External Calls: Groq API (https://api.groq.com)
"""

import time
from typing import Optional, Dict, Any
import httpx
from groq import Groq, GroqError
from .base_provider import BaseAIProvider, AIRequest, AIResponse
from .exceptions import (
    AIProviderError,
    AIProviderConnectionError,
    AIProviderTimeoutError,
    AIProviderRateLimitError,
    AIProviderAuthenticationError,
)


class GroqProvider(BaseAIProvider):
    """
    Groq AI provider for ultra-fast inference.
    
    Groq specializes in extremely fast inference (hundreds of tokens/second)
    using their LPU architecture. Ideal for real-time applications.
    
    Supported Models:
        - llama-3.3-70b-versatile: Best quality, 128k context
        - mixtral-8x7b-32768: Fast, good quality, 32k context
        - gemma2-9b-it: Fastest, good for simple tasks
    """
    
    DEFAULT_MODEL = "llama-3.3-70b-versatile"
    TIMEOUT_SECONDS = 30
    MAX_RETRIES = 3
    
    def __init__(self, api_key: str, **kwargs):
        """
        Initialize Groq provider.
        
        Args:
            api_key: Groq API key (from https://console.groq.com)
            **kwargs: Optional configuration (timeout, max_retries, default_model, proxies, base_url)
        """
        self.api_key = api_key
        self.timeout = kwargs.get('timeout', self.TIMEOUT_SECONDS)
        self.max_retries = kwargs.get('max_retries', self.MAX_RETRIES)
        self._default_model = kwargs.get('default_model', self.DEFAULT_MODEL)
        
        # Build Groq client initialization parameters
        groq_params: Dict[str, Any] = {
            'api_key': api_key,
        }
        
        # Handle optional base_url
        if 'base_url' in kwargs:
            groq_params['base_url'] = kwargs['base_url']
        
        # Handle proxies by creating a custom httpx client
        # Note: Groq doesn't accept 'proxies' directly, must use http_client
        if 'proxies' in kwargs and kwargs['proxies']:
            proxies = kwargs['proxies']
            http_client = httpx.Client(proxy=proxies)
            groq_params['http_client'] = http_client
        
        # Initialize Groq client with proper parameters
        self.client = Groq(**groq_params)
    
    @property
    def provider_name(self) -> str:
        """Return provider name."""
        return "groq"
    
    @property
    def default_model(self) -> str:
        """Return default model."""
        return self._default_model
    
    def complete(self, request: AIRequest) -> AIResponse:
        """
        Generate completion using Groq API.
        
        Args:
            request: AIRequest with prompt and configuration
            
        Returns:
            AIResponse with generated content and metadata
            
        Raises:
            AIProviderError: On Groq-specific errors
        """
        model = request.model or self.default_model
        
        # Build messages
        messages = []
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})
        messages.append({"role": "user", "content": request.prompt})
        
        # Attempt completion with retries
        for attempt in range(self.max_retries):
            try:
                start_time = time.time()
                
                # Call Groq API
                completion = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    response_format={"type": request.response_format},
                    timeout=self.timeout,
                )
                
                processing_time = time.time() - start_time
                
                # Extract response data
                choice = completion.choices[0]
                usage = completion.usage
                
                return AIResponse(
                    content=choice.message.content,
                    model=completion.model,
                    tokens_used=usage.total_tokens,
                    input_tokens=usage.prompt_tokens,
                    output_tokens=usage.completion_tokens,
                    finish_reason=choice.finish_reason,
                    raw_response={
                        "id": completion.id,
                        "created": completion.created,
                        "processing_time": processing_time,
                        "system_fingerprint": getattr(completion, 'system_fingerprint', None),
                    }
                )
                
            except GroqError as e:
                error_message = str(e)
                
                # Handle specific error types
                if "authentication" in error_message.lower() or "api key" in error_message.lower():
                    raise AIProviderAuthenticationError(f"Groq authentication failed: {error_message}")
                
                if "rate limit" in error_message.lower() or "quota" in error_message.lower():
                    if attempt < self.max_retries - 1:
                        wait_time = 2 ** attempt  # Exponential backoff
                        time.sleep(wait_time)
                        continue
                    raise AIProviderRateLimitError(f"Groq rate limit exceeded: {error_message}")
                
                if "timeout" in error_message.lower():
                    raise AIProviderTimeoutError(f"Groq request timed out: {error_message}")
                
                if "connection" in error_message.lower() or "network" in error_message.lower():
                    if attempt < self.max_retries - 1:
                        time.sleep(1)
                        continue
                    raise AIProviderConnectionError(f"Groq connection failed: {error_message}")
                
                # Generic error
                raise AIProviderError(f"Groq API error: {error_message}")
            
            except Exception as e:
                raise AIProviderError(f"Unexpected error calling Groq: {str(e)}")
        
        # Should never reach here, but just in case
        raise AIProviderError(f"Failed after {self.max_retries} retries")
