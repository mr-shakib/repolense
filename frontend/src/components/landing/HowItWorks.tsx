'use client';

import { Section } from '@/components/ui';
import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Repository ingestion',
        description: 'We clone and parse your repository structure, commit history, and file organization.',
    },
    {
        number: '02',
        title: 'Deterministic analysis',
        description: 'Pattern detection, complexity metrics, and principle evaluation—no guesswork.',
    },
    {
        number: '03',
        title: 'AI reasoning',
        description: 'Structured insights are synthesized by AI to provide context and recommendations.',
    },
    {
        number: '04',
        title: 'Explainable report',
        description: 'Every score is backed by evidence. Every insight is traceable to source code.',
    },
];

export default function HowItWorks() {
    return (
        <Section className="bg-white">
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Four steps. Deterministic-first. AI-assisted.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 font-bold text-lg flex items-center justify-center">
                                        {step.number}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connecting line (except for last item in each column) */}
                            {index < steps.length - 2 && (
                                <div className="absolute left-6 top-12 w-px h-full bg-gray-200 -z-10 hidden md:block" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
