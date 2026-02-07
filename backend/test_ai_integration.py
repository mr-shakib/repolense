"""
Test AI Integration End-to-End

This script tests the complete AI-powered analysis workflow.
Run from backend directory: python test_ai_integration.py
"""

import os
import sys
import django

# Add backend to path and setup Django
sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables from .env.local
from pathlib import Path
from decouple import AutoConfig
env_path = Path(__file__).parent / '.env.local'
config = AutoConfig(search_path=str(env_path.parent))

# Set environment variables before Django setup
os.environ['GROQ_API_KEY'] = config('GROQ_API_KEY', default='')
os.environ['AI_PROVIDER'] = config('AI_PROVIDER', default='groq')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.domain.services import AnalysisService


def test_ai_integration():
    """Test AI integration with a small real repository"""
    
    print("=" * 70)
    print("REPOLENSE AI - AI INTEGRATION TEST")
    print("=" * 70)
    print()
    
    # Use a small, stable repository for testing
    test_repo = "https://github.com/github/gitignore"  # GitHub's own simple repo
    
    print(f"📦 Testing repository: {test_repo}")
    print()
    
    # Initialize service
    service = AnalysisService()
    
    print("⚙️  Starting analysis with AI insights generation...")
    print()
    
    try:
        # Run analysis (includes AI generation)
        analysis = service.analyze_repository(test_repo)
        
        print("✅ Analysis completed!")
        print(f"   Status: {analysis.status}")
        print(f"   Analysis ID: {analysis.id}")
        print()
        
        # Get report
        report = service.get_report(analysis.id)
        
        if report:
            print("=" * 70)
            print("📊 SCORES")
            print("=" * 70)
            print(f"   Overall Score:       {report.overall_score:.1f}/100")
            print(f"   Architecture Score:  {report.architecture_score:.1f}/100")
            print(f"   Quality Score:       {report.quality_score:.1f}/100")
            print(f"   Principles Score:    {report.principles_score:.1f}/100")
            print(f"   Collaboration Score: {report.collaboration_score:.1f}/100")
            print()
            
            print("=" * 70)
            print("🤖 AI INSIGHTS STATUS")
            print("=" * 70)
            
            # Check AI insights presence
            insights_keys = report.insights.keys() if report.insights else []
            print(f"   Dimensions analyzed: {', '.join(insights_keys) if insights_keys else 'None'}")
            print()
            
            # Check executive summary
            if report.ai_executive_summary:
                print("   ✅ Executive Summary: Generated")
                summary_preview = report.ai_executive_summary[:150]
                print(f"      Preview: {summary_preview}...")
            else:
                print("   ❌ Executive Summary: Missing")
            print()
            
            # Check developer guide
            if report.ai_developer_guide:
                print("   ✅ Developer Guide: Generated")
                guide_keys = list(report.ai_developer_guide.keys())[:3]
                print(f"      Sections: {', '.join(guide_keys)}...")
            else:
                print("   ❌ Developer Guide: Missing")
            print()
            
            # Check hiring recommendation
            if report.ai_hire_recommendation:
                print(f"   ✅ Hire Recommendation: {report.ai_hire_recommendation}")
            else:
                print("   ❌ Hire Recommendation: Missing")
            print()
            
            print("=" * 70)
            print("⚡ AI PERFORMANCE METRICS")
            print("=" * 70)
            print(f"   Total Tokens Used:    {report.ai_total_tokens or 0}")
            print(f"   Processing Time:      {report.ai_processing_time_ms or 0:.2f}ms")
            print(f"   Provider Used:        {report.ai_provider_used or 'Unknown'}")
            print()
            
            # Sample insight preview
            if 'architecture' in report.insights:
                arch_insight = report.insights['architecture']
                if 'pattern_justification' in arch_insight:
                    print("=" * 70)
                    print("🏗️  ARCHITECTURE INSIGHT SAMPLE")
                    print("=" * 70)
                    justification = arch_insight['pattern_justification']
                    print(f"   {justification.get('reasoning', 'N/A')[:200]}...")
                    print()
            
            print("=" * 70)
            print("✅ AI INTEGRATION TEST PASSED")
            print("=" * 70)
            
        else:
            print("❌ ERROR: Report not found")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    test_ai_integration()
