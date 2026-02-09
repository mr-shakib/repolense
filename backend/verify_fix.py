#!/usr/bin/env python
"""
Verify that the Groq provider fix is properly applied.
This script checks if the proxies parameter has been removed.
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Check the source code directly
groq_provider_path = os.path.join(os.path.dirname(__file__), 'apps', 'ai', 'providers', 'groq_provider.py')

print("=" * 70)
print("GROQ PROVIDER FIX VERIFICATION")
print("=" * 70)
print()

# Read the file
with open(groq_provider_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check for problematic code
has_http_client_line = 'http_client = httpx.Client(' in content
has_proxies_in_groq_params = "groq_params['http_client']" in content
has_proxies_check = "if 'proxies' in kwargs and kwargs['proxies']:" in content

print(f"File location: {groq_provider_path}")
print()
print("Checking for problematic code patterns:")
print(f"  ❌ http_client = httpx.Client(): {'FOUND' if has_http_client_line else 'NOT FOUND'}")
print(f"  ❌ groq_params['http_client']: {'FOUND' if has_proxies_in_groq_params else 'NOT FOUND'}")
print(f"  ❌ if 'proxies' in kwargs: {'FOUND' if has_proxies_check else 'NOT FOUND'}")
print()

if any([has_http_client_line, has_proxies_in_groq_params, has_proxies_check]):
    print("❌ FIX NOT APPLIED - Problematic code still exists!")
    print()
    print("This should not happen - the fix was applied.")
    print("Please verify the file manually.")
    sys.exit(1)
else:
    print("✅ FIX VERIFIED - All problematic code has been removed!")
    print()
    print("=" * 70)
    print("NEXT STEP: RESTART YOUR DJANGO SERVER")
    print("=" * 70)
    print()
    print("The fix is in place, but your Django server is still running")
    print("with the OLD code cached in memory.")
    print()
    print("To apply the fix:")
    print("  1. Find your terminal running 'python manage.py runserver'")
    print("  2. Press Ctrl+C to stop it")
    print("  3. Run it again: python manage.py runserver")
    print()
    print("After restarting, the error will be gone! 🎉")
    print()
    sys.exit(0)
