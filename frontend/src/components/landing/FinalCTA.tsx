'use client';

import { Section, Button } from '@/components/ui';

export default function FinalCTA() {
    return (
        <Section className="bg-white">
            <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Ready to analyze your repository?
                </h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    Get deep insights in under 2 minutes. No signup required.
                </p>

                <Button
                    href="/analyze"
                    variant="primary"
                    size="lg"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    }
                >
                    Start Analysis
                </Button>
            </div>
        </Section>
    );
}
