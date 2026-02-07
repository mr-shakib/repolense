'use client';

import { Section } from '@/components/ui';

const principles = [
    'Deterministic analysis runs first—pattern detection, metrics, heuristics',
    'AI receives structured summaries, not raw code',
    'Every score is explainable and traceable to evidence',
    'No black boxes. No hallucinations. No magic.',
];

export default function TrustPhilosophy() {
    return (
        <Section className="bg-white">
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Built on trust
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our methodology is transparent, deterministic-first, and designed for engineers who value precision.
                    </p>
                </div>

                <div className="space-y-4">
                    {principles.map((principle, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                                {index + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {principle}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600 text-center italic">
                        "We analyze code the way senior engineers do: systematically, with clear criteria, and with evidence to back every claim."
                    </p>
                </div>
            </div>
        </Section>
    );
}
