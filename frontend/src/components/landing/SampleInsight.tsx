'use client';

import { Section, CodePreview } from '@/components/ui';

const sampleCode = `{
  "architecture": {
    "pattern": "Clean Architecture",
    "confidence": 0.87,
    "evidence": [
      "Clear separation: domain/, application/, infrastructure/",
      "Dependency inversion detected in 12 modules",
      "No circular dependencies found"
    ]
  },
  "quality_score": 8.2,
  "insights": [
    "Strong adherence to Single Responsibility Principle",
    "Consistent naming conventions across codebase",
    "Well-documented public APIs"
  ]
}`;

export default function SampleInsight() {
    return (
        <Section id="sample-insight" className="bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        See what you get
                    </h2>
                    <p className="text-lg text-gray-600">
                        Structured insights with evidence and explainability
                    </p>
                </div>

                <CodePreview language="json">
                    {sampleCode}
                </CodePreview>

                <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary-600 mb-2">100%</div>
                        <div className="text-sm text-gray-600">Traceable to source</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-primary-600 mb-2">0</div>
                        <div className="text-sm text-gray-600">Hallucinations</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-primary-600 mb-2">JSON</div>
                        <div className="text-sm text-gray-600">Structured output</div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
