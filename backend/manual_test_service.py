"""
Manual test for AnalysisService logic.

Tests URL parsing and score calculation (without Django/database).
"""


def parse_repo_url(repo_url: str) -> tuple[str, str]:
    """Parse GitHub URL. Returns (owner, repo_name)."""
    url = repo_url.strip().rstrip('/')
    
    # Remove protocol and domain
    if url.startswith('https://github.com/'):
        url = url[19:]
    elif url.startswith('http://github.com/'):
        url = url[18:]
    elif url.startswith('github.com/'):
        url = url[11:]
    
    # Split into owner/repo
    parts = url.split('/')
    if len(parts) < 2:
        raise ValueError(f"Invalid GitHub URL: {repo_url}")
    
    return parts[0], parts[1].rstrip('.git')


def calc_overall_score(quality: float, principles: float, collaboration: float) -> float:
    """Calculate weighted overall score."""
    return quality * 0.40 + principles * 0.35 + collaboration * 0.25


def test():
    """Run all tests."""
    print("=" * 80)
    print("Testing URL Parsing")
    print("=" * 80)
    
    test_urls = [
        "https://github.com/django/django",
        "http://github.com/django/django",
        "github.com/django/django",
        "django/django",
        "https://github.com/facebook/react.git",
        "owner/repo",
    ]
    
    for url in test_urls:
        try:
            owner, repo_name = parse_repo_url(url)
            print(f"✓ {url:<45} -> {owner}/{repo_name}")
        except ValueError as e:
            print(f"✗ {url:<45} -> ERROR: {e}")
    
    print("\n" + "=" * 80)
    print("Testing Invalid URLs")
    print("=" * 80)
    
    invalid_urls = [
        "just_one_part",
        "https://github.com/",
        "",
    ]
    
    for url in invalid_urls:
        try:
            owner, repo_name = parse_repo_url(url)
            print(f"✗ {url:<45} -> Should have failed")
        except ValueError:
            print(f"✓ {url:<45} -> Correctly rejected")
    
    print("\n" + "=" * 80)
    print("Testing Score Calculation")
    print("=" * 80)
    
    test_cases = [
        (90.0, 90.0, 90.0, "High scores"),
        (50.0, 50.0, 50.0, "Medium scores"),
        (100.0, 0.0, 0.0, "High quality only"),
        (0.0, 100.0, 0.0, "High principles only"),
        (0.0, 0.0, 100.0, "High collaboration only"),
    ]
    
    for quality, principles, collab, desc in test_cases:
        overall = calc_overall_score(quality, principles, collab)
        print(f"{desc}: Quality={quality}, Principles={principles}, Collab={collab} -> Overall={overall:.1f}")
    
    print("\n" + "=" * 80)
    print("All tests completed!")
    print("=" * 80)


if __name__ == "__main__":
    test()
