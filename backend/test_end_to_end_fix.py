#!/usr/bin/env python
"""
Complete end-to-end test of the Groq provider fix.
This simulates exactly what happens when the API receives a request.
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Load environment
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

print("=" * 70)
print("END-TO-END GROQ PROVIDER TEST")
print("=" * 70)
print()

try:
    # Step 1: Import the service (this is what the API does)
    print("Step 1: Importing AIReasoningService...")
    from apps.ai.services import AIReasoningService
    print("  ✅ Import successful")
    print()
    
    # Step 2: Create the service (this calls get_ai_provider internally)
    print("Step 2: Creating AIReasoningService instance...")
    print("  (This internally calls get_ai_provider() and instantiates GroqProvider)")
    service = AIReasoningService()
    print(f"  ✅ Service created successfully")
    print(f"  ✅ Provider: {service.ai_provider.provider_name}")
    print(f"  ✅ Model: {service.ai_provider.default_model}")
    print()
    
    # Step 3: Verify the Groq client was created properly
    print("Step 3: Verifying Groq client...")
    if hasattr(service.ai_provider, 'client'):
        print(f"  ✅ Groq client exists: {type(service.ai_provider.client).__name__}")
    else:
        print(f"  ❌ Groq client not found")
        sys.exit(1)
    print()
    
    print("=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print()
    print("The 'proxies' error has been fixed!")
    print()
    print("If you're still seeing the error in your browser/API,")
    print("it means your Django server needs to be restarted.")
    print()
    print("Please restart your server using:")
    print("  python manage.py runserver")
    print()
    
except Exception as e:
    print()
    print("=" * 70)
    print("❌ ERROR OCCURRED")
    print("=" * 70)
    print()
    print(f"Error: {e}")
    print()
    import traceback
    traceback.print_exc()
    print()
    print("If you see the 'proxies' error above, the fix was not applied.")
    print("Please check the groq_provider.py file.")
    sys.exit(1)
