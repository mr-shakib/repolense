"""
AI provider exceptions.

Custom exceptions for AI provider errors and validation failures.

Layer: AI Layer
"""


class AIProviderError(Exception):
    """Base exception for AI provider errors."""
    pass


class AIProviderConnectionError(AIProviderError):
    """Raised when unable to connect to AI provider."""
    pass


class AIProviderTimeoutError(AIProviderError):
    """Raised when AI provider request times out."""
    pass


class AIProviderRateLimitError(AIProviderError):
    """Raised when AI provider rate limit is exceeded."""
    pass


class AIProviderAuthenticationError(AIProviderError):
    """Raised when AI provider authentication fails."""
    pass


class AIResponseValidationError(AIProviderError):
    """Raised when AI response fails schema validation."""
    pass


class AIResponseParsingError(AIProviderError):
    """Raised when unable to parse AI response as JSON."""
    pass
