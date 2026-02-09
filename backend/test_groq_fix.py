#!/usr/bin/env python
"""
Quick test to verify Groq provider works without proxies error.
Run this from backend directory: python test_groq_fix.py
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables
from pathlib import Path
from decouple import AutoConfig
env_path = Path(__file__).parent / '.env.local'
if env_path.exists():
    config = AutoConfig(search_path=str(env_path.parent))
    os.environ['GROQ_API_KEY'] = config('GROQ_API_KEY', default='')
    os.environ['AI_PROVIDER'] = config('AI_PROVIDER', default='groq')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from apps.ai.providers import get_ai_provider, AIRequest

def test_groq_provider():
    """Test that GroqProvider initializes without proxies error"""
    print("Testing Groq Provider...")
    print("-" * 50)
    
    try:
        # Test 1: Create provider
        print("✓ Step 1: Creating Groq provider...")
        provider = get_ai_provider('groq')
        print(f"  ✓ Provider: {provider.provider_name}")
        print(f"  ✓ Model: {provider.default_model}")
        print(f"  ✓ API Key: {'***' + provider.api_key[-4:] if provider.api_key else 'NOT SET'}")
        
        # Test 2: Create a simple request (don't actually call API)
        print("\n✓ Step 2: Creating AI request...")
        request = AIRequest(
            prompt="Test prompt",
            system_prompt="You are a helpful assistant",
            temperature=0.3,
            max_tokens=100
        )
        print(f"  ✓ Request created successfully")
        
        print("\n" + "=" * 50)
        print("✅ ALL TESTS PASSED!")
        print("=" * 50)
        print("\nThe 'proxies' error has been fixed.")
        print("Please restart your Django server to pick up the changes:")
        print("  1. Stop the current server (Ctrl+C)")
        print("  2. Run: python manage.py runserver")
        print()
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = test_groq_provider()
    sys.exit(0 if success else 1)
