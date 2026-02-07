'use client';

import { Section, Card } from '@/components/ui';

export default function ProblemStatement() {
    return (
        <Section className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    GitHub stars don't tell the whole story
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-12">
                    Resumes list technologies. READMEs promise features. But what about the architecture?
                    The engineering discipline? The collaboration patterns that separate good code from great code?
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card hover={false} className="text-left">
                        <div className="text-gray-400 mb-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Surface metrics</h3>
                        <p className="text-gray-600 text-sm">
                            Stars, forks, and commit counts reveal popularity—not quality.
                        </p>
                    </Card>

                    <Card hover={false} className="text-left">
                        <div className="text-gray-400 mb-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shallow reviews</h3>
                        <p className="text-gray-600 text-sm">
                            Manual code review is time-consuming and inconsistent.
                        </p>
                    </Card>

                    <Card hover={false} className="text-left">
                        <div className="text-gray-400 mb-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Missing context</h3>
                        <p className="text-gray-600 text-sm">
                            Resumes can't capture architectural thinking or engineering maturity.
                        </p>
                    </Card>
                </div>
            </div>
        </Section>
    );
}
