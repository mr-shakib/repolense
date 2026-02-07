'use client';

export default function Features() {
    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            title: 'Architecture Detection',
            description: 'Automatically identify patterns like MVC, Clean Architecture, Microservices, and more with confidence scoring.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Quality Metrics',
            description: 'Comprehensive maintainability scores, test coverage analysis, and technical debt identification.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            title: 'Best Practices',
            description: 'Evaluate SOLID principles, DRY patterns, and industry standards with actionable improvement roadmaps.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Team Insights',
            description: 'Analyze team dynamics, calculate bus factor, and receive data-driven hiring recommendations.',
        },
    ];

    return (
        <section className="py-24 px-6 sm:px-8 lg:px-12 relative bg-gray-50">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
                        Powerful <span className="text-gradient">Features</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to understand and improve your codebase
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 elevation-1 hover:elevation-3 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Icon */}
                            <div className="inline-flex p-3 rounded-xl bg-primary-100 text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Arrow */}
                            <div className="mt-4 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-sm font-semibold mr-2">Learn more</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
