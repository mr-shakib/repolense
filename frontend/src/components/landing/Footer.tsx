'use client';

export default function Footer() {
    return (
        <footer className="relative bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-900">RepoLense</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8 text-sm">
                        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                            How it works
                        </a>
                        <a href="#what-we-analyze" className="text-gray-600 hover:text-gray-900 transition-colors">
                            What we analyze
                        </a>
                        <a href="/analyze" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Analyze
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} RepoLense AI
                    </p>
                </div>
            </div>
        </footer>
    );
}
