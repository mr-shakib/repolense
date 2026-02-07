"""
AI Providers module.

Exports all AI providers and related classes for easy imports.

Usage:
    from apps.ai.providers import GroqProvider, AIRequest, AIResponse
"""

from .base_provider import BaseAIProvider, AIRequest, AIResponse
from .groq_provider import GroqProvider
from .exceptions import (
    AIProviderError,
    AIProviderConnectionError,
    AIProviderTimeoutError,
    AIProviderRateLimitError,
    AIProviderAuthenticationError,
    AIResponseValidationError,
    AIResponseParsingError,
)

import os
from typing import Optional


def get_ai_provider(
    provider_name: Optional[str] = None
) -> BaseAIProvider:
    """
    Factory function to get AI provider instance
    
    Args:
        provider_name: Provider to use (groq, openai, anthropic)
                      If None, reads from AI_PROVIDER env var
    
    Returns:
        Configured AI provider instance
        
    Raises:
        ValueError: If provider not supported or API key missing
    """
    if provider_name is None:
        provider_name = os.getenv('AI_PROVIDER', 'groq').lower()
    
    provider_name = provider_name.lower()
    
    if provider_name == 'groq':
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
        return GroqProvider(api_key=api_key)
    
    # Future providers can be added here
    # elif provider_name == 'openai':
    #     return OpenAIProvider(api_key=os.getenv('OPENAI_API_KEY'))
    # elif provider_name == 'anthropic':
    #     return AnthropicProvider(api_key=os.getenv('ANTHROPIC_API_KEY'))
    
    raise ValueError(
        f"Unsupported AI provider: {provider_name}. "
        f"Supported providers: groq"
    )


__all__ = [
    # Base classes
    'BaseAIProvider',
    'AIRequest',
    'AIResponse',
    
    # Providers
    'GroqProvider',
    
    # Factory function
    'get_ai_provider',
    
    # Exceptions
    'AIProviderError',
    'AIProviderConnectionError',
    'AIProviderTimeoutError',
    'AIProviderRateLimitError',
    'AIProviderAuthenticationError',
    'AIResponseValidationError',
    'AIResponseParsingError',
]
